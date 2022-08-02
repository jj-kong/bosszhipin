/*
用户登录的路由组件
*/
import React, { Component } from "react";
import { WingBlank, WhiteSpace, NavBar, InputItem, List, Button } from 'antd-mobile';
import Logo from '../../components/logo/logo'

import { connect } from 'react-redux'
import { actionLogin } from "../../redux/actions";
import { Redirect } from "react-router-dom";


const Item = List.Item;
class Login extends Component {
    constructor() {
        super()
    }
    state = {
        username: '',
        password: '',
    }
    handleChange = (attribute, val) => {
        this.setState(
            {
                [attribute]: val,
            }
        )

    }
    login = () => {
        //console.log('注册了~~~'); // 这里后面肯定要改
        this.props.actionLogin(this.state)
    }
    toRegister = () => {
        this.props.history.replace('/register')
    }
    render() {
        const { redirectTo, msg } = this.props.userlogin;
        //console.log(this.props.userlogin.redirectTo)
        //console.log(redirctTo); //undefined 原来这里有问题,单词拼写错误
        //console.log('登录了~~');
        if (redirectTo) {
            console.log(redirectTo);
            return <Redirect to={redirectTo} /> //这里没return是不对的
        }
        return (
            <div>
                <NavBar type='primary'>B&nbsp;&nbsp;O&nbsp;&nbsp;S&nbsp;&nbsp;S&nbsp;&nbsp;直&nbsp;&nbsp;聘</NavBar>
                <Logo></Logo>
                <WingBlank>
                    <WhiteSpace size="xm" />
                    {msg ? <p className='err_class'>{msg}</p> : null}
                    <List>
                        <InputItem onChange={(val) => this.handleChange('username', val)} placeholder="输入用户名">用&nbsp;户&nbsp;名：</InputItem>
                        <WhiteSpace size="xm" />
                        <InputItem onChange={(val) => this.handleChange('password', val)} placeholder="输入密码">密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码：</InputItem>
                        <WhiteSpace size="xm" />
                        <Button onClick={this.login} type='primary'>登&nbsp;&nbsp;&nbsp;&nbsp;录</Button>
                        <WhiteSpace size="xm" />
                        <Button onClick={this.toRegister} >还没有帐户</Button>
                    </List>
                </WingBlank>

            </div>
        )

    }

}
export default connect(
    (state) => { return { userlogin: state.userReducer } },
    { actionLogin }
)(Login)