import React from 'react';
import { Link } from 'react-router-dom';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class VerifyEmail extends React.PureComponent {
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

export default VerifyEmail;
