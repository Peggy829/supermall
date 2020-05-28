<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
      <tab-control :titles="['流行','新款','精选']" @tabClick='tabClick' ref="tabControl1" class="tab-control" v-show="isTabFixed"/>
    
    <scroll class="content" ref="scroll" :probe-type="3" 
            @scroll="contentScroll" :pull-up-load="true" @pullingUp="loadMore">
            
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view/>
      <tab-control :titles="['流行','新款','精选']" @tabClick='tabClick' ref="tabControl2"/>
      <goods-list :goods="showGoods" />
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>

    
  </div>
</template>

<script>
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'

import NavBar from '../../components/common/navbar/NavBar'
import Scroll from '../../components/common/scroll/Scroll'
import TabControl from '../../components/content/tabControl/TabControl'
import GoodsList from '../../components/content/goods/GoodsList'
import BackTop from '../../components/content/backTop/BackTop'

import {getHomeMultidata,getHomeGoods} from '../../network/home'
import {debounece} from '../../common/utils'

export default {
  name:"Home",
  components:{
    
    HomeSwiper,
    RecommendView,
    FeatureView,

    NavBar,
    Scroll,
    TabControl,
    GoodsList,
    BackTop
    
  },
  data(){
    return {
      banners:[],
      recommends:[],
      // 确定好数据模型才去请求数据，把数据放进list里，只需修改page
      goods:{
        'pop':{page:0,list:[]},
        'new':{page:0,list:[]},
        'sell':{page:0,list:[]}
      },
      currentType:'pop',
      isShowBackTop:false,
      tabOffsetTop: 0,
      isTabFixed:false,
      saveY:0
    }
  },
  computed:{
    showGoods(){
      return this.goods[this.currentType].list
    }
  },
  activated(){
    this.$refs.scroll.refresh()
    this.$refs.scroll.scrollTo(0,this.saveY,0)

  },
  deactivated(){
    this.saveY = this.$refs.scroll.scrollY
  },
  created(){
    // 1.请求多个数据
    this.getHomeMultidata()
    // 2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')

    
  },
  mounted(){
    // 3.监听item中图片加载完成
    const refresh = debounece(this.$refs.scroll.refresh,50)
    this.$bus.$on('itemImageLoad',() => {
      refresh()
    })

  },
 
  methods:{
    // 事件监听相关方法
    tabClick(index){
      switch (index){
        case 0:
          this.currentType='pop'
          break
        case 1:
          this.currentType='new'
          break
        case 2:
          this.currentType='sell'
          break
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index

    },
    backClick(){
      this.$refs.scroll.scrollTo(0,0)
    },
    contentScroll(position){

      // 1.判断backTop是否显示
      this.isShowBackTop = (-position.y) > 1000

      // 2.决定tabControl是否吸顶
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore() {
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad(){
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop      
    },
    // 网络请求相关方法
    // 1.请求多个数据
    getHomeMultidata(){
      getHomeMultidata().then(res => {
     
      this.banners = res.data.data.banner.list;
      this.recommends = res.data.data.recommend.list;
    })
    },
    
    // 2.请求商品数据
    getHomeGoods(type){
      const page = this.goods[type].page + 1
      getHomeGoods(type,page).then(res => {
        this.goods[type].list.push(...res.data.data.list)
        this.goods[type].page += 1
        
        // 上拉加载更多
        this.$refs.scroll.finishedPullUp()
        
    })
    }
  }
}
</script>

<style scoped>
#home {
  /* padding-top: 44px; */
  height: 100vh;
  position: relative;

}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
    position: relative;
    z-index: 9;
  /* position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9; */
}
.tab-control {
  position: relative;
  z-index: 9;
}
.content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
</style>