import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import API from '../../../middleware/API';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class VerifyEmail extends React.PureComponent {
  componentWillMount() {
    const { id, code } = this.props.match.params;
    API.API((request, endpoint) => {
      return request
        .post(`${endpoint}/account/verify_email`)
        .type('form')
        .send({ id, code });
    });
  }

  render() {
    const { props } = this;
    return (
      <div className={cx('root')}>
        <div className={cx('title')}>
          Your email are verified successfully, Click <Link to="/">here</Link>{' '}
          to login
        </div>
      </div>
    );
  }
}

export default withRouter(VerifyEmail);
