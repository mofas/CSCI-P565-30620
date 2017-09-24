import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Navbar from '../components/common/Navbar/Navbar';
import Landing from '../components/pages/Landing/Index';

export default class MainLayout extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <Route exact path="/app/landing" component={Landing} />
      </div>
    );
  }
}
