import React from 'react';
import API from '../../../middleware/API';

import classnames from 'classnames/bind';
import style from './Navbar.css';
const cx = classnames.bind(style);

class Navbar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
    };
  }

  logout = () => {
    API.API('/logout').then(res => {
      console.log(res);
      window.location.href = '#/';
    });
  };

  componentWillMount() {
    API.API('/account/getUserInfo').then(res => {
      if (res.status === 401) {
        window.location.href = '#/';
      } else {
        this.setState({ username: res.username });
      }
    });
  }

  render() {
    const { props } = this;
    const { username } = this.state;
    return (
      <div className={cx('root')}>
        <div className={cx('logo')}>NFL Fantasy Game</div>
        <div className={cx('user-info')}>
          <div className={cx('user-name')}>Hi: {username}</div>
          <div className={cx('logout-btn')} onClick={this.logout}>
            Logout
          </div>
        </div>
      </div>
    );
  }
}

export default Navbar;
