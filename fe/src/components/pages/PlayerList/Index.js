import React from 'react';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class PlayerList extends React.PureComponent {
  render() {
    const { props } = this;
    return <div className={cx('root')}>Player List</div>;
  }
}

export default PlayerList;
