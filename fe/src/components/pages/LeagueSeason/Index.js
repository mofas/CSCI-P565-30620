import React from 'react';
import { fromJS, List, Set, Map } from 'immutable';
import { Link } from 'react-router-dom';

import API from '../../../middleware/API';

import Spinner from '../../common/Spinner/Spinner';
import BackBtn from '../../common/Btn/BackBtn';
import { Table, Thead, Tbody, Row, Col } from '../../common/Table/Index';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class LeagueSeason extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      lid: this.props.match.params.l_id,
      ScheduleByLeagueId: fromJS({}),
      standings: [],
      pointdata: {},
      gameWeek: 0
    };
  }

  setRanking = (GameRecordByLeagueId, accounts) => {
    console.log("printing here", GameRecordByLeagueId);
    let pointdata = {};
    let standings = [];
    if(GameRecordByLeagueId.length > 0){
      for(let i=0; i<GameRecordByLeagueId.length; i++){
        if(!(GameRecordByLeagueId[i]['first_team']['_id'] in pointdata)){
          let tmp = {};
          tmp['email'] = GameRecordByLeagueId[i]['first_team']['email'];
          tmp['_id'] = GameRecordByLeagueId[i]['first_team']['_id'];
          tmp['win'] = 0;
          tmp['lose'] = 0;
          tmp['tp'] = 0;
          tmp['tm'] = 0;
          pointdata[ GameRecordByLeagueId[i]['first_team']['_id'] ] = tmp;
        }
        if(!(GameRecordByLeagueId[i]['second_team']['_id'] in pointdata)){
          let tmp = {};
          tmp['email'] = GameRecordByLeagueId[i]['second_team']['email']
          tmp['_id'] = GameRecordByLeagueId[i]['first_team']['_id'];
          tmp['win'] = 0;
          tmp['lose'] = 0;
          tmp['tp'] = 0;
          tmp['tm'] = 0;
          pointdata[ GameRecordByLeagueId[i]['second_team']['_id'] ] = tmp;
        }
        pointdata[GameRecordByLeagueId[i]['first_team']['_id']]['tm']++;
        pointdata[GameRecordByLeagueId[i]['second_team']['_id']]['tm']++;

        if(GameRecordByLeagueId[i]['winner'] == 0){
          pointdata[GameRecordByLeagueId[i]['first_team']['_id']] ['win']++;
          pointdata[GameRecordByLeagueId[i]['first_team']['_id']] ['tp']++;
          pointdata[GameRecordByLeagueId[i]['second_team']['_id']] ['lose']++;
        }else{
          pointdata[GameRecordByLeagueId[i]['second_team']['_id']] ['win']++;
          pointdata[GameRecordByLeagueId[i]['second_team']['_id']] ['tp']++;
          pointdata[GameRecordByLeagueId[i]['first_team']['_id']] ['lose']++;
        }
      }
      for(let key in pointdata){
        standings.push(pointdata[key]);
      }
  
      // standings.sort(function(arg1, arg2) {
      //   let a = arg1['tp'];
      //   let b = arg2['tp'];
      //   return a < b ? -1 : (a > b ? 1 : 0);
      // });
    }
    else{
      let t = {
        'win': 0,
        'lose': 0,
        'tp': 0,
        'tm': 0
      };
      for(let i=0; i<accounts.length; i++){
        t['email'] = accounts[i]['email'];
        t['_id'] = accounts[i]['_id']; 
        standings.push(Object.assign({}, t));
      }
    }

    this.setState({
      standings: standings
    });
    console.log("ehqkjwehq ", standings);

  }

  componentDidMount() {
    const query = `
          {
            QueryScheduleByLeagueId(league_id: "${this.state.lid}" ) {
                week_no
                first_team {
                  email
                }
                second_team {
                  email
                }
            }
            QueryGameRecordByLeagueId(league_id: "${this.state.lid}"){
              league_id
              first_team {
                _id
                email
              }
              second_team {
                _id
                email
              }
              winner
            }
            QueryLeague(_id : "${this.state.lid}"){
              name
              gameWeek
              accounts {
                _id
                email
              }
            }
          }
        `;
    this.setState({
      loading: true,
    });
    API.GraphQL(query).then(res => {
      //console.log(res);
      const ScheduleByLeagueId = fromJS(res.data.QueryScheduleByLeagueId);
      const GameRecordByLeagueId = res.data.QueryGameRecordByLeagueId;
      this.setRanking(GameRecordByLeagueId, res.data.QueryLeague['accounts']);
      //console.log(JSON.stringify(ScheduleByLeagueId));

      this.setState({
        loading: false,
        ScheduleByLeagueId: ScheduleByLeagueId,
        gameWeek: res.data.QueryLeague['gameWeek']
      });
    });
    this.getStandings();
  }

  run = () => {
    const mutation = `{RunMatch(league_id: "${this.state.lid}")}`;
    //?????
  };

  getStandings = () => {
    const query = `{ListTeam(league_id: "${this.state.lid}"){ _id,
        name,
        win,
        lose}}`;
    this.setState({
      loading: true,
    });
    API.GraphQL(query).then(res => {
      //console.log(res);
      const teams = fromJS(res.data.ListTeam);
      //console.log(JSON.stringify(ScheduleByLeagueId));
      this.setState({
        loading: false,
        standings: teams,
      });
    });
  };

  render() {
    const { state, props } = this;
    const { loading, ScheduleByLeagueId } = state;

    return (
      <div className={cx('root')}>
        <Link to={`/app/league/list`} style={{ display: 'inline-block' }}>
          <BackBtn type="secondary">Back to List</BackBtn>
        </Link>
        <Spinner show={loading} />
        <div>This is League Season Page</div>
        TODO :
        <div>
          1. Match schedule // Manish This week game, Next week game,
          <Table>
            <Thead>
              <Row>
                <Col> Upcoming Fixture </Col>
              </Row>

              <Row>
                <Col>Week No</Col>
                <Col>first_team</Col>
                <Col>second_team </Col>
              </Row>
            </Thead>
            <Tbody>
              {this.state.ScheduleByLeagueId.map((d, i) => {
                return (
                   d.get('week_no') === this.state.gameWeek || d.get('week_no') === this.state.gameWeek + 1 ? (
                  <Row key={i}>
                    <Col>{d.get('week_no')}</Col>
                    <Col>{d.get('first_team').get('email')}</Col>
                    <Col>{d.get('second_team').get('email')}</Col>
                  </Row>
                  ) : (null)
                );
              })}
            </Tbody>
          </Table>
        </div>
        <div>
          <button onClick={this.run()}>Does nothing. Will run match</button>{' '}
          <p />
          1.5 Run Button // Joel Tyler Calculate the match this week, and store
          the data into DB, reload the page.
        </div>
        <div>
          2. Standing // Manish Read GameRecord from database, display on the UI
          <Table>
            <Thead>
              <Row>
                <Col> Standing </Col>
              </Row>

              <Row>
                <Col>Rank </Col>
                <Col>Team - Manager</Col>
                <Col> Wins </Col>
                <Col> Lose </Col>
                <Col> Total matches </Col>
                <Col> Total Points </Col>
              </Row>
            </Thead>
            <Tbody>
              {this.state.standings.map((d, i) => {
                return (
                  <Row key={i}>
                    <Col>{i+1}</Col>
                    <Col>{d['email']}</Col>
                    <Col>{d['win']}</Col>
                    <Col>{d['lose']}</Col>
                    <Col>{d['tm']}</Col>
                    <Col>{d['tp']}</Col>
                  </Row>
                );
              })}
            </Tbody>
          </Table>          
        </div>
        <div>2. Formula for League // Joel & Tyler</div>
        <div>
          3. UI for Starters // CY Read arrangement data from server Store data
          when finishing.
        </div>
      </div>
    );
  }
}

export default LeagueSeason;
