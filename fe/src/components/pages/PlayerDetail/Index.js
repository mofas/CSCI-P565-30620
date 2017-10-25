import React from 'react';
import {withRouter, Link } from 'react-router-dom';

import { fromJS } from 'immutable';

import API from '../../../middleware/API';

import classnames from 'classnames/bind';
import style from './Index.css';
import logo from './back_button.jpg';
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


  constructor(props) {
    super(props);
    this.state = {
        pid: this.props.match.params.p_id,
        player: fromJS({}),
    };
  }

  componentDidMount() {

    const query = `
      {
        QueryPlayer(_id: "${this.state.pid}" ){
          _id
          Name
          Position
          Team
          Passing_Yards
          Rushing_Yards
          Receiving_Yards
          Passing_TDs
          Rushing_TDs
          Receiving_TD
          FG_Made
          FG_Missed
          Extra_Points_Made
          Interceptions
          Fumbles_Lost
        }
      }
    `;

      API.GraphQL(query).then(res => {
        const player = fromJS(res.data.QueryPlayer);
        
        this.setState({
          player: player,
        });
      });

  }


  render() {
    const { state, props } = this;    
    const { pid, player } = state;

    return (
      <div className={cx('root')}>
        <Link to="/app/player/list">
          <img className={cx('logo')} src={logo} alt="Back to Player List" />
        </Link>

        <div className={cx('main-title')}>Player Info</div>

        <div className={cx('basic-info', 'block')}>
          <div className={cx('thumb')} />
          <div className={cx('info')}>
            <div className={cx('name')}> 
                <div className={cx('thick')}>Name </div> {player.get('Name')} </div>
            <div className={cx('position')}>
                <div className={cx('thick')}>Position </div> {player.get('Position')}</div>
            <div className={cx('team')}> 
                <div className={cx('thick')}>Team </div>{player.get('Team')} </div>
            <div className={cx('rank')}>
                <div className={cx('thick')}>Fantasy Rank</div> 44</div>
            
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
          <div>Passing Yards:  {player.get('Passing_Yards')} </div>
          <div>Rushing Yards: {player.get('Rushing_Yards')}</div>
          <div>Receiving Yards: {player.get('Receiving_Yards')} </div>
          <div>Passing TDs:  {player.get('Passing_TDs')}</div>
          <div>Rushing TDs: {player.get('Rushing_TDs')}</div>
          <div>Receiving TD : {player.get('Receiving_TD')}</div> 
          <div>Passing TDs : {player.get('Passing_TDs')}</div>
          <div>FG Made: {player.get('FG_Made')}</div>
          <div>FG Missed: {player.get('FG_Missed')}</div>

          <div>Extra Points Made: {player.get('Extra_Points_Made')}</div>
          <div>Interceptions throw: {data.get('kicking_xpmade')}</div>

          <div>Fumbles Lost: {player.get('Fumbles_Lost')}</div>
          <div>Interceptions: {player.get('Interceptions')}</div>

          <div> -------- Properties not in DB ----- </div>
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

export default withRouter(PlayerDetail);
