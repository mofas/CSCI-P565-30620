import React from 'react';
import { withRouter, Link } from 'react-router-dom';

import { fromJS } from 'immutable';
import BackBtn from '../../common/Btn/BackBtn';
import Attrs from './Attrs';

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
              <div className={cx('bg-img-cover')}>
			   </div>
            </div>

            <div className={cx('thumb')}>
				<img id="PlayerProfile" src={'./PlayerPics/'+player.get('Team')+'_'+player.get('Name')+'.png'} onError={
					()=>document.getElementById("PlayerProfile").src = "./PlayerPics/default.png"
					}/>
			</div>
			 
            <div className={cx('info')}>
              <div className={cx('info-item', 'name')}>
                <div className={cx('bold')}>Name</div>
                {player.get('Name')	}
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

          <Attrs name="Passing Yds" val={player.get('Passing_Yards')} />
          <Attrs name="Rushing Yds" val={player.get('Rushing_Yards')} />
          <Attrs name="Receiving Yds" val={player.get('Receiving_Yards')} />
          <Attrs name="Passing Tds" val={player.get('Passing_TDs')} />
          <Attrs name="Rushing Tds" val={player.get('Rushing_TDs')} />
          <Attrs name="Receiving Tds" val={player.get('Receiving_TD')} />
          <Attrs
            name="Interceptions Thrown"
            val={player.get('Interceptions_Thrown')}
          />
          <Attrs name="Interceptions" val={player.get('Interceptions')} />
          <Attrs name="Forced Fumbles" val={player.get('Forced_Fumbles')} />
          <Attrs name="Sacks" val={player.get('Sacks')} />
          <Attrs name="Blocked Kicks" val={player.get('Blocked_Kicks')} />
          <Attrs name="Blocked Punts" val={player.get('Blocked_Punts')} />
          <Attrs name="Safeties" val={player.get('Safeties')} />
          <Attrs
            name="Kickoff Return Tds"
            val={player.get('Kickoff_Return_TD')}
          />
          <Attrs name="Punt Return Tds" val={player.get('Punt_Return_TD')} />
          <Attrs name="Defensive Tds" val={player.get('Defensive_TD')} />
          <Attrs name="Extra Points" val={player.get('Extra_Points_Made')} />
          <Attrs name="Made Field Goals" val={player.get('FG_Made')} />
          <Attrs name="Missed Field Goals" val={player.get('FG_Missed')} />
          <Attrs name="Punts Inside 20" val={player.get('Punting_i20')} />
          <Attrs name="Punting Yards" val={player.get('Punting_Yards')} />
        </div>
      </div>
    );
  }
}

export default withRouter(PlayerDetail);
