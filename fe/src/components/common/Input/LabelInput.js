import React from 'react';

import Input from './Input';

import classnames from 'classnames/bind';
import styles from '../Style/InputStyle.css';
const cx = classnames.bind(styles);

export default class LabelInput extends React.PureComponent {
  render() {
    const { label } = this.props;

    return (
      <label className={cx('label-wrap')}>
        <div className={cx('label')}>{label}</div>
        <Input {...this.props} />
      </label>
    );
  }
}
