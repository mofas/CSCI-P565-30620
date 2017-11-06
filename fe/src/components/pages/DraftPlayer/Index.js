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
      selectionOrder: fromJS({}),
      totalPlayersInTeam: 15,
    };
  }
  componentWillMount() {
    this.props.dispatch(getUserInfo());
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
        LeagueData: QueryLeague(_id: "${this.state.league_id}"){
          name,
          draft_run,
          limit,
          accounts{
            _id,
            email,
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
      this.setPickingOrder(JSON.stringify(leagueData));
      this.setState({
        loading: false,
        players: players,
        leagueData: leagueData,
      });
    });
  }

  selectPlayer = (id, leagueId) => {
    window.alert('You select player with id:' + id + " league_id:" + leagueId);
  };
setPickingOrder = (strdata) => {
    //const data = this.state.leagueData.toObject(); 

    console.log("from setPickingOrder string", strdata);   
    const data = JSON.parse(strdata);
    console.log("from setPickingOrder", data);
    console.log("first data 7687686" , data['name']);


    if(data['name']){
      const draft = data['draft_run'];
      let limit = data['limit']; //data['limit'];
      let accounts = data['accounts']; //data['accounts'];
      let div = draft/limit;
      let remind = draft % limit;
      let down_up = div%2;
      var selectionOrder = [];
      let count = limit * 2;
      //console.log('length ', accounts.length);
      //console.log('down_up ', down_up);

      let round = this.state.totalPlayersInTeam - div;
      if(down_up === 0){
        
        while(round-- > 0){
          for(let i=remind; i < accounts.length; i++){
            selectionOrder.push(accounts[i]);
          }
          for(let i=accounts.length-1; i >= 0; i--){
            selectionOrder.push(accounts[i]);
          }
          
          for(let i=0; i < remind; i++){
            selectionOrder.push(accounts[i]);
          }
        }
        
      }else{
        while(round-- > 0){
          for(let i=remind; i >= 0; i--){
            selectionOrder.push(accounts[i]);
          }
          for(let i=0; i < accounts.length; i++){
            selectionOrder.push(accounts[i]);
          }
          for(let i=accounts.length-1; i > remind; i--){
            selectionOrder.push(accounts[i]);
          }
        }
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
    const leagueData = []; //query by league_id
    const playerListData = [];
    const playerPoolData = []; //query by league_id

    return (
      <div className={cx('root')}>
        <Spinner show={loading} />
        <h1>This is draft page!!</h1>
        <div>Picking Order </div>
         Hi: {accountStore.getIn(['userInfo', 'email'])}
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
        <PlayerList players={players} selectPlayer={this.selectPlayer} leagueId={this.state.league_id} />
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
