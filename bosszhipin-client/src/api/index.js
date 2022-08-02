/*
  包含n个接口请求函数的模块
  每个函数返回的都是promise对象,可以理解为对ajax的进一步封装，把ajax封装在具体调用的函数中，这样i曾的代码更加隐蔽
 */
import ajax from './ajax'
//请求注册
export const reqRegister = (user) => ajax('/register', user, 'POST')
//请求登录
export const reqLogin = (user) => ajax('/login', user, 'POST')
//更新用户信息
export const reqUpdateUser = (user) => ajax('/update', user, 'POST')
//查看用户信息
export const reqUser = () => ajax('/user') //默认get方式
//获取用户列表
export const reqUserList = (type) => ajax('/userlist', { type })
// 获取当前用户的聊天消息列表
export const reqChatMsgList = () => ajax('/msglist')
// 修改指定消息为已读
export const reqReadMsg = (from) => ajax('/readmsg', { from }, 'POST')