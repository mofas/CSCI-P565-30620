import React from 'react';
import { fromJS, List, Set } from 'immutable';
import { Link } from 'react-router-dom';

import API from '../../../middleware/API';

import Spinner from '../../common/Spinner/Spinner';
// import Btn from '../../common/Btn/Btn';
import BackBtn from '../../common/Btn/BackBtn';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class TradePlayer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    // const query = `
    //   {
    //     ListPlayer{
    //       _id
    //       Name
    //       Position
    //       Team
    //       Passing_Yards
    //       Rushing_Yards
    //       Receiving_Yards
    //       Passing_TDs
    //       Rushing_TDs
    //       Receiving_TD
    //       FG_Made
    //       FG_Missed
    //       Extra_Points_Made
    //       Interceptions
    //       Fumbles_Lost
    //       Interceptions_Thrown
    //       Forced_Fumbles
    //       Sacks
    //       Blocked_Kicks
    //       Blocked_Punts
    //       Safeties
    //       Kickoff_Return_TD
    //       Punt_Return_TD
    //       Defensive_TD
    //       Punting_i20
    //       Punting_Yards
    //     }
    //   }
    // `;
    // this.setState({
    //   loading: true,
    // });
    // API.GraphQL(query).then(res => {
    //   console.log(res);
    //   const players = fromJS(res.data.ListPlayer);
    //   this.setState({
    //     loading: false,
    //     players: players,
    //   });
    // });
  }

  render() {
    const { state, props } = this;
    const { loading } = state;

    return (
      <div className={cx('root')}>
        <Spinner show={loading} />
        <Link to={`/app/league/list`} style={{ display: 'inline-block' }}>
          <BackBtn type="secondary">Back to List</BackBtn>
        </Link>
        <div>This is Trade Player Page</div>
        <div>Trade page // CY</div>
        <div>1. player list // CY</div>
        <div>2. team players list // CY</div>
        <div>You can only fire the players in bench.</div>
        <div>And you can pick new player from free market</div>
        <div>3. trade UI</div>
        <div>Dropdrown form for making trade request</div>
        <div>3.1 The need to select the team in league</div>
        <div>3.2 Then select the player you want in that team.</div>
        <div>3.3 You need to offer the player in bench.</div>
        <div>3.4 Make the request</div>
      </div>
    );
  }
}

export default TradePlayer;
