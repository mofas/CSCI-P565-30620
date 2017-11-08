import React from 'react';
import { format } from 'date-fns';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

const hashCode = (str, shift = 5) => {
  // java String#hashCode
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << shift) - hash);
  }
  return hash;
};

const intToRGB = i => {
  var c = (i & 0x00ffffff).toString(16);
  return '00000'.substring(0, 6 - c.length) + c;
};

const getColor = (str, shift) => {
  return '#' + intToRGB(hashCode(str, shift));
};

class MessageWrap extends React.PureComponent {
  render() {
    const { props } = this;
    const { data } = props;
    return (
      <div className={cx('message-wrap')}>
        <div className={cx('thumb-wrap')}>
          <div
            className={cx('thumb')}
            style={{
              background: `linear-gradient(-45deg, ${getColor(
                data.get('sender'),
                2
              )} 0%, ${getColor(data.get('sender'), 3)} 100%)`,
            }}
          />
        </div>
        <div className={cx('info')}>
          <div className={cx('header')}>
            <div className={cx('sender')}>{data.get('sender')}</div>
            <div className={cx('date-time')}>
              {format(new Date(data.get('date_time') * 1000), 'MM/DD HH:mm')}
            </div>
          </div>
          <div className={cx('message')}>{data.get('message')}</div>
        </div>
      </div>
    );
  }
}

export default MessageWrap;
