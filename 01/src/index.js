import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter,Route} from 'react-router-dom';

import HomeLayout from './layouts/HomeLayout'

import UserAddPage from './pages/UserAdd'
import HomePage from './pages/Home'
import UserListPage from './pages/UserList'

ReactDOM.render((
    <HashRouter>
        <div>
            <Route path="/" component={HomePage}/>
            <Route path="/user/add" component={UserAddPage}/>
            <Route path="/user/list" component={UserListPage}/>
        </div>
    </HashRouter>
), document.getElementById('app'));