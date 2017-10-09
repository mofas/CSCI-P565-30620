import React from 'react';

import { fromJS } from 'immutable';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

const randomInt = range => {
  return Math.ceil(Math.random() * range);
};

const data = fromJS({
  passing_yds: randomInt(60),
  rushing_yds: randomInt(20),
  receiving_yds: randomInt(40),
  passing_tds: randomInt(10),
  rushing_tds: randomInt(10),
  receiving_tds: randomInt(100),
  kicking_fgm: randomInt(100),
  kicking_fga: randomInt(100),
  kicking_fgm: randomInt(100),
  kicking_xpmade: randomInt(40),
  passing_int: randomInt(40),
  fumbles_lost: randomInt(40),
  defense_int: randomInt(20),
  defense_ffum: randomInt(20),
  defense_sk: randomInt(40),
  defense_xpblk_defense_fgblk: randomInt(40),
  defense_puntblk: randomInt(40),
  defense_safe: randomInt(60),
  kickret_tds: randomInt(40),
  puntret_tds: randomInt(40),
  defense_tds: randomInt(40),
});

class PlayerDetail extends React.PureComponent {
  render() {
    const { props } = this;
    return (
      <div className={cx('root')}>
        <div className={cx('main-title')}>Player Info</div>

        <div className={cx('basic-info', 'block')}>
          <div className={cx('thumb')} />
          <div className={cx('info')}>
            <div className={cx('name')}>Name: K.Williams</div>
            <div className={cx('position')}>Position: TE</div>
            <div className={cx('rank')}>Fantasy Rank: 44</div>
          </div>
        </div>

        <div className={cx('main-title')}>News</div>

        <div className={cx('news', 'block')}>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/9xl24Kscrbk"
            frameborder="0"
            allowfullscreen
          />
        </div>

        <div className={cx('main-title')}>Ability Record</div>
        <div className={cx('ability', 'block')}>
          <div>Passing Yards: {data.get('passing_yds')}</div>
          <div>Rushing Yards: {data.get('rushing_yds')}</div>
          <div>Receiving Yards: {data.get('receiving_yds')}</div>
          <div>Passing TDs: {data.get('passing_tds')}</div>
          <div>Rushing TDs: {data.get('rushing_tds')}</div>
          <div>Receiving TD : {data.get('receiving_tds')}</div>
          <div>FG Made: {data.get('kicking_fgm')}</div>
          <div>FG Missed: {data.get('kicking_fga')}</div>
          <div>Extra Points Made: {data.get('kicking_fgm')}</div>
          <div>Interceptions throw: {data.get('kicking_xpmade')}</div>
          <div>Fumbles Los: {data.get('passing_int')}</div>
          <div>Interceptions: {data.get('fumbles_lost')}</div>
          <div>Forced Fumble: {data.get('defense_int')}</div>
          <div>Sacks: {data.get('defense_ffum')}</div>
          <div>Blocked Kicks: {data.get('defense_sk')}</div>
          <div>Blocked Punts: {data.get('defense_puntblk')}</div>
          <div>Safeties : {data.get('defense_safe')}</div>
          <div>Kickoff Return TD: {data.get('kickret_tds')}</div>
          <div>Punt Return TD : {data.get('puntret_tds')}</div>
          <div>Defensive T: {data.get('defense_tds')}</div>
        </div>
      </div>
    );
  }
}

export default PlayerDetail;
