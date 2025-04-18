import axios from "axios"

const BASE_URL = 'https://thanhduong.pythonanywhere.com/'

export const endpoints = {
    'categories': '/categories/',
    'courses' : '/courses/',
    'register': '/users/',
    'login': '/o/token/',
    'current-user': '/users/current-user/',
}

export const authApis = (token) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

export default axios.create({
    baseURL: BASE_URL
});