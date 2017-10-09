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
      <Link className={cx('item')} to="/app/player/detail/14135">
        <div className={cx('thumb')} />
        <div className={cx('info')}>
          <div className={cx('basic-info')}>
            <div className={cx('name')}>Name: {data.get('name')}</div>
            <div className={cx('position')}>
              Position: {data.get('position')}
            </div>
            <div className={cx('rank')}>
              Fantasy Rank: {data.get('fancy_score_rank')}
            </div>
          </div>
          <div className={cx('ability-title')}>Ability Preview</div>
          <div className={cx('ability')}>
            <div className={cx('ab-item')}>
              <span className={cx('type')}>Passing Yds</span>
              {data.get('passing_yds')}
            </div>
            <div className={cx('ab-item')}>
              <span className={cx('type')}>Rushing Yds</span>
              {data.get('rushing_yds')}
            </div>
            <div className={cx('ab-item')}>
              <span className={cx('type')}>Receiving Yds</span>
              {data.get('receiving_yds')}
            </div>
            <div className={cx('ab-item')}>
              <span className={cx('type')}>Passing Tds</span>
              {data.get('passing_tds')}
            </div>
            <div className={cx('ab-item')}>
              <span className={cx('type')}>Rushing Tds</span>
              {data.get('rushing_tds')}
            </div>
            <div className={cx('ab-item')}>
              <span className={cx('type')}>Puntret Tds</span>
              {data.get('puntret_tds')}
            </div>
            <div className={cx('ab-item')}>
              <span className={cx('type')}>Defense Tds</span>
              {data.get('defense_tds')}
            </div>
          </div>
        </div>
      </Link>
    );
  }
}

export default PlayerItem;
