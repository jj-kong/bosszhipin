import React, { Component } from 'react'
import { List, Grid } from 'antd-mobile'
import PropTypes from 'prop-types'

export default class HeaderSelector extends Component {

  static propTypes = {
    setHeader: PropTypes.func.isRequired
  }
  state = {
    icon: null
  }
  constructor(props) {
    super(props)
    this.headerList = []
    for (let i = 1; i < 21; i++) {
      const text = `头像${i}`
      this.headerList.push({ text, icon: require(`../../images/headers/${text}.png`) })
    }
  }

  selectorHeader = ({ icon, text }) => {
    console.log(text)
    this.setState({ icon })
    this.props.setHeader(text);
  }

  render() {
    const { icon } = this.state;
    const gridHeader = icon ? (<div>已选头像:<img src={icon} alt='header' /> </div>) : '请选择头像'
    return (
      <List renderHeader={() => {return gridHeader}}> {/*这里必须写成return形式 */}
        <Grid data={this.headerList} columnNum={5} onClick={this.selectorHeader} />
      </List>
    )

  }
}