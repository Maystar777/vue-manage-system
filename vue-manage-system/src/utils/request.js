import axios from 'axios';

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
    timeout: 5000
})

service.interceptors.request.use( config => {
    return config;
}, error => {
    console.log(error);
    return Promise.reject();
})

service.interceptors.response.use(response => {
    if(response.status === 200){
        return Promise.resolve(response);//response.data;
    }else{
        return Promise.reject(response);  // Promise.reject();
    }
}, error => {
    console.log(error);
    return Promise.reject();
})

export default service;



/*封装get/post/delete/query方法 */

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url,params) {
    return new Promise((resolve, reject)=>{
        axios.get(url,{
            params:params
        }).then(resp=>{
            resolve(resp.data);
        }).catch(err=>{
            reject(err.data)
        })
    });
  }

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */

 export function post(url,params) { 
     return new Promise((resolve,reject)=>{
        axios.post(url,params)
         .then(resp=>{
             resolve(resp.data);
         }).catch(err=>{
             reject(err.data)
         })
     });
  }

  /**
   * put方法，对应put请求
   * @param {String} url [请求的url地址]
   * @param {Object} params [请求时携带的参数]
   */
export function put(url,params) {
    return new Promise((resolve,reject)=>{
        axios.put(url,params)
        .then(resp=>{
            resolve(resp.data);
        }).catch(err=>{
            reject(err.data)
        })
    })
  }

    /**
   * deletes方法，对应delete请求
   * @param {String} url [请求的url地址]
   * @param {Object} params [请求时携带的参数]
   */
export function deletes(url,params) {
    return new Promise((resolve,reject)=>{
        axios.delete(url,{data: params})
        .then(resp=>{
            resolve(resp.data);
        }).catch(err=>{
            reject(err.data)
        })
    })
  }
