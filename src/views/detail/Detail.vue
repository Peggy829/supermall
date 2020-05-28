<template>
  <div id="detail">
      <detail-nav-bar  @titleClick="titleClick" :current-index="currentIndex" ref="nav"></detail-nav-bar>
     
      <scroll class="content" ref="scroll" @scroll="contentScroll" :probe-type="3">
        <detail-swiper :top-images="topImages"></detail-swiper>
        <detail-base-info :goods="goods"></detail-base-info>
        <detail-shop-info :shop="shop"></detail-shop-info>
        <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
        <detail-param-info ref="param" :param-info="paramInfo"/>
        <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
        <goods-list ref="recommend" :goods="recommends"></goods-list>
      </scroll>
      <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    <toast :message="message" :show="show" />
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'
import BackTop from '../../components/content/backTop/BackTop'
import Toast from '../../components/common/toast/Toast'


import Scroll from '../../components/common/scroll/Scroll'
import GoodsList from '../../components/content/goods/GoodsList'

import {getDetail,Goods,Shop, GoodsParam,getRecommend} from '../../network/detail'
import {itemListenerMixin} from '../../common/mixin'

// import { mapActions } from 'vuex'

export default {
    name:"Detail",
    components:{
        DetailNavBar,
        DetailSwiper,
        DetailBaseInfo,
        DetailShopInfo,
        DetailGoodsInfo,
        DetailParamInfo,
        DetailCommentInfo,
        GoodsList,
        DetailBottomBar,
        BackTop,
        Toast,
        Scroll
    },
    mixins:[itemListenerMixin],
    data(){
        return {
            iid:null,
            topImages:[],
            goods:{},
            shop:{},
            detailInfo:{},
            paramInfo:{},
            commentInfo:{},
            recommends:[],
            themeTops:[],
            currentIndex:0,
            isShowBackTop:false,
            message:'',
            show:false
            
        }
        
    },
    created(){
        // 1.保存传入的id
        this.iid = this.$route.params.iid

        // 2.根据iid请求详情数据
        getDetail(this.iid).then(res => {
            // 1.获取顶部轮播图播放数据
            const data = res.data.result
            this.topImages = data.itemInfo.topImages

            // 2.获取商品信息
            this.goods = new Goods(data.itemInfo,data.columns,data.services)
            
            // 3.获取店铺信息
            this.shop = new Shop(data.shopInfo)
            
            // 4.获取商品的详细信息
            this.detailInfo = data.detailInfo

            // 5.获取参数信息
            this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

            // 6.获取评论信息
            if(data.rate.cRate !== 0){
                this.commentInfo = data.rate.list[0] || {}
            }
        })

        // 3.请求推荐数据
        getRecommend().then(res => {
            this.recommends = res.data.data.list

        })

    },
    updated(){
            // 获取对应的offsetTop

            

    },
    methods:{
        // ...mapActions(['addToCart']),

        imageLoad() {
            this.$refs.scroll.refresh()
            this.themeTops = []
            this.themeTops.push(0)
            this.themeTops.push(this.$refs.param.$el.offsetTop)
            this.themeTops.push(this.$refs.comment.$el.offsetTop)
            this.themeTops.push(this.$refs.recommend.$el.offsetTop)
            
        },
        titleClick(index){
            
            
            this.$refs.scroll.scrollTo(0,-this.themeTops[index],500)
        },
        contentScroll(position){
            // 1.获取y值
            const positionY = -position.y
            // 2.positionY和主题中的值进行比较
            let length = this.themeTops.length
            for(let i = 0;i < length-1;i++){
                if(this.currentIndex !== i && (positionY >= this.themeTops[i] && positionY < this.themeTops[i+1])){
                    this.currentIndex = i
                    this.$refs.nav.currentIndex = this.currentIndex
                }
            }
            this.isShowBackTop = (-position.y) > 1000


        },
        backClick(){
            this.$refs.scroll.scrollTo(0,0)
        },
        addToCart(){
            // 1.获取购物车所需要的信息
            const product = {}
            product.image = this.topImages[0]
            product.title = this.goods.title
            product.desc = this.goods.desc
            product.price = this.goods.realPrice
            product.iid = this.iid

            // 2.将商品添加到购物车里
            // this.$store.commit('addToCart',product)
             this.$store.dispatch('addToCart',product).then(res => {
                this.show = true
                this.message = res

                setTimeout(() => {
                    this.show = false
                    this.message = ''
                },1500)
                 
             })
            // this.addToCart(product).then(res => {
                
            // })
	        // this.$toast({message: '加入购物车成功'})

            // 3.添加到购物车成功

        }
    }
}
</script>

<style scoped>
#detail {
    height: 100vh;
    background-color: #fff;
    position: relative;
    z-index: 999;
  }

  

  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 58px;
    left: 0;
    right: 0;
  }

</style>