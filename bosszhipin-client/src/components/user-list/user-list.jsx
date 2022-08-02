/*用户列表组件 */
import React, { Component } from 'react'
import { WingBlank, Card, WhiteSpace } from 'antd-mobile'
import PropTypes from 'prop-types'
import QueueAnim from 'rc-queue-anim'
import { withRouter } from 'react-router-dom';
const Header = Card.Header;
const Body = Card.Body;

class UserList extends Component {
    static propTypes = {
        userList: PropTypes.array.isRequired
    }
    render() {
        const { userList } = this.props;
        return (<WingBlank style={{ marginBottom: 50, marginTop: 50 }}>
            <QueueAnim delay={100}>
                {userList.map(user => <div key={user._id}>
                    <Card onClick={() => { this.props.history.push(`/chat/${user._id}`) }}>
                        <Header thumb={require(`../../images/headers/${user.header}.png`)}
                            extra={<span>{user.username}</span>} />
                        <Body>
                            <div>职位：{user.job}</div>
                            {user.company ? <div>公司：{user.company}</div> : null}
                            {user.salary ? <div>薪水：{user.salary}</div> : null}
                            <div>描述：{user.info}</div>
                        </Body>

                    </Card></div>)
                }
            </QueueAnim>

            <WhiteSpace />
            <WhiteSpace />
        </WingBlank>)

    }
}
export default withRouter(UserList)