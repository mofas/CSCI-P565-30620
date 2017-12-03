import React from 'react';
import { fromJS, List, Set, Map } from 'immutable';
import { Link } from 'react-router-dom';

import API from '../../../middleware/API';

import Spinner from '../../common/Spinner/Spinner';
import BackBtn from '../../common/Btn/BackBtn';
import { Table, Thead, Tbody, Row, Col } from '../../common/Table/Index';

import TeamsInfo from './TeamsInfo';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class LeagueSeason extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      teams: List(),
      lid: this.props.match.params.l_id,
      ScheduleByLeagueId: fromJS({}),
      standings: [],
      pointdata: {},
      gameWeek: 0,
    };
  }

  componentDidMount() {
    const { l_id } = this.props.match.params;
    const query = `
      {
        QueryLeagueTeams(league_id: "${l_id}") {
          _id
          name
          win
          lose
          account{
            email
          }
          arrangement {
            position_qb_0 {
              ...playerMain
            }
            position_rb_0 {
              ...playerMain
            }
            position_wr_0 {
              ...playerMain
            }
            position_wr_1 {
              ...playerMain
            }
            position_te_0 {
              ...playerMain
            }
            position_k_0 {
              ...playerMain
            }
            position_p_0 {
              ...playerMain
            }
            position_defense_0 {
              ...playerMain
            }
            position_defense_1 {
              ...playerMain
            }
            position_defense_2 {
              ...playerMain
            }
            position_defense_3 {
              ...playerMain
            }
            position_defense_4 {
              ...playerMain
            }
          }
        }
        QueryScheduleByLeagueId(league_id: "${this.state.lid}" ) {
            week_no
            first_team {
              email
            }
            second_team {
              email
            }
        }
        QueryLeague(_id : "${this.state.lid}"){
          name
          gameWeek
          accounts {
            _id
            email
          }
        }
        ListTeam(league_id: "${this.state.lid}"){
          _id,
          name,
          account{
            _id
            email
          }
          win,
          lose
        }
      }
      fragment playerMain on PlayerType {
        _id
        Name
        Position
      }
    `;
    this.setState({
      loading: true,
    });
    API.GraphQL(query).then(res => {
      const ScheduleByLeagueId = fromJS(res.data.QueryScheduleByLeagueId);
      const teams = fromJS(res.data.QueryLeagueTeams);
      const standings = res.data.ListTeam;
      this.setState({
        loading: false,
        teams,
        ScheduleByLeagueId: ScheduleByLeagueId,
        gameWeek: res.data.QueryLeague['gameWeek'],
        standings,
      });
    });
  }

  run = () => {
    const mutation = `{RunMatch(league_id: "${this.state.lid}")}`;
    //TODO...
  };

  render() {
    const { state, props } = this;
    const { loading, ScheduleByLeagueId, standings, gameWeek, teams } = state;

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
                return d.get('week_no') === this.state.gameWeek ||
                  d.get('week_no') === this.state.gameWeek + 1 ? (
                  <Row key={i}>
                    <Col>{d.get('week_no')}</Col>
                    <Col>{d.get('first_team').get('email')}</Col>
                    <Col>{d.get('second_team').get('email')}</Col>
                  </Row>
                ) : null;
              })}
            </Tbody>
          </Table>
        </div>
        <div>
          <button onClick={this.run}>Does nothing. Will run match</button>
          <p />
          1.5 Run Button // Joel Tyler Calculate the match this week, and store
          the data into DB, reload the page.
        </div>
        <div>
          <Table>
            <Thead>
              <Row>
                <Col> Standing : Week - {gameWeek - 1} </Col>
              </Row>

              <Row>
                <Col>Rank </Col>
                <Col>Team/Manager</Col>
                <Col> Wins </Col>
                <Col> Lose </Col>
              </Row>
            </Thead>
            <Tbody>
              {standings.map((d, i) => {
                return (
                  <Row key={i}>
                    <Col>{i + 1}</Col>
                    <Col>{d['name'] ? d['name'] : d['account']['email']}</Col>
                    <Col>{d['win']}</Col>
                    <Col>{d['lose']}</Col>
                  </Row>
                );
              })}
            </Tbody>
          </Table>
        </div>
        <div>2. Formula for League // Joel & Tyler</div>
        <TeamsInfo data={teams} />
      </div>
    );
  }
}

export default LeagueSeason;
