import React from 'react';

import { Link } from 'react-router-dom';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class PlayerItem extends React.PureComponent {
  render() {
    const { props } = this;
    const { data, selectPosition} = props;
    return (
      <div className={cx('item')}>
        <div className={cx('info')}>
          <div className={cx('thumb')} />
          <Link
            className={cx('basic-info')}
            to={`/app/player/detail/${data.get('_id')}`}
          >
            <div className={cx('name')}>{data.get('Name')}</div>
            <div className={cx('position')}>{data.get('Position')}</div>
          </Link>
        </div>
        <div className={cx('ability')}>
          {selectPosition === 'Offense' ?  
          <div className={cx('ab-item')}>{data.get('Passing_Yards')}</div>
          : null}
          {selectPosition === 'Offense' ? 
          <div className={cx('ab-item')}>{data.get('Rushing_Yards')}</div>
          : null}
          {selectPosition === 'Offense' ? 
          <div className={cx('ab-item')}>{data.get('Receiving_Yards')}</div>
          : null}
          {selectPosition === 'Offense' ? 
          <div className={cx('ab-item')}>{data.get('Passing_TDs')}</div>
          : null}
          {selectPosition === 'Offense' ? 
          <div className={cx('ab-item')}>{data.get('Rushing_TDs')}</div>
          : null}
          {selectPosition === 'Offense' ? 
          <div className={cx('ab-item')}>{data.get('Receiving_TD')}</div>
          : null}
          {selectPosition === 'Offense' ? 
          <div className={cx('ab-item')}>{data.get('Interceptions_Thrown')}</div>
          : null}
          {selectPosition === 'Defense' ? 
          <div className={cx('ab-item')}>{data.get('Interceptions')}</div>
          : null}
          {selectPosition === 'Defense' ? 
          <div className={cx('ab-item')}>{data.get('Forced_Fumbles')}</div>
          : null}
          {selectPosition === 'Defense' ? 
          <div className={cx('ab-item')}>{data.get('Sacks')}</div>
          : null}
          {selectPosition === 'Defense' ? 
          <div className={cx('ab-item')}>{data.get('Blocked_Kicks')}</div>
          : null}
          {selectPosition === 'Defense' ? 
          <div className={cx('ab-item')}>{data.get('Blocked_Punts')}</div>
          : null}
          {selectPosition === 'Defense' ? 
          <div className={cx('ab-item')}>{data.get('Safeties')}</div>
          : null}
          {selectPosition === 'Offense' ? 
          <div className={cx('ab-item')}>{data.get('Kickoff_Return_TD')}</div>
          : null}
          {selectPosition === 'Offense' ? 
          <div className={cx('ab-item')}>{data.get('Punt_Return_TD')}</div>
          : null}
          {selectPosition === 'Defense' ? 
          <div className={cx('ab-item')}>{data.get('Defensive_TD')}</div>
          : null}
          {selectPosition === 'Kicking' ? 
          <div className={cx('ab-item')}>{data.get('Extra_Points_Made')}</div>
          : null}
          {selectPosition === 'Kicking' ? 
          <div className={cx('ab-item')}>{data.get('FG_Made')}</div>
          : null}
          {selectPosition === 'Kicking' ? 
          <div className={cx('ab-item')}>{data.get('FG_Missed')}</div>
          : null}
        </div>
      </div>
    );
  }
}

export default PlayerItem;
