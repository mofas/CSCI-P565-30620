import React from 'react';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class Attrs extends React.PureComponent {
  render() {
    const { props } = this;
    const { name, val } = props;
    return (
      <div className={cx('attr')}>
        <div className={cx('name')}>{name}</div>
        <div className={cx('val')}>{val || 'N/A'}</div>
      </div>
    );
  }
}

export default Attrs;
