/*底部导航的UI组件*/
import React, { Component } from "react";
import PropsTypes from "prop-types";
import { TabBar } from "antd-mobile";
import { withRouter } from "react-router-dom";//希望在非路由组件中使用路由库的api，诸如location、history、match等
import { PropsType } from "prop-types";

const Item = TabBar.Item
class NavFooter extends Component {
    static propsType = {
        navList: PropsTypes.array.isRequired,
        unReadCount: PropsTypes.number.isRequired
    }
    render() {
        let { navList } = this.props
        //过滤掉hide为true的nav
        navList = navList.filter(nav => !nav.hide)
        const path = this.props.location.pathname //请求的path
        // 就是实现这个功能<TabBar><Item>这里面会有文字和图标</Item>   <Item></Item> <Item></Item>  </TabBar>并固定在底部
        const unReadCount = this.props.unReadCount;
        return (
            <TabBar>
                {
                    navList.map((nav) => (<Item
                        badge={nav.path === '/message' ? unReadCount : 0}
                        key={nav.path}
                        title={nav.text}
                        icon={{ uri: require(`./images/${nav.icon}.png`) }}
                        selectedIcon={{ uri: require(`./images/${nav.icon}-selected.png`) }}
                        selected={path === nav.path}
                        onPress={() => this.props.history.replace(nav.path)} />))
                }
            </TabBar>
        )
    }
}
export default withRouter(NavFooter)