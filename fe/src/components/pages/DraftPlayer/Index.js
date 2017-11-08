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
      //userId : this.props.accountStore.getIn(['userInfo', 'email'])
    };
  }
  componentWillMount() {
    this.props.dispatch(getUserInfo());
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
            accounts{
              _id,
              email,
            }
          }
          PoolPlayers: QueryPoolPlayer(league_id: "${this.state.league_id}"){
            players {
              _id
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
        // console.log("poolplayers342342", JSON.stringify(poolPlayers));

        //console.log()
        let poolData = JSON.parse(JSON.stringify(poolPlayers));
        // console.log("--->",JSON.stringify(poolData[0]['players']));
        
      let poolPlayersId = [];
      poolPlayersId = poolData[0]['players'].map( player => {
        return player['_id'];
      });
      // console.log("poolplayers ids---->", JSON.stringify(poolPlayersId));
      let filterPlayers = players.filter((player) => {
          if(poolPlayersId.indexOf(player.get('_id')) >= 0){
              return false;
            }else{
              return true;
            }
      });
      // console.log("print- 9779879897 ---->>>-", JSON.stringify(filterPlayers) );  


        this.setState({
          loading: false,
          players: filterPlayers,
          leagueData: leagueData,
          poolPlayers: poolPlayers,
        });
      });
  }

  selectPlayer = (id, leagueId, userId) => {

    var run = Math.floor( this.state.leagueData.get('draft_run')/this.state.leagueData.get('limit') );
    run = run + 1;
    if( this.state.selectionOrder[0]['email'] === userId && run <= this.state.totalPlayersInTeam ){
        const mutation = `
          mutation{
            SelectedPlayer(league_id: "${leagueId}", player_id:"${id}", fancy_team_id: "${userId}" ){
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
          console.log("Successffully loaded the data");
         
      });
    }else{
      window.alert("Not your chance");
    }
  };

setPickingOrder = (strdata) => { 
    const data = JSON.parse(strdata);

    if(data['name']){
      let draft = data['draft_run'];
      let limit = data['limit']; //data['limit'];
      let accounts = data['accounts']; //data['accounts'];
      let div = Math.floor(draft/limit);
      let remind = draft % limit;
      let down_up = div%2;
      var selectionOrder = [];
      let count = limit * 2;
      
      let round = this.state.totalPlayersInTeam - div;
      if(down_up === 0){
        
        //while(round-- > 0){
          for(let i=remind; i < accounts.length; i++){
            selectionOrder.push(accounts[i]);
          }
          for(let i=accounts.length-1; i >= 0; i--){
            selectionOrder.push(accounts[i]);
          }
          
          for(let i=0; i < remind; i++){
            selectionOrder.push(accounts[i]);
          }
        //}
        
      }else{
       // while(round-- > 0){
          let c = accounts.length - remind - 1;
          for(let i=c; i >= 0; i--){
            selectionOrder.push(accounts[i]);
          }
          for(let i=0; i < accounts.length; i++){
            selectionOrder.push(accounts[i]);
          }
          for(let i=accounts.length-1; i > c; i--){
            selectionOrder.push(accounts[i]);
          }
        //}
      }

      console.log(selectionOrder);
      this.setState({
        selectionOrder: selectionOrder
      });
      
    }
  }

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
        <div> Round: {Math.floor(leagueData.get('draft_run')/leagueData.get('limit')) + 1} </div>
        <div>Picking Order --></div> 
        

	       <div>
                {this.state.selectionOrder.map( (d, index) => { 
                return (
                        (index < 7) ? ( index === 0) ? (
                          <div key={index} className={cx('component', 'thick')}>
                          {index+1}:&nbsp;{d['email'].split('@')[0]}
                          </div>) : (
                          <div key={index} className={cx('component')}>
                          {index+1}:&nbsp;{d['email'].split('@')[0]}
                          </div> ) : null 
                    ); 
                  }
             )}

        </div>
        <PlayerList players={players} selectPlayer={this.selectPlayer} leagueId={this.state.league_id} userId={accountStore.getIn(['userInfo', 'email'])}/>
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
