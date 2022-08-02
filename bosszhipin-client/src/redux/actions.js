/*action产生函数*/
import { AUTH_SUCCESS, ERROR_MSG, RECEIVE_USER, RESET_USER, RECEIVE_USER_LIST, RECEIVE_MSG, RECEIVE_MSG_LIST, MSG_READ } from "./action-types";
import { reqRegister, reqLogin, reqUpdateUser, reqUser, reqUserList, reqChatMsgList, reqReadMsg } from '../api/index';
//引入客户端io
import io from 'socket.io-client'
//读取某个聊天消息的同步action
function msgRead({ count, from, to }) {
    return { type: MSG_READ, data: { count, from, to } }
}


//接收一个消息的同步action
function receiveMsg(chatMsg, userid) {
    return { type: RECEIVE_MSG, data: { chatMsg, userid } }
}
//接收消息列表的同步action
function receiveMsgList({ users, chatMsgs, userid }) {
    return { type: RECEIVE_MSG_LIST, data: { users, chatMsgs, userid } }
}
/*初始化客户端socket.io*/
function initIO(dispatch, userid) { //
    if (!io.socket) {
        io.socket = io('ws://localhost:4000');
        io.socket.on('receiveMsg', function (chatMsg) {
            // if (chatMsg.from === userid || chatMsg.to === userid) {
            //     dispatch(receiveMsg(chatMsg, chatMsg.to === userid))
            // }
            console.log('客户端接收服务器发送的消息', chatMsg)
            //只有当chatMsg是与当前用户相关的消息，才去分发同步action保存消息
            if (userid === chatMsg.from || userid === chatMsg.to) {
                dispatch(receiveMsg(chatMsg, userid))
            }
        })
    }
}
//异步获取消息列表数据
async function getMsgList(dispatch, userid) {
    initIO(dispatch, userid);
    const response = await reqChatMsgList();
    const result = response.data;
    if (result.code === 0) {
        console.log('获取用户列表信息成功！')
        const { users, chatMsgs } = result.data;
        dispatch(receiveMsgList({ users, chatMsgs, userid }));
    }
}

//发送聊天信息
export function actionSendMsg({ from, to, content }) {
    return async (dispatch) => {
        console.log('客户端向服务器发送消息', { from, to, content })
        io.socket.emit('sendMsg', { from, to, content })
    }
}

//已读消息状态更新
export function actionReadMsg(from, to) {
    return async (dispatch) => {
        const response = await reqReadMsg(from);
        const result = response.data;

        if (result.code === 0) {
            //from谁发给我的谁
            const count = result.data;
            dispatch(msgRead({ count, from, to }));
        }
    }
}







//消息错误
function errorMsg(err_msg) {
    return { type: ERROR_MSG, data: err_msg };
}
//成功登录
function authSuccess(success_msg) {
    return { type: AUTH_SUCCESS, data: success_msg };
}
//接受用户信息
function receiveUser(userinfo) {
    return { type: RECEIVE_USER, data: userinfo }
}
//重置用户信息
export function resetUser(msg) {
    return { type: RESET_USER, data: msg }
}
//接收用户列表的同步action
export const receiveUserList = (userlist) => ({ type: RECEIVE_USER_LIST, data: userlist })





//异步登录
export function actionLogin(user) {
    //const user_info = { username, password };
    const { username, password } = user
    //前台表单验证
    if (!username) {
        return errorMsg('必须输入用户名!')
    } else if (!password) {
        return errorMsg('必须输入用户密码!')
    }
    //异步ajax请求、得到响应
    return async (dispatch) => {  //这里的dispatch函数由redux的store提供，用于向reducer发送action对象
        const response = await reqLogin(user);//await的作用是让异步请求拿到返回的结果对象，而不是promise对象
        const result = response.data;

        if (result.code === 0) { //  bosszhipin-server/routes中定义的用于处理登录处理的路由中使用res.send({code:0,data:user})返回登录结果，
            //  由此可知result对象具有code和data两个属性(成功了是这俩个属性，失败了是code和msg属性)；
            getMsgList(dispatch, result.data._id);
            dispatch(authSuccess(result.data)); //这里result.data就是user信息
        } else {
            dispatch(errorMsg(result.msg));
        }
    }
}
//异步注册
export function actionRegister({ username, password, password2, type }) {
    const user_info = { username, password, type };
    //前台表单验证
    if (!username || !password || !password2 || !type) {
        return errorMsg('用户名或密码或类型不能为空！');
    } else if (password !== password2) {
        return errorMsg('密码必须一致！');
    }
    //异步ajax请求、得到响应
    return async (dispatch) => {  //这里的dispatch函数由redux的store提供，用于向reducer发送action对象
        const response = await reqRegister(user_info);//await的作用是让异步请求拿到返回的结果对象，而不是promise对象
        const result = response.data;
        if (result.code === 0) { //  bosszhipin-server/routes中定义的用于处理登录处理的路由中使用res.send({code:0,data:user})返回登录结果，
            //  由此可知result对象具有code和data两个属性；
            getMsgList(dispatch, result.data._id);

            dispatch(authSuccess(result.data)); // res.send({ code: 0, data: { _id: user._id, username, type }})
        } else {
            dispatch(errorMsg(result.msg));// res.send({ code: 1, msg: '此用户已经存在' })
        }
    }
}
//异步更新用户信息
export function actionUpdate(user) {
    return async (dispatch) => {
        const response = await reqUpdateUser(user);
        const result = response.data;
        if (result.code === 0) { //更新用户信息成功
            dispatch(receiveUser(result.data))
        } else { //更新失败
            dispatch(resetUser(result.msg))
        }
    }
}

//异步获取用户信息
export function actionGetUser() {
    return async (dispatch) => {
        const response = await reqUser();
        const result = response.data;
        if (result.code === 0) { //更新用户信息成功
            getMsgList(dispatch, result.data._id);

            dispatch(receiveUser(result.data))
        } else { //更新失败
            dispatch(resetUser(result.msg))
        }
    }
}

//获取用户列表的异步action
export function actionGetUserList(type) {
    return async (dispatch) => {
        const response = await reqUserList(type);
        const result = response.data;
        if (result.code === 0) {
            dispatch(receiveUserList(result.data))
        }
    }
}

