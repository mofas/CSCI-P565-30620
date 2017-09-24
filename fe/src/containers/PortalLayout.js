import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Login from '../components/pages/Login/Index';
import ForgetPassword from '../components/pages/ForgetPassword/Index';
import CreateAccount from '../components/pages/CreateAccount/Index';
import VerifyEmail from '../components/pages/VerifyEmail/Index';

import classnames from 'classnames/bind';
// import style from './App.css';
//const cx = classnames.bind(style);

export default class MainLayout extends Component {
  render() {
    return (
      <div>
        <Route exact path="/" component={Login} />
        <Route exact path="/forget_password" component={ForgetPassword} />
        <Route exact path="/create_account" component={CreateAccount} />
        <Route exact path="/verify_email" component={VerifyEmail} />
      </div>
    );
  }
}
