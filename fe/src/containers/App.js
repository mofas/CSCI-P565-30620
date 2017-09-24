import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import PortalLayout from './PortalLayout';
import AppLayout from './AppLayout';

import 'normalize.css';
import './global.css';

export default class App extends Component {
  render() {
    return (
      <div>
        <Route path="/" component={PortalLayout} />
        <Route path="/app" component={AppLayout} />
      </div>
    );
  }
}

const preventDrag = e => {
  e.stopPropagation();
  e.preventDefault();
};

const preventDrop = e => {
  if (e.dataTransfer.files.length > 0) {
    e.stopPropagation();
    e.preventDefault();
  }
};

window.document.addEventListener('dragenter', preventDrag, false);
window.document.addEventListener('dragover', preventDrag, false);
window.document.addEventListener('drop', preventDrop, false);
