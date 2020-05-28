import {
    INCREMENT_COUNT,
    ADD_TO_CART
} from './mutation-types'


export default {
    addToCart(context, payload) {
        // 查找之前数组中是否有该商品
        // console.log("-----");
        return new Promise((resolve, reject) => {
            let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

            // 判断oldProduct
            if (oldProduct) { //数量加一
                context.commit(INCREMENT_COUNT, oldProduct)
                resolve('当前的商品数量+1')
            } else { //添加新的商品
                payload.checked = true
                payload.count = 1
                context.commit(ADD_TO_CART, payload)
                resolve('商品添加购物车成功')
            }
        })

    }
}