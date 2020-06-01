import axios from 'axios'

export function request(config) {
    // 1.创建axios实例
    const instance = axios.create({
            //本接口为虚拟接口，真实接口请与王红元老师联系（coderwhy002）
            baseURL: "127.192.168.1",
            timeout: 5000
        })
        // 2.axios拦截器
        // 2.1请求拦截
    instance.interceptors.request.use(config => {
        return config
    }, err => {
        console.log(err);

    })



    // 3.发送真正的网络请求
    return instance(config)
}
