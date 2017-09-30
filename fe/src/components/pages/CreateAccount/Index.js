import React from 'react';

import { Link } from 'react-router-dom';
import LabelInput from '../../common/Input/LabelInput';
import Btn from '../../common/Btn/Btn';

import API from '../../../middleware/API';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

const validateEmail = email => {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

class CreateAccount extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: 'cli3@iu.edu',
      password: '123456',
      confirm_password: '123456',
    };
  }

  changeEmail = e => {
    this.setState({ email: e.target.value });
  };
  changePassword = e => {
    this.setState({ password: e.target.value });
  };
  changeConfirmPassword = e => {
    this.setState({ confirm_password: e.target.value });
  };

  register = () => {
    const { email, password, confirm_password } = this.state;

    // DO the validation
    if (!validateEmail(email)) {
      window.alert('Email is not valid');
      return;
    }

    if (password !== confirm_password) {
      window.alert('Passwords are not matched');
      return;
    }

    API.API((request, endpoint) => {
      return request
        .post(`${endpoint}/account/create`)
        .type('form')
        .send({
          email,
          password,
        });
    }).then(res => {
      if (res.err === 0) {
        window.location.href = '#/go_verify_email/' + email;
      } else {
        alert(res.message);
      }
    });
  };

  render() {
    const { props } = this;
    const { email, password, confirm_password } = this.state;
    return (
      <div className={cx('root')}>
        <div className={cx('content', 'abs-center')}>
          <div className={cx('title')}>Crate your NFL account</div>
          <div className={cx('box')}>
            <div className={cx('form')}>
              <LabelInput
                label="Email"
                type="text"
                value={email}
                onChange={this.changeEmail}
              />
              <LabelInput
                label="Password"
                type="password"
                value={password}
                onChange={this.changePassword}
              />
              <LabelInput
                label="Confirm Password"
                type="password"
                value={confirm_password}
                onChange={this.changeConfirmPassword}
              />
            </div>

            <Btn type="secondary" onClick={this.register}>
              Register
            </Btn>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateAccount;
