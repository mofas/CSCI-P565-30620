import React from 'react';

import { Link } from 'react-router-dom';
import LabelInput from '../../common/Input/LabelInput';
import Btn from '../../common/Btn/Btn';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class ForgetPassword extends React.PureComponent {
  register = () => {
    window.location.href = '#/';
  };

  render() {
    const { props } = this;
    return (
      <div className={cx('root')}>
        <div className={cx('content', 'abs-center')}>
          <div className={cx('title')}>Forgot Your Password?</div>
          <div className={cx('box')}>
            <div className={cx('form')}>
              <LabelInput label="Email" type="text" />
            </div>

            <Btn type="secondary" onClick={this.register}>
              Submit
            </Btn>
          </div>
        </div>
      </div>
    );
  }
}

export default ForgetPassword;
