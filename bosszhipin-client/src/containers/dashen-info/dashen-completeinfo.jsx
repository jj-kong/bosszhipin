/*
大神信息完善组件
*/
import React, { Component } from "react";
import { WingBlank, WhiteSpace, NavBar, InputItem, Button, TextareaItem } from 'antd-mobile';
import Logo from '../../components/logo/logo';
import HeaderSelector from '../../components/header-selector/header-selector'

import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { actionUpdate } from "../../redux/actions"

class DaShenCompleteInfo extends Component {
    state = {
        header: '',
        job: '',
        info: ''
    }
    handleChange = (attribute, val) => {
        this.setState(
            {
                [attribute]: val,
            }
        )

    }
    toSave = () => {
        //this.props.history.replace('/login')
        //console.log(this.state) //这里肯定要修改
        this.props.actionUpdate(this.state) //保存的目的是为了更新用户信息
    }
    setHeader = (header) => {
        this.setState({ header })
    }
    render() {
        const { header, type } = this.props.update_user;
        if (header) {
            const path = type === 'dashen' ? '/dashen' : '/laoban'
            return <Redirect to={path} /> //一定要return啊，否则就不能实现页面的跳转了
        }
        return (
            <div>
                <NavBar type='primary'>大神信息完善</NavBar>
                <HeaderSelector setHeader={this.setHeader} />
                <WingBlank>
                    <WhiteSpace size="xm" />
                    <InputItem onChange={(val) => this.handleChange('job', val)} placeholder="输入岗位">求职岗位：</InputItem>
                    <WhiteSpace size="xm" />
                    <TextareaItem rows={5} title='个人介绍：' onChange={(val) => this.handleChange('info', val)}></TextareaItem>
                    <Button type='primary' onClick={this.toSave} >保存</Button>
                </WingBlank>

            </div>
        )

    }

}

export default connect(
    state => { return { update_user: state.userReducer } },
    { actionUpdate }
)(DaShenCompleteInfo)