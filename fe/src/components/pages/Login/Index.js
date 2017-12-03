import React from 'react';

import { Link } from 'react-router-dom';

import Spinner from '../../common/Spinner/Spinner';
import LabelInput from '../../common/Input/LabelInput';
import Btn from '../../common/Btn/Btn';

import API from '../../../middleware/API';
import { OAUTH_URL } from '../../../config';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class Login extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      username: '',
      password: '',
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

    this.setState({
      loading: true,
    });

    API.API((request, endpoint) => {
      return request
        .post(`${endpoint}/login`)
        .type('form')
        .send(param);
    }).then(res => {
      this.setState({
        loading: false,
      });
      if (res.err === 0) {
        window.location.href = '#/app/news';
      } else if (res.err === 2) {
        window.location.href = '#' + res.duoUrl;
      } else {
        alert('Passowrd is not correct, or account does not exist');
      }
    });
  };

  oauth = () => {
    window.location.href = OAUTH_URL;
  };

  render() {
    const { state, props } = this;
    const { loading, username, password } = state;
    return (
      <div className={cx('root')}>
        <div className={cx('bg', 'abs-center')}>
          <div className={cx('cover')} />
        </div>
        <div className={cx('content', 'abs-center')}>
          <div className={cx('main-title')}>Your Game, Your Team</div>
          <div className={cx('title')}>Sign in to your NFL account</div>
          <form className={cx('box')}>
            <Spinner className={cx('loader')} show={loading} />
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
                Forgot password?
              </Link>
            </div>

            <Btn type="secondary" onClick={this.signin}>
              SIGN IN
            </Btn>
            <Btn
              className={cx('oauth-btn')}
              type="primary"
              onClick={this.oauth}
            >
              LOGIN WITH GOOGLE OAUTH
            </Btn>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
