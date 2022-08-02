/*
应用主界面路由组件
*/
import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import userReducer from '../../redux/reducers'

import LaoBanCompleteInfo from "../laoban-info/laoban-completeinfo";
import DaShenCompleteInfo from "../dashen-info/dashen-completeinfo";
import Laoban from "../laoban/laoban";
import Dashen from "../dashen/dashen";
import Message from "../message/message";
import Personal from "../personal/personal";
import NotFound from "../../components/not-found/not-found";

import { actionGetUser } from "../../redux/actions";
import Cookies from 'js-cookie'
import { getRedirectPath } from "../../untils";

import { NavBar } from 'antd-mobile'
import NavFooter from "../../components/nav-footer/nav-footer";

import Chat from '../chat/chat'

class Main extends Component {
    //给组件对象添加属性
    navList = [
        {
            path: '/laoban',
            component: Laoban,
            title: '大神列表',
            icon: 'dashen',
            text: '大神'
        },
        {
            path: '/dashen',
            component: Dashen,
            title: '老板列表',
            icon: 'laoban',
            text: '老板'
        },
        {
            path: '/message',
            component: Message,
            title: '消息列表',
            icon: 'message',
            text: '消息'
        },
        {
            path: '/personal',
            component: Personal,
            title: '个人中心',
            icon: 'personal',
            text: '个人'
        }
    ]


    componentDidMount() { //第一次render后才触发
        const userid = Cookies.get('userid');
        const { _id } = this.props.user_login;
        if (userid && !_id) {
            this.props.actionGetUser()
        }
    }
    render() {
        //自动登录
        //1.读取cookie中的userid
        const userid = Cookies.get('userid')
        //1.1如果cookie没有userid,自动重定向到登陆界面
        if (!userid) {
            return <Redirect to='/login' />
        }
        //1.2如果cookie中有userid，就读取redux中的user（我这里是userReducer）状态
        const { user_login } = this.props;
        //1.2.1如果user中没有_id,返回null(不做任何显示)
        if (!user_login._id) {
            return null
        } else {
            //1.2.2如果user中有_id，显示对应界面
            //1.2.2.1如果请求的是根路径，根据user的type和header来计算出一个重定向的路由路径，并自动重定向
            let path = this.props.location.pathname;
            if (path === '/') {
                path = getRedirectPath(user_login.type, user_login.header);
                return <Redirect to={path} />
            }
        }
        const { navList } = this
        const path = this.props.location.pathname;
        const currentNav = navList.find(v => v.path === path) //返回值为navList数组中的一个完整的对象
        //决定哪个路由需要隐藏
        if (currentNav) {
            //决定哪个路由需要隐藏
            if (user_login.type === 'laoban') {
                //隐藏数组的第2个
                navList[1].hide = true
            } else {
                //隐藏数组的第1个
                navList[0].hide = true
            }
        }
        return (
            <div>
                {currentNav ? <NavBar className="sticky-header">{currentNav.title}</NavBar> : null}
                <Switch>
                    {
                        navList.map(value => <Route path={value.path} component={value.component}></Route>)
                    }
                    <Route path='/laobaninfo' component={LaoBanCompleteInfo}></Route>
                    <Route path='/dasheninfo' component={DaShenCompleteInfo}></Route>
                    <Route path='/chat/:userid' component={Chat}></Route>
                    <Route component={NotFound}></Route>
                </Switch>
                {currentNav ? <NavFooter navList={navList} unReadCount={this.props.user_chat.unReadCount} /> : null}
            </div >
        )

    }

}
export default connect(
    (state) => { return { user_login: state.userReducer, user_chat: state.chatReducer } },
    { actionGetUser }
)(Main)

/*1.实现自动登录
  1.componentDidMount()
    登录过（cookie中有userid）,但还没登录（redux管理的userReducer中没有_id）,发送请求获取user -->比如说登陆过后，关了浏览器，但是在cookie存储的时间内，userid还存在
  2.render()
    1)如果cookie中没有userid,直接重新定向到login
    2)判断redux管理的user中是否有_id，如果有，暂时不做任何显示
    3）如果有，说明当前已经登录，显示对应界面
    4）如果请求根路径：根据user的type和header来计算一个重定向的路由路径，并自动重定向
*/