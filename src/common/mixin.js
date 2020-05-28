import { debounece } from './utils'
import { POP, NEW, SELL } from './const'
export const itemListenerMixin = {
    data() {
        return {
            itemListenerMixin: null
        }
    },
    mounted() {
        let newRefresh = debounece(this.$refs.scroll.refresh, 100)
        this.itemListenerMixin = () => {
            newRefresh()
        }
        this.$bus.$on('itemImgLoad', this.itemImgListener)

    }
}

export const tabControlMixin = {
    data: function() {
        return {
            currentType: POP
        }
    },
    methods: {
        tabClick(index) {
            switch (index) {
                case 0:
                    this.currentType = POP
                    break
                case 1:
                    this.currentType = NEW
                    break
                case 2:
                    this.currentType = SELL
                    break
            }
            console.log(this.currentType);
        }
    }
}