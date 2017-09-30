import React from 'react';

import { Link } from 'react-router-dom';
import LabelInput from '../../common/Input/LabelInput';
import Btn from '../../common/Btn/Btn';
import { withRouter } from 'react-router';
import API from '../../../middleware/API';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class ForgetPassword extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirm_password: '',
    };
  }

  changePassword = e => {
    this.setState({ password: e.target.value });
  };

  changeConfirmPassword = e => {
    this.setState({ confirm_password: e.target.value });
  };

  reset = () => {
    const { id, code } = this.props.match.params;
    const { password, confirm_password } = this.state;

    if (password !== confirm_password) {
      window.alert('Passwords are not matched');
      return;
    }

    API.API((request, endpoint) => {
      return request
        .post(`${endpoint}/account/reset_password`)
        .type('form')
        .send({
          id,
          code,
          password,
        });
    }).then(res => {
      alert(res.message);
      if (res.err === 0) {
        window.location.href = '#/';
      }
    });
  };

  render() {
    const { props } = this;
    const { password, confirm_password } = this.state;
    return (
      <div className={cx('root')}>
        <div className={cx('content', 'abs-center')}>
          <div className={cx('title')}>Forgot Your Password?</div>
          <div className={cx('box')}>
            <div className={cx('form')}>
              <LabelInput
                label="New Password"
                type="password"
                value={password}
                onChange={this.changePassword}
              />
              <LabelInput
                label="Confirm New Password"
                type="password"
                value={confirm_password}
                onChange={this.changeConfirmPassword}
              />
            </div>

            <Btn type="secondary" onClick={this.reset}>
              Submit
            </Btn>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ForgetPassword);
