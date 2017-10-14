import React from 'react';

import { Link } from 'react-router-dom';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class PlayerItem extends React.PureComponent {
  render() {
    const { props } = this;
    const { data } = props;
    return (
      <Link className={cx('item')} to={`/app/player/detail/${data.get('_id')}`}>
        <div className={cx('thumb')} />
        <div className={cx('info')}>
          <div className={cx('basic-info')}>
            <div className={cx('name')}>Name: {data.get('Name')}</div>
            <div className={cx('position')}>
              Position: {data.get('Position')}
            </div>
            <div className={cx('rank')}>
              Fantasy Rank: {data.get('fancy_score_rank')}
            </div>
          </div>
          <div className={cx('ability-title')}>Ability Preview</div>
          <div className={cx('ability')}>
            <div className={cx('ab-item')}>
              <span className={cx('type')}>Passing Yds</span>
              {data.get('Passing_Yards')}
            </div>
            <div className={cx('ab-item')}>
              <span className={cx('type')}>Rushing Yds</span>
              {data.get('Rushing_Yards')}
            </div>
            <div className={cx('ab-item')}>
              <span className={cx('type')}>Receiving Yds</span>
              {data.get('Receiving_Yards')}
            </div>
            <div className={cx('ab-item')}>
              <span className={cx('type')}>Passing Tds</span>
              {data.get('Passing_TDs')}
            </div>
            <div className={cx('ab-item')}>
              <span className={cx('type')}>Rushing Tds</span>
              {data.get('Rushing_TDs')}
            </div>
            <div className={cx('ab-item')}>
              <span className={cx('type')}>Receiving Tds</span>
              {data.get('Receiving_TD')}
            </div>
          </div>
        </div>
      </Link>
    );
  }
}

export default PlayerItem;
