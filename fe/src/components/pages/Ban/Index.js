import React from 'react';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class Ban extends React.PureComponent {
  render() {
    const { props } = this;
    return (
      <div className={cx('root')}>
        <h1 className={cx('main')}>I am sorry, you are banned!</h1>
      </div>
    );
  }
}

export default Ban;
