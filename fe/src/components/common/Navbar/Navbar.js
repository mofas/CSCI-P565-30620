import React from 'react';
import { connect } from 'react-redux';

import { getUserInfo, logout } from '../../../reducers/account';

import classnames from 'classnames/bind';
import style from './Navbar.css';
const cx = classnames.bind(style);

class Navbar extends React.PureComponent {
  componentWillMount() {
    this.props.dispatch(getUserInfo());
  }

  logout = logout;

  render() {
    const { props } = this;
    const { accountStore } = props;
    return (
      <div className={cx('root')}>
        <div className={cx('logo')}>
          <img src="https://i.imgur.com/aXCELi5.png" height="50" />
        </div>
        <div className={cx('user-info')}>
          {accountStore.get('loading') ? (
            <div className={cx('user-name')}>Loading</div>
          ) : (
            <div className={cx('user-name')}>
              Hi: {accountStore.getIn(['userInfo', 'email'])}
            </div>
          )}
          <div className={cx('logout-btn')} onClick={this.logout}>
            Logout
          </div>
        </div>
      </div>
    );
  }
}

export default connect(stores => {
  return {
    accountStore: stores.account,
  };
})(Navbar);
