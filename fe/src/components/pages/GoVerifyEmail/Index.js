import React from 'react';
import { Link } from 'react-router-dom';
import Btn from '../../common/Btn/Btn';
import API from '../../../middleware/API';
import { withRouter } from 'react-router';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class VerifyEmail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
    };
  }

  handleResendEmail = () => {
    this.setState({ disabled: true });
    if (!this.state.disabled) {
      API.API((request, endpoint) => {
        return request
          .post(`${endpoint}/account/resend_email`)
          .type('form')
          .send({ email: this.props.match.params.email });
      });
    }
  };

  render() {
    const { props } = this;
    const { disabled } = this.state;
    return (
      <div className={cx('root')}>
        <div className={cx('title')}>
          <div className={cx('body')}>
            Please check your inbox to verify your email.
          </div>
          <Btn
            disabled={disabled}
            className={cx('btn')}
            type="secondary"
            onClick={this.handleResendEmail}
          >
            Resend Validation Email
          </Btn>
        </div>
      </div>
    );
  }
}

export default withRouter(VerifyEmail);
