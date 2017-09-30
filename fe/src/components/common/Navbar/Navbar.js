import React from 'react';
import API from '../../../middleware/API';

import classnames from 'classnames/bind';
import style from './Navbar.css';
const cx = classnames.bind(style);

class Navbar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
  }

  logout = () => {
    API.API('/logout').then(res => {
      window.location.href = '#/';
    });
  };

  componentWillMount() {
    API.API('/account/getUserInfo').then(res => {
      if (res.status === 401) {
        window.location.href = '#/';
      } else {
        this.setState({ email: res.email });
      }
    });
  }

  render() {
    const { props } = this;
    const { email } = this.state;
    return (
      <div className={cx('root')}>
        <div className={cx('logo')}>NFL Fantasy Game</div>
        <div className={cx('user-info')}>
          <div className={cx('user-name')}>Hi: {email}</div>
          <div className={cx('logout-btn')} onClick={this.logout}>
            Logout
          </div>
        </div>
      </div>
    );
  }
}

export default Navbar;
