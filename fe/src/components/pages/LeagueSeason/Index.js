import React from 'react';
import { fromJS, List, Set, Map } from 'immutable';
import { Link } from 'react-router-dom';

import API from '../../../middleware/API';

import Spinner from '../../common/Spinner/Spinner';
import BackBtn from '../../common/Btn/BackBtn';
import Btn from '../../common/Btn/Btn';
import { Table, Thead, Tbody, Row, Col } from '../../common/Table/Index';

import Standings from './Standings';
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
      ScheduleByLeagueId: Map(),
      standings: List(),
      pointdata: {},
      gameWeek: 0,
      record: [],
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
      const ScheduleByLeagueId = fromJS(res.data.QueryScheduleByLeagueId || {});
      const teams = fromJS(res.data.QueryLeagueTeams);
      const standings = fromJS(res.data.ListTeam);
      this.setState({
        loading: false,
        teams,
        ScheduleByLeagueId,
        gameWeek: res.data.QueryLeague['gameWeek'],
        standings,
      });
    });
  }

  run = () => {
    const mutation = `mutation{RunMatch(league_id: "${this.state.lid}"){
        league_id
        week
        winner
        first_team {
          _id
          email
          role
          status
          ban
        }
        second_team{
            _id
            email
            role
            status
            ban
        }
    }}`;
    API.GraphQL(mutation).then(res => {
      //console.log(res);
      const newRecord = res.data.RunMatch;
      //console.log(newRecord);
      this.setState({
        record: newRecord,
      });
    });
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
                    <Col>{d.getIn(['first_team', 'email'])}</Col>
                    <Col>{d.getIn(['second_team', 'email'])}</Col>
                  </Row>
                ) : null;
              })}
            </Tbody>
          </Table>
        </div>
        <div>
          <Btn onClick={this.run} type="secondary">
            Run match
          </Btn>
          1.5 Run Button // Joel Tyler Calculate the match this week, and store
          the data into DB, reload the page.
        </div>
        <div>2. Formula for League // Joel & Tyler</div>
        <Standings gameWeek={gameWeek} data={standings} />
        <TeamsInfo data={teams} />
      </div>
    );
  }
}

export default LeagueSeason;
