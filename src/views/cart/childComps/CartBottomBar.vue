<template>
  <div class="bottom-bar">
          <check-button :is-checked="isSelectAll" class="check-button" />
          <span>全选</span>
      <span class="price">
          合计：{{totalPrice}}
      </span>
      <span class="calculate">
          去计算：({{checkLength}})
      </span>
  </div>
</template>

<script>
import CheckButton from './CheckButton'
// import {mapGetters} from 'vuex'
export default {
    name:"CartBottomBar",
    components:{
        CheckButton
    },
    computed:{
        // ...mapGetters([cartList]),
        totalPrice() {
            return '￥' + this.$store.state.cartList.filter(item => {
                return item.checked
            }).reduce((preValue,item) => {
                return preValue + item.price * item.count
            },0).toFixed(2)
        },
        checkLength(){
            return this.$store.state.cartList.filter(item => item.checked).length
        },
        isSelectAll(){
            if(this.$store.state.cartList.length === 0) return false

            // 1.使用filter
            // return !(this.cartList.filter(item => !item.checked).length)

            // 2.使用find
            return !this.$store.state.cartList.find(item => !item.checked)
        }
    }

}
</script>

<style scoped>
    .bottom-bar{
        width: 100%;
        height: 44px;
        /* background-color: #eee; */
        position: fixed;
        bottom: 49px;
        left: 0;
        box-shadow: 0 -2px 3px rgba(0, 0, 0, .2);
        font-size: 14px;
        color: #888;
        line-height: 44px;
        padding-left: 35px;
        box-sizing: border-box;
    }
    
    .bottom-bar .check-button {
        position: absolute;
        line-height: 0;
        left: 12px;
        top: 13px;
    }
    .bottom-bar .price {
        margin-left: 15px;
        font-size: 16px;
        color: #666;
    }
    .bottom-bar .calculate {
        background-color: orangered;
        color: #fff;
        width: 100px;
        height: 44px;
        text-align: center;
        line-height: 44px;
        float: right;
    }
</style>