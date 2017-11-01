import React from 'react';
import Duo from 'react-duo-web';
import { withRouter, Link } from 'react-router-dom';
import API from '../../../middleware/API';

import { DUO_ENDPOINT } from '../../../config';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class DuoLogin extends React.PureComponent {
  handle2FAComplete(sigResponse) {
    API.API((request, endpoint) => {
      return request
        .post(`${endpoint}/verify_duo`)
        .type('form')
        .send({ sigResponse });
    }).then(res => {
      if (res.err === 0) {
        window.location.href = '#/app/news';
      } else {
        alert('login fail, please try again');
        window.location.href = '#/';
      }
    });
  }

  render() {
    const { props } = this;
    return (
      <div className={cx('root')}>
        <Duo
          style={{
            display: 'block',
            width: '100%',
            height: '640px',
            margin: 'auto',
            border: 0,
          }}
          host={DUO_ENDPOINT}
          sigRequest={this.props.match.params.token}
          sigResponseCallback={this.handle2FAComplete}
        />
      </div>
    );
  }
}

export default withRouter(DuoLogin);
