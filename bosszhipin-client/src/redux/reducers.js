/*
包含多个用于生成新的state的reducer函数模块
 */
import { combineReducers } from "redux";
import { AUTH_SUCCESS, ERROR_MSG, RECEIVE_USER, RESET_USER, RECEIVE_USER_LIST, RECEIVE_MSG, RECEIVE_MSG_LIST, MSG_READ } from "./action-types";
import { getRedirectPath } from '../untils/index';
// function XX(state=0,action){
//     return state;
// }
// export default combineReducers({
//     XX
// })
//state初始化
const initUser = {
    username: '',
    password: '',
    type: '',
    msg: '',//错误提示信息
    redirectTo: '' // 需要跳转的路由path
}
function userReducer(state = initUser, action) {
    switch (action.type) {
        case AUTH_SUCCESS:
            //function authSuccess(success_msg) {return { type: AUTH_SUCCESS, data: success_msg }};success_msg:就是user信息
            return { ...action.data, redirectTo: getRedirectPath(action.data.type, action.data.header) }
        case ERROR_MSG:
            ////消息错误function errorMsg(err_msg) {return { type: ERROR_MSG, data: err_msg };}
            return { ...state, msg: action.data }

        case RECEIVE_USER:
            return action.data
        case RESET_USER:
            return { ...initUser, msg: action.msg }
        default:
            return state;
    }
}
const initUserList = []
//产生userList状态的reducer
function userList(state = initUserList, action) {
    switch (action.type) {
        case RECEIVE_USER_LIST:
            return action.data
        default:
            return state
    }
}

const initChat = {
    users: {}, //所有用户对象，属性名：userid, 属性值：{userid:{username,header}}
    chatMsgs: [],  //当前用户所有相关msg的数组
    unReadCount: 0 //总的未读数量

}
//产生聊天状态的reducer
function chatReducer(state = initChat, action) {
    switch (action.type) {
        case RECEIVE_MSG: //返回的消息数据格式：data: chatMsg  chatMsg的数据格式：{ chat_id, from, to, create_time content }
            const { chatMsg, userid } = action.data; //注意：这里这样写是错误的：chatMsg = action.data，无法实时显示对话消息,在这里userid只能解构一次上面解构了下面就不能够再解了，否则报错！
            return { users: state.users, chatMsgs: [...state.chatMsgs, chatMsg], unReadCount: state.unReadCount + (!chatMsg.read && chatMsg.to === userid ? 1 : 0) }
        case RECEIVE_MSG_LIST: //传入的数据 data:{users,chatMsgs}
            const { users, chatMsgs } = action.data;
            return { users, chatMsgs, unReadCount: chatMsgs.reduce((pre, msg) => pre + (!msg.read && msg.to === action.data.userid ? 1 : 0), 0) }
        case MSG_READ:
            const { count, from, to } = action.data;
            return {
                users: state.users,
                chatMsgs: state.chatMsgs.map(msg => {
                    if (msg.from === from && msg.to === to && !msg.read) {
                        return { ...msg, read: true }
                    } else {
                        return msg
                    }
                }),
                unReadCount: state.unReadCount - count
            }
        default:
            return state;
    }

}


//返回合并的reducer
export default combineReducers({
    userReducer,
    userList,
    chatReducer,
})