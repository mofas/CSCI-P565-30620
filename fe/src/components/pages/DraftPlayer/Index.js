import React from 'react';
import { fromJS, Map, List, Set } from 'immutable';
import { connect } from 'react-redux';

import API from '../../../middleware/API';
import Spinner from '../../common/Spinner/Spinner';

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
      accounts_darft_complete: [],
      showMessage: '',
      poolPlayerWithUser: [],
      index: 0
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
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
        LeagueData: QueryLeague(_id: "${this.state.league_id}"){
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
        PoolPlayers: QueryPoolPlayer(league_id: "${this.state.league_id}"){
          players {
            _id,
          }
        }
        PoolPlayerWithUser: QueryPoolPlayerWithUser(league_id: "${
          this.state.league_id
        }") {
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
      const players = fromJS(res.data.ListPlayer);
      const leagueData = fromJS(res.data.LeagueData);
      const poolPlayers = fromJS(res.data.PoolPlayers);
      // console.log("68766876", res.data.PoolPlayerWithUser);
      // console.log("manish", res.data.PoolPlayerWithUser.length);

      // console.log("fdskfasd=?????>>>>>", JSON.stringify(leagueData));
      if ('SeasonStart' === leagueData.get('stage')) {
        console.log('Redirect to game page');
        window.location.href = '#/app/league/list';
      }
      this.setState({
        poolPlayerWithUser: res.data.PoolPlayerWithUser,
      });

      const accounts_darft_complete = [];
      let showMessage =
        'Following player position missing => 2:QB 2:RB 2:WR 1:TE 1:K 5:DEF';
      if (res.data.PoolPlayerWithUser.length > 0) {
        let QB = 2;
        let RB = 2;
        let WR = 3;
        let TE = 1;
        let K = 1;
        let DEF = 5;
        for (let i = 0; i < res.data.PoolPlayerWithUser.length; i++) {
          if (
            res.data.PoolPlayerWithUser[i]['players'].length >=
            this.state.totalPlayersInTeam
          ) {
            accounts_darft_complete.push(
              res.data.PoolPlayerWithUser[i]['account']['email']
            );
          }

          // Every team needs
          // two or more QB
          // Two or more RB
          // Three or more WR.
          // One or more K.
          // One or more TE.
          // Five or more (sum of all defense positions)

          if (
            res.data.PoolPlayerWithUser[i]['account']['_id'] ===
            this.props.accountStore.getIn(['userInfo', '_id'])
          ) {
            if (res.data.PoolPlayerWithUser[i]['players'].length > 0) {
              const p = res.data.PoolPlayerWithUser[i]['players'];
              for (let j = 0; j < p.length; j++) {
                if (p[j]['Position'] === 'QB') {
                  QB = QB - 1;
                } else if (p[j]['Position'] === 'RB') {
                  RB = RB - 1;
                } else if (p[j]['Position'] === 'WR') {
                  WR = WR - 1;
                } else if (p[j]['Position'] === 'TE') {
                  TE = TE - 1;
                } else if (p[j]['Position'] === 'K') {
                  K = K - 1;
                } else {
                  DEF = DEF - 1;
                }
              }
            }
          }
        }

        showMessage = '';
        if (QB > 0) {
          let tmpMsg = QB + ':QB ';
          showMessage = tmpMsg + showMessage;
        }
        if (RB > 0) {
          let tmpMsg = RB + ':RB ';
          showMessage = tmpMsg + showMessage;
        }
        if (WR > 0) {
          let tmpMsg = WR + ':WR ';
          showMessage = tmpMsg + showMessage;
        }
        if (TE > 0) {
          let tmpMsg = TE + ':TE ';
          showMessage = tmpMsg + showMessage;
        }
        if (K > 0) {
          let tmpMsg = K + ':K ';
          showMessage = tmpMsg + showMessage;
        }
        if (DEF > 0) {
          let tmpMsg = DEF + ':DEF ';
          showMessage = tmpMsg + showMessage;
        }

        this.setState({
          accounts_darft_complete: accounts_darft_complete,
          showMessage: 'Following player position missing => ' + showMessage,
        });
      } else {
        this.setState({
          accounts_darft_complete: [],
          showMessage: showMessage,
        });
      }

      let poolData = JSON.parse(JSON.stringify(poolPlayers));

      let filterPlayers = [];
      if (poolData.length > 0) {
        let poolPlayersId = [];
        for (let i = 0; i < poolData.length; i++) {
          let tmpIds = [];
          tmpIds = poolData[i]['players'].map(player => {
            return player['_id'];
          });
          poolPlayersId = poolPlayersId.concat(tmpIds);
        }

        filterPlayers = players.filter(player => {
          if (poolPlayersId.indexOf(player.get('_id')) >= 0) {
            return false;
          } else {
            return true;
          }
        });
      } else {
        filterPlayers = players;
      }

      let acc_to_player = [];
      for (let i = 0; i < res.data.PoolPlayerWithUser.length; i++) {
        acc_to_player[
          res.data.PoolPlayerWithUser[i]['account']['_id']
        ] = Object.assign({}, res.data.PoolPlayerWithUser[i]['players']);
      }

      this.setState({
        loading: false,
        players: filterPlayers,
        leagueData: leagueData,
        poolPlayers: poolPlayers,
        // poolPlayerWithUser: res.data.PoolPlayerWithUser,
        acc_to_players: acc_to_player,
      });
    });
  };

  selectPlayer = (id, leagueId, userId) => {
    const { leagueData, totalPlayersInTeam } = this.state;
    const run =
      Math.floor(leagueData.get('draft_run') / leagueData.get('limit')) + 1;

    const currentPicker = getCurrentPicker(leagueData);

    if (run <= totalPlayersInTeam) {
      const mutation = `
        mutation{
          SelectedPlayer(
            league_id: "${leagueId}",
            player_id:"${id}",
            account_id: "${userId}"
          ){
            success
          }
          UpdateDraftNoLeague(_id: "${leagueId}"){
            _id,
            draft_run
          }
        }
      `;
      API.GraphQL(mutation).then(res => {
        this.loadData();
      });

      let max_run =
        this.state.leagueData.get('limit') * this.state.totalPlayersInTeam;
      if (max_run === run) {
        let accounts = this.state.leagueData.get('accounts').toJS();
        let account_ids = accounts.map(d => {
          return d['_id'];
        });
        const variables = {
          inputsecheduleData: {
            league_id: leagueId,
            account_ids: account_ids,
            weeks: 10,
          },
        };

        const mut = `
          mutation($inputsecheduleData: ScheduleInputType){
            UpdateLeague(_id: "${leagueId}", stage: "SeasonStart"){
              _id
            },
            SetSchedule(data: $inputsecheduleData){
              success
            }
          }
        `;
        API.GraphQL(mut, variables).then(res => {
          this.loadData();
          console.log('Successfully changed the status');
        });
      }
    } else {
      window.alert('Your team is full');
    }
  };

  render() {
    const { state, props } = this;
    const { loading, leagueData, players, poolPlayers } = state;
    const { accountStore } = props;

    const targetData = this.state.poolPlayerWithUser[this.state.index];
    const currentPicker = getCurrentPicker(leagueData);

    return (
      <div className={cx('root')}>
        <Spinner show={loading} />

        <div className={cx('sequence-wrap')}>
          <div className={cx('title')}>Pick order</div>
          <Sequence leagueData={leagueData} />
        </div>

        <div className={cx('select-player-wrap')}>
          <div className={cx('title')}>Pick your player</div>
          <PlayerList
            players={players}
            selectedPlayer={poolPlayers}
            selectPlayer={this.selectPlayer}
            leagueId={this.state.league_id}
            userId={accountStore.getIn(['userInfo', '_id'])}
            isDisabled={
              currentPicker.get('_id') !==
              accountStore.getIn(['userInfo', '_id'])
            }
          />
        </div>

        <div>
          playerPoolData TODO: Chooseed player for all users Team1: Player1
          Player2 Team2: Player1 Player2

          <div>
            <select onChange={(e)=>this.selectedUserIndex(e)}>
              {this.state.poolPlayerWithUser.length > 0 && this.state.poolPlayerWithUser.map( (d,i) => {
                return <option value={i}>{d['account']['email']}</option>
              })}
            </select>
          </div>
                    
          <div>
            {targetData ?
              <Table>
                      <Thead>
                        <Row>
                          <Col> Player {targetData['account']['email']} </Col>
                        </Row>

                        <Row>
                          <Col>Player Name</Col>
                          <Col>Position</Col>
                        </Row>
                      </Thead>
                      <Tbody>
                        {targetData['players'].map((p,index) => {
                          return(
                          <Row key={index}>
                            <Col>{p['Name']}</Col>
                            <Col>{p['Position']}</Col>
                          </Row>
                          )
                        })}

                      </Tbody>
                    </Table>  
                  : (null)
            }
          </div>
        </div>
        <div className={cx('chat-room-wrap')}>
          <div className={cx('title')}>Disscussion Board</div>
          <ChatRoom roomId={this.props.match.params.l_id} />
        </div>
      </div>
    );
  }
}

//export default DraftPlayer;

export default connect(stores => {
  return {
    accountStore: stores.account,
  };
})(DraftPlayer);
