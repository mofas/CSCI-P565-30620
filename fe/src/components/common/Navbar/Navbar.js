import React from 'react';

import classnames from 'classnames/bind';
import style from './Navbar.css';
const cx = classnames.bind(style);

class Navbar extends React.PureComponent {
  logout = () => {
    window.location.href = '#/';
  };

  render() {
    const { props } = this;
    return (
      <div className={cx('root')}>
        <div className={cx('logo')}>NFL Fantasy Game</div>
        <div className={cx('logout-btn')} onClick={this.logout}>
          Logout
        </div>
      </div>
    );
  }
}

export default Navbar;
