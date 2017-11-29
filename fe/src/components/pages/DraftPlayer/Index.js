import React from 'react';
import { fromJS, toJS, List, Set } from 'immutable';
import { connect } from 'react-redux';

import API from '../../../middleware/API';
import Spinner from '../../common/Spinner/Spinner';

import ChatRoom from '../../common/ChatRoom/ChatRoom';
import PlayerList from '../../common/SelectPlayerList/PlayerList';

import classnames from 'classnames/bind';
import style from './Index.css';
import Modal from 'react-modal';
import Btn from '../../common/Btn/Btn';
const cx = classnames.bind(style);

class DraftPlayer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      league_id: this.props.match.params.l_id,
      loading: false,
      players: List(),
      leagueData: fromJS({}),
      selectionOrder: [],
      totalPlayersInTeam: 20,
      poolPlayers: List(),
      modalToggle: false,
      accounts_darft_complete: [],
      showMessage: '',
      //userId : this.props.accountStore.getIn(['userInfo', 'email'])
    };
  }
  componentWillMount() {
    // this.props.dispatch(getUserInfo());
    Modal.setAppElement('body');
  }

  arr_diff = (a1, a2) => {
    // console.log("Using this.state.accounts_darft_complete", a2, "\n===\n", a1);
    let a = [];
    const diff = [];
    for (let i = 0; i < a1.length; i++) {
      a1[i]['del'] = false;
      for (let j = 0; j < a2.length; j++) {
        if (a1[i]['email'] == a2[j]) {
          a1[i]['del'] = true;
          break;
        }
      }
    }
    for (let i = 0; i < a1.length; i++) {
      if (a1[i]['del'] === false) {
        diff.push(Object.assign({}, a1[i]));
      }
    }
    // console.log("Printing diff:===>>", JSON.stringify(diff));
    return diff;
  };

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
      // console.log("68766876", JSON.stringify(res.data.PoolPlayerWithUser));
      // console.log("manish", res.data.PoolPlayerWithUser.length);

      // console.log("fdskfasd=?????>>>>>", JSON.stringify(leagueData));
      if ('SeasonStart' === leagueData.get('stage')) {
        console.log('Redirect to game page');
        window.location.href = '#/app/league/list';
      }

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

        // console.log("Pool player ids:-->", poolPlayersId.length);

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

      // for (let das in acc_to_player) {
      //   console.log("dasdashahahaa 67887", acc_to_player[das]);
      //   for (let d22 in acc_to_player[das]) {
      //     console.log("Name:", acc_to_player[das][d22]["Name"]);
      //   }
      // }

      this.setState({
        loading: false,
        players: filterPlayers,
        leagueData: leagueData,
        poolPlayers: poolPlayers,
        poolPlayerWithUser: res.data.PoolPlayerWithUser,
        acc_to_players: acc_to_player,
      });
      this.setPickingOrder(JSON.stringify(leagueData));
    });
  };

  selectPlayer = (id, leagueId, userId, emailId) => {
    console.log('selected player called');
    console.log(id, leagueId, userId, emailId);
    var run = Math.floor(
      this.state.leagueData.get('draft_run') /
        this.state.leagueData.get('limit')
    );
    run = run + 1;

    if (
      this.state.selectionOrder[0]['email'] === emailId &&
      run <= this.state.totalPlayersInTeam
    ) {
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
        console.log('Successffully loaded the data');
      });

      let max_run =
        this.state.leagueData.get('limit') * this.state.totalPlayersInTeam;
      // console.log("Maxrun ==> run --->", max_run, run);
      if (max_run === run) {
        let accounts = this.state.leagueData.get('accounts').toJS();
        let account_ids = accounts.map(d => {
          return d['_id'];
        });
        // console.log("====> ", JSON.stringify(accounts));
        // let weeks = 10;
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
          console.log('Successffully changed the status');
        });
      }
    } else {
      window.alert('Not your chance / Or your 20 players capacity is over');
    }
  };

  setPickingOrder = strdata => {
    const data = JSON.parse(strdata);

    let curr_epoc = Math.round(new Date().getTime() / 1000.0);
    if (data['name']) {
      //console.log("da sda da ",JSON.stringify( data ) );
      let lastPickTime = data['lastPickTime'];
      let timeout = data['timeout'];
      let jump = 0;
      if ((curr_epoc - lastPickTime) / 60 > timeout) {
        jump = Math.floor((curr_epoc - lastPickTime) / 60);
      }

      // if( (curr_epoc - lastPickTime) > 4 ){
      //   jump = Math.floor( (curr_epoc - lastPickTime)/4 );
      // }
      // let diff = curr_epoc - lastPickTime;
      // console.log("jump pokfds", jump, curr_epoc, lastPickTime, diff );

      let draft = data['draft_run'];
      let limit = data['limit']; //data['limit'];
      console.log('First argument', data['accounts']);
      console.log('Second argument', this.state.accounts_darft_complete);
      const accounts = this.arr_diff(
        data['accounts'],
        this.state.accounts_darft_complete
      );
      //console.log("this random shit ", account1s);

      //let accounts = data["accounts"];
      let div = Math.floor(draft / limit);
      let remind = draft % limit;
      let down_up = div % 2;
      var selectionOrder = [];
      let count = limit * 2;

      jump = jump % (2 * limit);
      // console.log("div jump:", jump, " limit", limit);
      // console.log("remind", remind, " going:", down_up);
      while (jump > 0) {
        if (down_up == 0) {
          let tmp = remind + jump;
          let tmp2 = limit - 1;
          // console.log(tmp, tmp2);
          if (remind + jump > limit - 1) {
            jump = jump - (limit - remind - 1);
            remind = limit;
            down_up = 1;
          } else {
            remind = remind + jump;
            jump = 0;
          }
        } else {
          if (remind - jump < 0) {
            jump = jump - remind;
            remind = -1;
            down_up = 0;
          } else {
            remind = remind - jump;
            jump = 0;
          }
        }
      }
      // console.log("remindcalc:", remind, " going:", down_up);

      let round = this.state.totalPlayersInTeam - div;
      if (down_up === 0) {
        for (let i = remind; i < accounts.length; i++) {
          selectionOrder.push(accounts[i]);
        }
        for (let i = accounts.length - 1; i >= 0; i--) {
          selectionOrder.push(accounts[i]);
        }

        for (let i = 0; i < remind; i++) {
          selectionOrder.push(accounts[i]);
        }
      } else {
        let c = accounts.length - remind - 1;
        for (let i = c; i >= 0; i--) {
          selectionOrder.push(accounts[i]);
        }
        for (let i = 0; i < accounts.length; i++) {
          selectionOrder.push(accounts[i]);
        }
        for (let i = accounts.length - 1; i > c; i--) {
          selectionOrder.push(accounts[i]);
        }
      }

      // console.log(selectionOrder);
      this.setState({
        selectionOrder: selectionOrder,
      });
    }
  };

  showPlayers = id => {
    const p_u = this.state.poolPlayerWithUser;
    // console.log("pu", p_u);
    const ret = [];
    for (let i = 0; i < p_u.length; i++) {
      console.log(i, ':', p_u[i]['account']['email']);
      if (p_u[i]['account']['email'] === id) {
        ret.push(p_u[i]['players']);
      }
    }

    return ret;
  };

  toggleModal = () => {
    this.setState({
      modalToggle: !this.state.modalToggle,
    });
  };

  render() {
    const { state, props } = this;
    const { loading, players, poolPlayers } = state;
    const { accountStore } = props;

    const MessageData = []; //query by league_id
    const leagueData = this.state.leagueData; //query by league_id
    const playerListData = [];
    const playerPoolData = []; //query by league_id

    return (
      <div className={cx('root')}>
        <Spinner show={loading} />
        <h1>This is draft page!!</h1>
        <div> Run-no {leagueData.get('draft_run')} </div>
        <div>
          Round:
          {Math.floor(leagueData.get('draft_run') / leagueData.get('limit')) +
            1}
        </div>
        <div>Picking Order --></div>

        <div>
          {this.state.selectionOrder.length > 0 &&
            this.state.selectionOrder.map((d, index) => {
              return index < 7 ? (
                index === 0 ? (
                  <div
                    key={index}
                    className={cx('component', 'thick')}
                    onClick={this.toggleModal}
                  >
                    {index + 1}:&nbsp;{d['email'].split('@')[0]}
                    <Modal isOpen={this.state.modalToggle}>
                      <Btn
                        onClick={() => {
                          this.setState({
                            modalToggle: !this.state.modalToggle,
                          });
                          var abc = this.showPlayers(d['email']);
                        }}
                      >
                        Close
                      </Btn>
                      <div>Show the selected player by that user</div>
                      <b>
                        {/**JSON.stringify(this.state.acc_to_players[d['_id']][0]) **/}
                      </b>
                      <p> Here is table </p>
                      <table>
                        <tr>
                          <th> Players </th>
                        </tr>
                        {Object.keys(
                          this.state.acc_to_players[d['_id']] || {}
                        ).forEach(idx => {
                          return (
                            <tr>
                              <td>
                                {
                                  this.state.acc_to_players[d['_id']][idx][
                                    'Name'
                                  ]
                                }
                              </td>
                            </tr>
                          );
                        })}
                      </table>
                    </Modal>
                  </div>
                ) : (
                  <div key={index} className={cx('component')}>
                    {index + 1}:&nbsp;{d['email'].split('@')[0]}
                  </div>
                )
              ) : null;
            })}
        </div>
        <div>{this.state.showMessage}</div>
        <PlayerList
          players={players}
          selectedPlayer={poolPlayers}
          selectPlayer={this.selectPlayer}
          leagueId={this.state.league_id}
          userId={accountStore.getIn(['userInfo', '_id'])}
          emailId={accountStore.getIn(['userInfo', 'email'])}
        />
        <div>
          playerPoolData TODO: Chooseed player for all users Team1: Player1
          Player2 Team2: Player1 Player2
        </div>
        <ChatRoom roomId={this.props.match.params.l_id} />
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
