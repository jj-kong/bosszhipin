/*
 Logo组件
*/
import React, { Component } from "react";
import logo_img from '../../images/logo/logo.png';
import './logo.less';
export default class Logo extends Component {
    render() {
        return (
            <div  className='logo-container'>
                <img src={ logo_img} alt='logo' className='logo-img'></img>
            </div>
        )

    }

}