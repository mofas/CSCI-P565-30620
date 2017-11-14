import React from 'react';

import { Col } from '../../common/Table/Index';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class TableHeader extends React.PureComponent {
  render() {
    const { props } = this;
    const { onClick, name, sortKey, sortDesc, headerKey } = props;
    return (
      <Col>
        <div className={cx('table-header')} onClick={onClick}>
          <span className={cx('type')}>{name}</span>
          {headerKey === sortKey ? (
            sortDesc ? (
              <svg className={cx('sort-indicator')} viewBox="0 0 585 1024">
                <path d="M585.143 402.286q0 14.857-10.857 25.714l-256 256q-10.857 10.857-25.714 10.857t-25.714-10.857l-256-256q-10.857-10.857-10.857-25.714t10.857-25.714 25.714-10.857h512q14.857 0 25.714 10.857t10.857 25.714z" />
              </svg>
            ) : (
              <svg className={cx('sort-indicator')} viewBox="0 0 585 1024">
                <path d="M585.143 694.857q0 14.857-10.857 25.714t-25.714 10.857h-512q-14.857 0-25.714-10.857t-10.857-25.714 10.857-25.714l256-256q10.857-10.857 25.714-10.857t25.714 10.857l256 256q10.857 10.857 10.857 25.714z" />
              </svg>
            )
          ) : (
            <svg className={cx('sort-indicator')} viewBox="0 0 585 1024" />
          )}
        </div>
      </Col>
    );
  }
}

export default TableHeader;
