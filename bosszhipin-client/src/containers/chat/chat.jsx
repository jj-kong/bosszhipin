/*对话聊天的路由组件 */
import React, { Component } from 'react'
import { NavBar, List, InputItem, Grid, Icon } from 'antd-mobile'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'

import { actionSendMsg, actionReadMsg } from '../../redux/actions'


const Item = List.Item
class Chat extends Component {
    state = {
        content: '',
        isShow: false //是否显示表情列表

    }
    //第一次render()之前,使得表情数组就有了，即初始化表情数组
    componentWillMount() {
        const emojis = ['😀', '😅', '🥰', '😍', '🥰', '☺️', '😀', '😅',
            '🥰', '😍', '🥰', '☺️', '😀', '😅', '🥰', '😍',
            '🥰', '☺️', '😀', '😅', '🥰', '😍', '🥰', '☺️',
            '😀', '😅', '🥰', '😍', '🥰', '☺️', '😀', '😅']
        this.emojis = emojis.map(val => ({
            text: val
        }))
        // 切换表情列表的显示 
        this.toggleShow = () => {
            const isShow = !this.state.isShow
            this.setState({ isShow })
            if (isShow) {
                // 异步手动派发 resize 事件,解决表情列表显示的 bug
                setTimeout(() => { window.dispatchEvent(new Event('resize')) }, 0)
            }
        }
    }
    componentDidMount() {
        // 初始显示列表 
        window.scrollTo(0, document.body.scrollHeight)

    }
    componentDidUpdate() { // 更新显示列表 
        window.scrollTo(0, document.body.scrollHeight)
    }
    componentWillUnmount() {
        //发送请求更新消息的未读状态
        const from = this.props.match.params.userid //接收方的id
        const to = this.props.userReducer._id
        this.props.actionReadMsg(from, to)
    }
    handClick = () => {
        //1.收集数据
        const from = this.props.userReducer._id //我的id;
        console.log('发送方id', from);
        const to = this.props.match.params.userid //接收方的id
        console.log('接收方id', to)
        const content = this.state.content.trim();
        //2.发送消息
        if (content) {
            this.props.actionSendMsg({ from, to, content }) //异步发送，发送数据给服务器
        }
        //3.更新状态
        this.setState({ content: '', isShow: false }) //如果只更新组件内部的状态,是不对的，还应该更新inputItem里面的value
    }

    render() {
        const { userReducer } = this.props;
        const { users, chatMsgs } = this.props.user_chat;

        //计算当前和我相关的msg的id
        const myId = userReducer._id; //当前界面用户的id 
        //console.log('chatMsgs', chatMsgs, 'myid', myId, '总消息数：', chatMsgs.length) //过滤前的消息数组是所有和我相关的消息
        if (!users[myId]) { //如果还没有获取到数据，直接不做显示
            return null;
        }
        const targetId = this.props.match.params.userid;
        //计算chat_id
        const curChatId = [myId, targetId].sort().join('_');
        //对chatMsgs进行过滤
        const msgs = chatMsgs.filter(msg => msg.chat_id === curChatId);
        //console.log('过滤后的总消息数：', msgs.length,"********",msgs) //过滤后的消息数组是所有我和当前界面指定用户的消息
        const targetHeader = users[targetId].header;
        const targetUserName = users[targetId].username;
        const targetIcon = targetHeader ? require(`../../images/headers/${targetHeader}.png`) : null
        //得到本人的header图片对象
        const myHeader = users[myId].header
        console.log('myheader', myHeader)
        const myIcon = myHeader ? require(`../../images/headers/${myHeader}.png`) : null
        return (
            <div id='chat-page'>
                <NavBar icon={<Icon type='left' />}
                    className='sticky-header'
                    onLeftClick={() => this.props.history.goBack()}
                >{targetUserName}</NavBar>
                <List style={{ marginTop: 45, marginBottom: 45 }}      >
                    {/* <QueueAnim type='alpha' delay={1}> */}
                    {
                        msgs.map(msg => {
                            if (msg.to === myId) { //别人发给我
                                return <Item key={msg._id} thumb={targetIcon} > {msg.content} </Item>
                            } else { //我发给别人
                                return <Item key={msg._id} className='chat-me' thumb={myIcon} > {msg.content} </Item>
                            }

                        })}
                    {/* </QueueAnim> */}



                </List>
                <div className='am-tab-bar'>
                    <InputItem placeholder="请输入"
                        value={this.state.content}
                        onChange={(val) => this.setState({ content: val })}
                        onFocus={() => this.setState({ isShow: true })}
                        extra={
                            <span>
                                <span onClick={this.toggleShow} style={{ marginRight: 5, display: 'inline-block', textAlign: 'center', fontSize: 12 }} >😀</span>
                                <span onClick={this.handClick}>发送</span>
                            </span>} />
                    {this.state.isShow ?
                        (<Grid
                            data={this.emojis}
                            columnNum={8}
                            carouselMaxRow={4}
                            isCarousel={true}
                            onClick={(item) => {
                                this.setState({ content: this.state.content + item.text })
                            }} />) : null}
                </div>
            </div>)
    }
}
export default connect(
    (state) => { return { userReducer: state.userReducer, user_chat: state.chatReducer } },
    { actionSendMsg, actionReadMsg }
)(Chat)