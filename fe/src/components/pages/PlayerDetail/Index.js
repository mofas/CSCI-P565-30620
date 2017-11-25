import React from 'react';
import { withRouter, Link } from 'react-router-dom';

import { fromJS } from 'immutable';
import BackBtn from '../../common/Btn/BackBtn';

import API from '../../../middleware/API';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

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
          Forced_Fumbles
          URL
          Rank
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
        <Link to={`/app/player/list`} style={{ display: 'inline-block' }}>
          <BackBtn type="secondary">Back to List</BackBtn>
        </Link>

        <div className={cx('info-row')}>
          <div className={cx('basic-info', 'block')}>
            <div
              className={cx('bg-img')}
              style={{
                width: '100%',
                height: '100%',
                opacity: 0.1,
                background: `url(http://i.nflcdn.com/static/site/7.5/img/logos/165x185/${player.get(
                  'Team'
                )}.png) no-repeat 50% 50%`,
              }}
            >
              <div className={cx('bg-img-cover')} />
            </div>

            <div className={cx('thumb')} />
            <div className={cx('info')}>
              <div className={cx('info-item', 'name')}>
                <div className={cx('bold')}>Name</div>
                {player.get('Name')}
              </div>
              <div className={cx('info-item', 'position')}>
                <div className={cx('bold')}>Position</div>
                {player.get('Position')}
              </div>
              <div className={cx('info-item', 'team')}>
                <div className={cx('bold')}>Team</div>
                {player.get('Team')}
              </div>
              <div className={cx('info-item', 'rank')}>
                <div className={cx('bold')}>Fantasy Rank</div>
                {player.get('Rank')}
              </div>
            </div>
          </div>

          <div className={cx('block', 'video')}>
            {player.get('URL') ? (
              <iframe
                src={'https://www.youtube.com/embed/'.concat(
                  player.get('URL').split('=')[1]
                )}
                width="560"
                height="315"
                frameBorder="0"
                allowFullScreen
              />
            ) : null}
          </div>
        </div>

        <div className={cx('ability', 'block')}>
          <div>Passing Yards: {player.get('Passing_Yards')} </div>
          <div>Rushing Yards: {player.get('Rushing_Yards')}</div>
          <div>Receiving Yards: {player.get('Receiving_Yards')} </div>
          <div>Passing TDs: {player.get('Passing_TDs')}</div>
          <div>Rushing TDs: {player.get('Rushing_TDs')}</div>
          <div>Receiving TD : {player.get('Receiving_TD')}</div>
          <div>Passing TDs : {player.get('Passing_TDs')}</div>
          <div>FG Made: {player.get('FG_Made')}</div>
          <div>FG Missed: {player.get('FG_Missed')}</div>

          <div>Extra Points Made: {player.get('Extra_Points_Made')}</div>
          <div>Interceptions throw: {player.get('kicking_xpmade')}</div>

          <div>Fumbles Lost: {player.get('Fumbles_Lost')}</div>
          <div>Interceptions: {player.get('Interceptions')}</div>
        </div>
      </div>
    );
  }
}

export default withRouter(PlayerDetail);
