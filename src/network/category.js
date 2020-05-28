import { request } from './request'
export function getCategory() {
    return request({
        url: '/api/n3/category'
    })
}

export function getSubCategory(maitKey) {
    return request({
        url: '/api/n3/subcategory',
        params: {
            maitKey
        }

    })
}

export function getCategoryDetail(miniWallkey, type) {
    return request({
        url: '/api/n3/subcategory/detail',
        params: {
            miniWallkey,
            type
        }
    })
}