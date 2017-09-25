import React from 'react';

import { Link } from 'react-router-dom';
import LabelInput from '../../common/Input/LabelInput';
import Btn from '../../common/Btn/Btn';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class CreateAccount extends React.PureComponent {
  register = () => {
    window.location.href = '#/verify_email';
  };

  render() {
    const { props } = this;
    return (
      <div className={cx('root')}>
        <div className={cx('content', 'abs-center')}>
          <div className={cx('title')}>Crate your NFL account</div>
          <div className={cx('box')}>
            <div className={cx('form')}>
              <LabelInput label="Email" type="text" />
              <LabelInput label="Password" type="password" />
              <LabelInput label="Confirm Password" type="password" />
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
