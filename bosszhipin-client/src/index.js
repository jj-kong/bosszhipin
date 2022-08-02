import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Switch, Route } from 'react-router-dom'


import Register from './containers/register/register';
import Login from './containers/login/login';
import Main from './containers/main/main'

import { Provider } from 'react-redux'
import store from './redux/store'
import './assets/less/index.less' //只要在入口文件中引入了样式，那么就不用在各个子组件里引入样式了

// import './test/socketio_test'

ReactDOM.render((
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route path='/register' component={Register}></Route>
                <Route path='/login' component={Login}></Route>
                <Route component={Main}                                                                                                                                                                            ></Route>
            </Switch>
        </HashRouter>
    </Provider>
), document.getElementById('root'));
