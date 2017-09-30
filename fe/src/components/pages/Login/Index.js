import React from 'react';

import { Link } from 'react-router-dom';
import LabelInput from '../../common/Input/LabelInput';
import Btn from '../../common/Btn/Btn';

import API from '../../../middleware/API';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class Login extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: 'admin',
      password: '1234',
    };
  }

  changeUserName = e => {
    this.setState({ username: e.target.value });
  };

  changePassword = e => {
    this.setState({ password: e.target.value });
  };

  signin = () => {
    const { username, password } = this.state;
    const form = new FormData();

    const param = {
      username,
      password,
    };

    API.API((request, endpoint) => {
      return request
        .post(`${endpoint}/login`)
        .type('form')
        .send(param);
    }).then(res => {
      if (res.err === 0) {
        window.location.href = '#/app/landing';
      } else {
        alert('Passowrd is not correct, or account not existed');
      }
    });
  };

  render() {
    const { state, props } = this;
    const { username, password } = state;
    return (
      <div className={cx('root')}>
        <div className={cx('bg', 'abs-center')}>
          <div className={cx('cover')} />
        </div>
        <div className={cx('content', 'abs-center')}>
          <div className={cx('main-title')}>Your Game, Your Team</div>
          <div className={cx('title')}>Sing in to your NFL account</div>
          <div className={cx('box')}>
            <div className={cx('form')}>
              <LabelInput
                label="Email"
                type="text"
                value={username}
                onChange={this.changeUserName}
              />
              <LabelInput
                label="Password"
                type="password"
                value={password}
                onChange={this.changePassword}
              />
            </div>
            <div className={cx('functio-bar')}>
              <Link className={cx('link')} to="/create_account">
                Create account
              </Link>
              <Link className={cx('link')} to="/forget_password">
                Forget password?
              </Link>
            </div>

            <Btn type="secondary" onClick={this.signin}>
              SIGN IN
            </Btn>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
