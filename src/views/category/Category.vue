<template>
  <div id="category">
    <nav-bar class="nav-bar"><div slot="center">商品分类</div></nav-bar>
    <div class="content">
      <tab-menu :categories="categories" @selectItem="selectItem"></tab-menu>
      <scroll id="tab-content" :data="[categoryData]"
        ref="scroll">
        <div>
          <tab-content-category :subcategories="showSubcategory"/>
          <tab-control :titles="['综合','新品','销量']" @itemClick="tabClick" class="tab-control"/>
          <goods-list :goods="showCategoryDetail"/>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import NavBar from '../../components/common/navbar/NavBar'

import TabMenu from './childComps/TabMenu'
import TabContentCategory from './childComps/TabContentCategory'

import TabControl from '../../components/content/tabControl/TabControl'
import GoodsList from '../../components/content/goods/GoodsList'

import Scroll from '../../components/common/scroll/Scroll'

import {getCategory,getSubCategory,getCategoryDetail} from '../../network/category'
import {POP,NEW,SELL} from '../../common/const'
import {tabControlMixin} from '../../common/mixin'

export default {
  name:"Category",
  components:{
    NavBar,
    TabMenu,
    TabControl,
    TabContentCategory,
    Scroll,
    GoodsList
  },
  mixins:[tabControlMixin],
  data(){
    return {
      categories:[],
      categoryData:{},
      currentIndex:-1
    }
  },
  created(){
    // 1.请求分类数据
    this.getCategory()

    // 2.监听图片加载完成
    this.$bus.$on('imgLoad',() =>{
      this.$refs.scroll.refresh()
    })
    
  },
  computed:{
    showSubcategory() {
		    if (this.currentIndex === -1) return {}
        return this.categoryData[this.currentIndex].subcategories
      },
      showCategoryDetail() {
        if (this.currentIndex === -1) return []        
		    return this.categoryData[this.currentIndex].categoryDetail[this.currentType]
      }
  },
  methods:{
    getCategory(){
      getCategory().then(res => {
        // console.log(res);
        // 1.获取分类数据
        this.categories = res.data.data.category.list
        // 2.初始化每个类别的子数据
        for(let i = 0;i < this.categories.length;i++){
          this.categoryData[i] = {
            subcategories:{},
            categoryDetail:{
              'pop':[],
              'new':[],
              'sell':[]
            }
          }
        }
        // 3.请求第一个分类数据
        this.getSubCategories(0)
      })
    },
    getSubCategories(index){
      this.currentIndex = index;
      const maitKey = this.categories[index].maitKey;
        
      getSubCategory(maitKey).then(res => {
        
        this.categoryData[index].subcategories = res.data.data
        this.categoryData = {...this.categoryData}
        this._getCategoryDetail(POP)
        this._getCategoryDetail(NEW)
        this._getCategoryDetail(SELL)
      })
    },
    _getCategoryDetail(type){
      // 1.获取请求的miniWallkey
      const miniWallkey = this.categories[this.currentIndex].miniWallkey;
      
      // 2.发送请求，传入miniWallkey和type
      getCategoryDetail(miniWallkey,type).then(res => {
        
        this.categoryData[this.currentIndex].categoryDetail[type] = res.data
        this.categoryData = {...this.categoryData}
      })
    },
    selectItem(index){
      
      this.getSubCategories(index)
    }
  }
}
</script>

<style scoped>
#category {
  height: 100vh;
}
.nav-bar {
  background-color: var(--color-tint);
  font-weight: 700;
  color: #fff;
}
.content {
    position: absolute;
    left: 0;
    right: 0;
    top: 44px;
    bottom: 49px;
    
    display: flex;
  }

  #tab-content {
    height: 100%;
    flex: 1;
  }
  /* .tab-control {
    position: fixed;
    top: 44px;
    left: 0;
    width: 100%;
  } */
</style>

