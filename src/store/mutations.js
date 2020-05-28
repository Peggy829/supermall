import {
    INCREMENT_COUNT,
    ADD_TO_CART
} from './mutation-types'

const mutations = {
    [INCREMENT_COUNT](state, payload) {
        payload.count++
    },
    [ADD_TO_CART](state, payload) {
        state.cartList.push(payload)
    }
}


export default mutations