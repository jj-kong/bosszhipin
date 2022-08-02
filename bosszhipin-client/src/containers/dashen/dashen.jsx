/*
 大神的主路由组件，
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'

import UserList from '../../components/user-list/user-list';
import { actionGetUserList } from '../../redux/actions'

class Dashen extends Component {
    componentDidMount() {
        // 获取获取userList
        this.props.actionGetUserList('laoban')
    }
    render() {
        return (
            <UserList userList={this.props.userlist} />
        )
    }
}
export default connect(
    (state) => { return { userlist: state.userList } },
    { actionGetUserList }
)(Dashen);