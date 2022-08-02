/*  
使用axios封装的ajax请求函数返回的promise的对象
*/
import axios from 'axios'
export default function ajax(url = '', data = {}, type = 'GET') {
    if (type === "GET" || type === 'get') {
        let str = '';
        for (let key in data) {
            str += key + '=' + data[key] + '&';
        }
        if (str !== '') {
            str = str.substring(0, str.length - 1);
        }
        url = url + '?' + str;
        return axios.get(url);
    }
    else {
        return axios.post(url, data)
    }

}