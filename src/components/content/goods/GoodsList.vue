<template>
  <div class="goods-list">
      <goods-list-item v-for="item in goods" :goods-item="item" :key="item.index" class="item"></goods-list-item>
  </div>
</template>

<script>

import GoodsListItem from './GoodsListItem'

export default {
  name:"GoodList",
  components:{
    GoodsListItem
  },
  props:{
    goods:{
      type:Array,
      default(){
        return []
      }
    }
  }
}
</script>

<style>
.goods-list {
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
  justify-content: space-around;
}
.goods-list .item {
  width: 48%;
}
</style>