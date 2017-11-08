import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import PortalNavbar from '../components/common/Navbar/PortalNavbar';

import Login from '../components/pages/Login/Index';
import DuoLogin from '../components/pages/DuoLogin/Index';
import ForgetPassword from '../components/pages/ForgetPassword/Index';
import ResetPassword from '../components/pages/ResetPassword/Index';
import CreateAccount from '../components/pages/CreateAccount/Index';
import GoVerifyEmail from '../components/pages/GoVerifyEmail/Index';
import VerifyEmail from '../components/pages/VerifyEmail/Index';
import Ban from '../components/pages/Ban/Index';

import classnames from 'classnames/bind';
// import style from './App.css';
//const cx = classnames.bind(style);

export default class MainLayout extends Component {
  render() {
    return (
      <div>
        <PortalNavbar />
        <Route exact path="/" component={Login} />
        <Route exact path="/forget_password" component={ForgetPassword} />
        <Route exact path="/create_account" component={CreateAccount} />
        <Route exact path="/duo_login/:token" component={DuoLogin} />
        <Route exact path="/go_verify_email/:email" component={GoVerifyEmail} />
        <Route exact path="/verify_email/:id/:code" component={VerifyEmail} />
        <Route exact path="/ban" component={Ban} />
        <Route
          exact
          path="/reset_password/:id/:code"
          component={ResetPassword}
        />
      </div>
    );
  }
}
