/* 
包含n个工具函数的模块
*/
/*
注册laoban -->/laobaninfo
注册dashen -->/dasheninfo
登录laoban -->/laobaninfo 或 /laoban
登录dashen -->/dasheninfo 或者/dashen
*/

export  function getRedirectPath(type, header) {
    let path = ''
    path += type === 'laoban' ? '/laoban' : '/dashen'
    if (!header) {
        path += 'info'
    }
    return path;
}