import React from 'react';
import { fromJS, Map, List, Set } from 'immutable';
import { connect } from 'react-redux';
import { WS_ENDPOINT } from '../../../config';

import API from '../../../middleware/API';
import Spinner from '../../common/Spinner/Spinner';

import TeamDetail from './TeamDetail';
import Sequence from './Sequence';
import ChatRoom from '../../common/ChatRoom/ChatRoom';
import PlayerList from '../../common/SelectPlayerList/PlayerList';
import { Table, Thead, Tbody, Row, Col } from '../../common/Table/Index';

import classnames from 'classnames/bind';
import style from './Index.css';
import Btn from '../../common/Btn/Btn';
const cx = classnames.bind(style);

const getCurrentPicker = leagueData => {
  const limit = leagueData.get('limit');
  const draft_run = leagueData.get('draft_run') || 0;
  const userList = leagueData.get('accounts') || List();
  const userListCount = userList.count();
  const round = Math.floor(draft_run / limit);
  let seqUserList = round % 2 === 1 ? userList : userList.reverse();
  return seqUserList.get(draft_run % limit) || Map();
};

class DraftPlayer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      league_id: this.props.match.params.l_id,
      loading: false,
      players: List(),
      leagueData: Map(),
      totalPlayersInTeam: 20,
      poolPlayers: List(),
      modalToggle: false,
      showMessage: '',
      poolPlayerWithUser: List(),
      selectTeamIndex: 0,

      ws: null,
    };
  }

  componentDidMount() {
    this.updateData();
    this.loadStaticData();
    if (!this.state.ws) {
      this.createWS();
    }
  }

  createWS = () => {
    const ws = new WebSocket(WS_ENDPOINT);

    this.setState({
      ws,
    });

    ws.onopen = () => {
      this.setState({
        loading: false,
      });
      ws.send(JSON.stringify({ type: 'initial' }));
    };

    ws.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        const { type, league_id, account_id } = data;
        if (
          type === 'selectedPlayer' &&
          league_id === this.props.match.params.l_id &&
          account_id !== this.props.accountStore.getIn(['userInfo', '_id'])
        ) {
          this.updateData();
        }
      } catch (e) {}
    };
  };

  updateData = () => {
    const { league_id } = this.state;
    const mutation = `
      mutation{
        UpdateDraftNoLeague(_id: "${league_id}"){
          _id,
          draft_run
        }
      }
    `;
    API.GraphQL(mutation).then(res => {
      this.loadData();
    });
  };

  loadStaticData = () => {
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
          Interceptions_Thrown
          Forced_Fumbles
          Sacks
          Blocked_Kicks
          Blocked_Punts
          Safeties
          Kickoff_Return_TD
          Punt_Return_TD
          Defensive_TD
          Punting_i20
          Punting_Yards
        }
      }
    `;
    API.GraphQL(query).then(res => {
      const players = fromJS(res.data.ListPlayer);
      this.setState({
        players,
      });
    });
  };

  loadData = () => {
    const { league_id } = this.state;
    const query = `
      {
        LeagueData: QueryLeague(_id: "${league_id}"){
          name,
          draft_run,
          limit,
          timeout,
          lastPickTime,
          stage,
          accounts{
            _id,
            email,
          }
        }
        QueryPoolPlayer(league_id: "${league_id}"){
          players {
            _id,
          }
        }
        PoolPlayerWithUser: QueryPoolPlayerWithUser(league_id: "${league_id}") {
          account {
            _id
            email
          }
          players {
            _id
            Name
            Position
          }
        }
      }
    `;

    this.setState({
      loading: true,
    });

    API.GraphQL(query).then(res => {
      const leagueData = fromJS(res.data.LeagueData);
      const rawPoolPlayer = (res.data.QueryPoolPlayer || []).reduce(
        (acc, d) => acc.concat(d.players),
        []
      );
      const poolPlayers = fromJS(rawPoolPlayer);
      const poolPlayerWithUser = fromJS(res.data.PoolPlayerWithUser);

      if ('SeasonStart' === leagueData.get('stage')) {
        window.location.href = '#/app/league/season/' + league_id;
      }

      this.setState({
        loading: false,
        poolPlayerWithUser,
        leagueData,
        poolPlayers,
      });

      setTimeout(() => {
        this.checkSeasonStart();
      }, 0);
    });
  };

  reload = () => {
    this.updateData();
  };

  selectPlayer = (id, leagueId, userId) => {
    const { leagueData, totalPlayersInTeam } = this.state;
    const run = leagueData.get('draft_run');

    const currentPicker = getCurrentPicker(leagueData);

    if (run <= totalPlayersInTeam) {
      const mutation = `
        mutation{
          SelectedPlayer(
            league_id: "${leagueId}",
            player_id:"${id}",
            account_id: "${userId}"
          ){
            error
            success
          }
        }
      `;

      API.GraphQL(mutation).then(res => {
        this.loadData();
      });
      this.checkSeasonStart();
    } else {
      window.alert('Your team is full');
    }
  };

  checkSeasonStart = () => {
    const { league_id } = this.state;
    const { leagueData, totalPlayersInTeam } = this.state;

    const run = leagueData.get('draft_run');
    let max_run = leagueData.get('limit') * totalPlayersInTeam;
    if (max_run <= run - 1) {
      const variables = {
        inputsecheduleData: {
          league_id: league_id,
          weeks: 10,
        },
      };

      const mut = `
        mutation($inputsecheduleData: ScheduleInputType){
          UpdateLeague(_id: "${league_id}", stage: "SeasonStart"){
            _id
          },
          SetSchedule(data: $inputsecheduleData){
            success
          }
        }
      `;

      API.GraphQL(mut, variables).then(res => {
        // window.location.href = '#/app/league/season/' + league_id;
      });
    }
  };

  selectedUserIndex = e => {
    this.setState({ selectTeamIndex: e.target.value });
  };

  render() {
    const { state, props } = this;
    const {
      loading,
      leagueData,
      players,
      poolPlayers,
      poolPlayerWithUser,
      selectTeamIndex,
    } = state;
    const { accountStore } = props;

    const currentPicker = getCurrentPicker(leagueData);

    return (
      <div className={cx('root')}>
        <Spinner show={loading} />

        <div className={cx('block')}>
          <div className={cx('sequence-wrap')}>
            <div className={cx('title')}>Pick order</div>
            <Sequence leagueData={leagueData} reload={this.reload} />
          </div>
        </div>

        <div className={cx('block')}>
          <div className={cx('select-player-wrap')}>
            <div className={cx('title')}>Pick your player</div>
            <PlayerList
              players={players}
              selectedPlayers={poolPlayers}
              selectPlayer={this.selectPlayer}
              leagueId={this.state.league_id}
              userId={accountStore.getIn(['userInfo', '_id'])}
              isDisabled={
                currentPicker.get('_id') !==
                accountStore.getIn(['userInfo', '_id'])
              }
            />
          </div>
        </div>

        <div className={cx('block')}>
          <div className={cx('team-detail-wrap')}>
            <div className={cx('title')}>Current team status</div>
            <TeamDetail
              data={poolPlayerWithUser.get(selectTeamIndex)}
              poolPlayerWithUser={poolPlayerWithUser}
              selectedUserIndex={this.selectedUserIndex}
            />
          </div>
          <div className={cx('chat-room-wrap')}>
            <div className={cx('title')}>Disscussion Board</div>
            <ChatRoom roomId={this.props.match.params.l_id} />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(stores => {
  return {
    accountStore: stores.account,
  };
})(DraftPlayer);
