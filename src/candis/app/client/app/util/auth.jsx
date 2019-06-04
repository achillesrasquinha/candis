import axios from 'axios'
import storage from 'store'


const setAuthorizationToken = (token) => {
    if(token){
        axios.defaults.headers.common['token'] = storage.get('JWT_TOKEN')
    }else{
        delete axios.defaults.headers.common['token']
    }
}

const setDefalutErrorHandler = (flag) => {
    if(flag){
        axios.interceptors.response.use(null, (error) => {
            const {response} = error
            if(response.status === 401){
                toastr.error(response.data.error.errors[0].message)
            }else{
                toastr.error("Something bad happened :(")
            }
            return Promise.reject(error)
        })
    }
}

export {  setAuthorizationToken as default , setDefalutErrorHandler }