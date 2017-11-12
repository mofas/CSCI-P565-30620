import React from 'react';
import { fromJS, toJS, List, Set } from 'immutable';
import { connect } from 'react-redux';
import { getUserInfo, logout } from '../../../reducers/account';

import API from '../../../middleware/API';
import Spinner from '../../common/Spinner/Spinner';

import ChatRoom from '../../common/ChatRoom/ChatRoom';
import PlayerList from './PlayerList';

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
      totalPlayersInTeam: 15,
      poolPlayers: List(),
      modalToggle: false,
      //userId : this.props.accountStore.getIn(['userInfo', 'email'])
    };
  }
  componentWillMount() {
    this.props.dispatch(getUserInfo());
    Modal.setAppElement('body');
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
          }
          LeagueData: QueryLeague(_id: "${this.state.league_id}"){
            name,
            draft_run,
            limit,
            timeout,
            lastPickTime,
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
        }
      `;

    this.setState({
      loading: true,
    });

    API.GraphQL(query).then(res => {
      const players = fromJS(res.data.ListPlayer);
      const leagueData = fromJS(res.data.LeagueData);
      const poolPlayers = fromJS(res.data.PoolPlayers);
      this.setPickingOrder(JSON.stringify(leagueData));

      let poolData = JSON.parse(JSON.stringify(poolPlayers));
      console.log('da sda', poolData.length);

      let filterPlayers = [];
      if (poolData.length > 0) {
        let poolPlayersId = [];
        poolPlayersId = poolData[0]['players'].map(player => {
          return player['_id'];
        });

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

      this.setState({
        loading: false,
        players: filterPlayers,
        leagueData: leagueData,
        poolPlayers: poolPlayers,
      });
    });
  };

  selectPlayer = (id, leagueId, userId) => {
    var run = Math.floor(
      this.state.leagueData.get('draft_run') /
        this.state.leagueData.get('limit')
    );
    run = run + 1;
    if (
      this.state.selectionOrder[0]['email'] === userId &&
      run <= this.state.totalPlayersInTeam
    ) {
      const mutation = `
          mutation{
            SelectedPlayer(league_id: "${leagueId}", player_id:"${
        id
      }", fancy_team_id: "${userId}" ){
              player_id
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
    } else {
      window.alert('Not your chance');
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
      let accounts = data['accounts']; //data['accounts'];
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

      console.log(selectionOrder);
      this.setState({
        selectionOrder: selectionOrder,
      });
    }
  };

  showPlayers = id => {
    return JSON.stringify(this.state.poolPlayers);
  };

  toggleModal = () => {
    this.setState({
      modalToggle: !this.state.modalToggle,
    });
  };

  render() {
    const { state, props } = this;
    const { loading, players } = state;
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
          {' '}
          Round:{' '}
          {Math.floor(leagueData.get('draft_run') / leagueData.get('limit')) +
            1}{' '}
        </div>
        <div>Picking Order --></div>

        <div>
          {this.state.selectionOrder.map((d, index) => {
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
                      }}
                    >
                      {' '}
                      Close{' '}
                    </Btn>
                    <div>Show the selected player by that user</div>
                    {JSON.stringify(this.state.selectionOrder)}
                    {this.showPlayers()}
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
        <PlayerList
          players={players}
          selectPlayer={this.selectPlayer}
          leagueId={this.state.league_id}
          userId={accountStore.getIn(['userInfo', 'email'])}
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
