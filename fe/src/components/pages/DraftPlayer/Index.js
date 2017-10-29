import React from 'react';
import { fromJS, List } from 'immutable';

import API from '../../../middleware/API';
import Spinner from '../../common/Spinner/Spinner';

import PlayerList from './PlayerList';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class DraftPlayer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      players: List(),
    };
  }

  componentDidMount() {
    const query = `
      {
        ListPlayer{
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

    this.setState({
      loading: true,
    });

    API.GraphQL(query).then(res => {
      const players = fromJS(res.data.ListPlayer);
      this.setState({
        loading: false,
        players: players,
      });
    });
  }

  selectPlayer = id => {
    window.alert('You select player with id:' + id);
  };

  render() {
    const { state, props } = this;
    const { loading, players } = state;

    const MessageData = []; //query by league_id
    const leagueData = []; //query by league_id
    const playerListData = [];
    const playerPoolData = []; //query by league_id

    return (
      <div className={cx('root')}>
        <Spinner show={loading} />
        <h1>This is draft page!!</h1>
        <div>TODO: Draft Sequence</div>
        <PlayerList players={players} selectPlayer={this.selectPlayer} />
        <div>
          playerPoolData TODO: Chooseed player for all users Team1: Player1
          Player2 Team2: Player1 Player2
        </div>
        <div>Data: MessageData TODO: Chat room</div>
      </div>
    );
  }
}

export default DraftPlayer;
