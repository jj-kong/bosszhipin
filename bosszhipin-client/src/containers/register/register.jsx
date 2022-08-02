/*
用户注册的路由组件
*/
import React, { Component } from "react";
import { WingBlank, WhiteSpace, NavBar, InputItem, Radio, List, Button } from 'antd-mobile';
import Logo from '../../components/logo/logo'

import { actionRegister } from '../../redux/actions'
import { connect } from "react-redux";
import { Redirect } from "react-router";

const Item = List.Item;
class Register extends Component {
    constructor() {
        super()
    }
    state = {
        username: '',
        password: '',
        password2: '',
        type: 'dashen'
    }
    handleChange = (attribute, val) => {
        this.setState(
            {
                [attribute]: val,
            }
        )
    }
    register = () => {
        //console.log('注册了~~~'); // 这里后面肯定要改
        this.props.actionRegister(this.state) //把当前表单页面的信息发送给服务器
        //const {redirectTo, msg } = this.props.userreducer; //redirectTo来自reducer处理后的状态
        //console.log(redirectTo);  //这里输出全是空的东西
    }
    toLogin = () => {
        this.props.history.replace('/login')
        //console.log(this.state)
    }
    render() {
        const { type } = this.state;
        console.log('注册了~~~');
        const { redirectTo, msg } = this.props.userreducer; //redirectTo来自reducer处理后的状态
        console.log(redirectTo);

        if (redirectTo) {
            console.log(redirectTo);
            return <Redirect to={redirectTo} />  //   一定要注意return一下啊
            //this.props.history.replace('/dasheninfo')
        }
        return (
            <div>
                <NavBar type='primary'>B&nbsp;&nbsp;O&nbsp;&nbsp;S&nbsp;&nbsp;S&nbsp;&nbsp;直&nbsp;&nbsp;聘</NavBar>
                <Logo></Logo>
                <WingBlank>
                    {msg ? <p className='err_class'>{msg}</p> : null}  {/* 页面报错提示 */}
                    <List>
                        <InputItem onChange={(val) => this.handleChange('username', val)} placeholder="输入用户名">用&nbsp;户&nbsp;名：</InputItem>
                        <WhiteSpace size="xm" />
                        <InputItem onChange={(val) => this.handleChange('password', val)} placeholder="输入密码">密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码：</InputItem>
                        <WhiteSpace size="xm" />
                        <InputItem onChange={(val) => this.handleChange('password2', val)} placeholder="输入确认密码">确认密码：</InputItem>
                        <WhiteSpace size="xm" />
                        <Item>
                            <span style={{ marginRight: 30 }}>用户类型:</span>&nbsp;&nbsp;&nbsp;&nbsp;<Radio checked={this.state.type === 'dashen'} onChange={() => this.handleChange('type', 'dashen')}>大神</Radio>&nbsp;&nbsp;&nbsp;&nbsp;<Radio checked={this.state.type === 'laoban'} onChange={() => this.handleChange('type', 'laoban')}>老板</Radio>
                        </Item>
                        <WhiteSpace size="xm" />
                        <Button onClick={this.register} type='primary'>注&nbsp;&nbsp;&nbsp;&nbsp;册</Button>
                        <WhiteSpace size="xm" />
                        <Button onClick={this.toLogin} >已有帐户</Button>
                    </List>
                </WingBlank>
            </div>
        )

    }
}
export default connect(
    //mapStateToProps
    (state) => { return { userreducer: state.userReducer } }, //这里把reducer处理后得到的state给了props,props上就有了属性userreducer,而userreducer属性就是接受store的dispatch过来的action对state进行处理返回一个新的state.
    //mapDispatchToProps
    { actionRegister }
)(Register)