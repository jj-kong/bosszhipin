/*对话消息列表组件，一看就知道是老板和大神消息列表组件的子组件*/
/*对话消息列表组件 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { List, Badge } from 'antd-mobile'
const Item = List.Item;
const Brief = Item.Brief
//对chatMsgs按照chat_id进行分组,并得到每个组的lastMsg组成的数组
function getLastMsgs(chatMsgs, userid) {
    //1.获得一个对象{chat_id:lastMsg}
    const lastMsgObj = {}
    chatMsgs.forEach(msg => {
        //对msg进行个体的统计
        if (msg.to === userid && !msg.read) {
            msg.unReadCount = 1
        } else {
            msg.unReadCount = 0
        }

        const chatId = msg.chat_id;
        let lastmsg = lastMsgObj[chatId];
        if (!lastmsg) {
            lastMsgObj[chatId] = msg;
        } else {
            const unReadCount = lastmsg.unReadCount + msg.unReadCount;
            if (msg.create_time > lastmsg.create_time) {
                lastMsgObj[chatId] = msg;
            }
            lastMsgObj[chatId].unReadCount = unReadCount;
        }

    })
    const lastMsgs = Object.values(lastMsgObj) //对象转数组
    console.log('最新消息数组', lastMsgs)
    lastMsgs.sort(function (m1, m2) {
        return m2.create_time - m1.create_time
    })
    console.log(lastMsgs, '~~~~~~~')
    return lastMsgs;

}

class Message extends Component {
    // handleClick = (targetUserId, msgUnReadCount) => {
    //     const { unReadCount } = this.props.userchat;
    //     this.setState({ unReadCount: 0 })
    //     this.props.history.push(`/chat/${targetUserId}`)
    // }
    render() {
        const { userstate } = this.props;
        const { users, chatMsgs } = this.props.userchat;
        //console.log('message中的chatMsgs', chatMsgs)  //和chat里面的是一样的chatMsgs，所有和当前用户相关的消息
        console.log(users, 'users***************')
        //对chatMsgs按照chat_id进行分组
        const lastMsgs = getLastMsgs(chatMsgs, userstate._id)
        return (
            <List style={{ marginTop: 45, marginBottom: 45 }}  >

                {
                    //1、第一种写法
                    // lastMsgs.map(msg => (
                    //     //在这里msg=>{XXX} 如使用{}则必须return ，用（）(即msg=>())则不用
                    //     <Item
                    //         key={msg._id}
                    //         extra={< Badge text={3} />}
                    //         thumb={msg.header ? require(`../../images/headers/${msg.header}.png`) : null}
                    //         arrow='horizontal'
                    //     >
                    //         {msg.content}
                    //         <Brief> {users[msg.from === users._id ? msg.to : msg.from].username}</Brief>
                    //     </Item >
                    // ))
                    //2、第种种写法
                    lastMsgs.map(msg => {
                        console.log(msg, "msg");
                        //const header = users[msg.from === userstate._id ? msg.to : msg.from].header;
                        const targetUserId = msg.from === userstate._id ? msg.to : msg.from;
                        const targetUser = users[targetUserId];
                        //console.log(targetUser, "tar")
                        return (<Item
                            key={msg._id}
                            extra={< Badge text={msg.unReadCount} />}
                            thumb={targetUser ? require(`../../images/headers/${targetUser.header}.png`) : null}
                            arrow='horizontal'
                            onClick={() => this.props.history.push(`/chat/${targetUserId}`)}
                        >
                            {msg.content}
                            <Brief> {targetUser.username}</Brief>
                        </Item >)
                    }
                    )
                }

            </List >
        )
    }
}
export default connect(
    state => { return { userstate: state.userReducer, userchat: state.chatReducer } },
    {}
)(Message)