import React from 'react';

import { Link } from 'react-router-dom';
import LabelInput from '../../common/Input/LabelInput';
import Btn from '../../common/Btn/Btn';

import API from '../../../middleware/API';

import { validateEmail } from '../../../util';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class ForgetPassword extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
  }

  changeEmail = e => {
    this.setState({ email: e.target.value });
  };

  sendResetEmail = () => {
    const { email } = this.state;
    if (!validateEmail(email)) {
      window.alert('Email is not valid');
      return;
    }

    API.API((request, endpoint) => {
      return request
        .post(`${endpoint}/account/forget_password`)
        .type('form')
        .send({
          email,
        });
    }).then(res => {
      alert(res.message);
      window.location.href = '#/';
    });
  };

  render() {
    const { props } = this;
    const { email } = this.state;
    return (
      <div className={cx('root')}>
        <div className={cx('content', 'abs-center')}>
          <div className={cx('title')}>Forgot Your Password?</div>
          <div className={cx('box')}>
            <div className={cx('form')}>
              <LabelInput
                label="Email"
                type="text"
                value={email}
                onChange={this.changeEmail}
              />
            </div>

            <Btn type="secondary" onClick={this.sendResetEmail}>
              Submit
            </Btn>
          </div>
        </div>
      </div>
    );
  }
}

export default ForgetPassword;
