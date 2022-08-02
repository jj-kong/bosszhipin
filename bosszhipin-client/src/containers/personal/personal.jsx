/*
用户个人中心路由组件
*/
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Result, List, WhiteSpace, Button, Modal } from 'antd-mobile'
//import { Redirect } from 'react-router-dom';
import { resetUser } from '../../redux/actions';
import Cookies from 'js-cookie';
const Item = List.Item;
const Brief = Item.Brief;
const alert = Modal.alert;

class Personal extends Component {
    constructor() {
        super()
    }
    handleLoginOut = () => {
        alert('退出', '确认退出？', [
            { text: '取消' },
            {
                text: '确认', onPress: () => {
                    Cookies.remove('userid')
                    this.props.resetUser()
                }
            }
        ])
    }
    render() {
        const { user_message } = this.props;
        const { header, type, job, salary, username, info, company } = user_message;
        return (
            <div style={{ marginTop: 50, marginBottom: 50 }}>
                <Result
                    img={<img src={require(`../../images/headers/${header}.png`)} style={{ width: 50, height: 50 }} alt='header' />}
                    title={username}
                    message={company} // 如果company没有，这里默认不显示
                />
                <List renderHeader={() => '相关信息'}>
                    <Item multipleLine={true}>
                        <Brief>职位:{job}</Brief>
                        <Brief>简介:{info}</Brief>
                        {/* {salary ? <Brief>薪资:{salary}</Brief> : null} */}
                        {type === 'laoban' ? <Brief>薪资:{salary}</Brief> : null}
                    </Item>
                </List>
                <WhiteSpace />
                <Button type="warning" onClick={this.handleLoginOut}>退出登录</Button>
            </div>
        )
    }
}
export default connect(
    (state) => { return { user_message: state.userReducer } },
    { resetUser }
)(Personal);