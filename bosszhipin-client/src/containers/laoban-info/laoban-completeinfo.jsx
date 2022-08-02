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

class LaoBanCompleteInfo extends Component {
    state = {
        header: '',
        job: '',
        company: '',
        salary: '',
        info: ' '
    }
    handleChange = (attribute, val) => {
        this.setState(
            {
                [attribute]: val,
            }
        )

    }
    // toSave = () => {
    //     //this.props.history.replace('/login')
    //     console.log(this.state) //这里肯定要修改
    // }
    setHeader = (use_header) => {
        this.setState({ header: use_header })
    }
    render() {
        const { update_user } = this.props;
        if (update_user.header) { //如果用户信息已经完善，自动跳转到laoban主界面
            return <Redirect to='/laoban' />
        }
        return (
            <div>
                <NavBar type='primary'>老板信息完善</NavBar>
                <HeaderSelector setHeader={this.setHeader} />
                <WingBlank>
                    <WhiteSpace size="xm" />
                    <InputItem onChange={(val) => this.handleChange('job', val)} placeholder="输入岗位">招聘岗位：</InputItem>
                    <WhiteSpace size="xm" />
                    <InputItem onChange={(val) => this.handleChange('company', val)} placeholder="输入公司名字">公司名字：</InputItem>
                    <WhiteSpace size="xm" />
                    <InputItem onChange={(val) => this.handleChange('salary', val)} placeholder="输入薪资">职位薪资：</InputItem>
                    <TextareaItem rows={5} title='职位要求：' onChange={(val) => this.handleChange('info', val)}></TextareaItem>
                    <Button type='primary' onClick={() => {return  this.props.actionUpdate(this.state) }} >保存</Button>
                </WingBlank>
            </div>
        )

    }

}
export default connect(
    (state) => { return { update_user: state.userReducer } }
    , { actionUpdate }
)(LaoBanCompleteInfo)