import React from 'react';

import { Link } from 'react-router-dom';
import LabelInput from '../../common/Input/LabelInput';
import Btn from '../../common/Btn/Btn';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class Login extends React.PureComponent {
  signin = () => {
    window.location.href = '#/app/landing';
  };

  render() {
    const { props } = this;
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
              <LabelInput label="Email" type="text" />
              <LabelInput label="Password" type="password" />
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
