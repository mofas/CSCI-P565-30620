import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Landing from '../components/pages/Landing/Index';

import classnames from 'classnames/bind';
// import style from './App.css';
// const cx = classnames.bind(style);

export default class MainLayout extends Component {
  render() {
    return (
      <div>
        <div>
          <div>Logout</div>
        </div>
        Main Layout
        <Route exact path="/app/landing" component={Landing} />
      </div>
    );
  }
}
