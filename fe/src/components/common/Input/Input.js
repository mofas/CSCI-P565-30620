import React from 'react';

import classnames from 'classnames/bind';
import styles from '../Style/InputStyle.css';
const cx = classnames.bind(styles);

export default class DebouncedInput extends React.PureComponent {
  render() {
    const { className = '' } = this.props;
    return <input {...this.props} className={cx('root', className)} />;
  }
}
