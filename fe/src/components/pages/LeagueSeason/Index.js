import React from 'react';
import { fromJS, List, Set } from 'immutable';
import { Link } from 'react-router-dom';

import API from '../../../middleware/API';

import Spinner from '../../common/Spinner/Spinner';
import BackBtn from '../../common/Btn/BackBtn';

import TeamsInfo from './TeamsInfo';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class LeagueSeason extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      teams: List()
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
      }
      fragment playerMain on PlayerType {
        _id
        Name
        Position
      }
    `;
    this.setState({
      loading: true
    });
    API.GraphQL(query).then(res => {
      const teams = fromJS(res.data.QueryLeagueTeams);
      this.setState({
        loading: false,
        teams
      });
    });
  }

  render() {
    const { state, props } = this;
    const { loading, teams } = state;

    return (
      <div className={cx('root')}>
        <Link to={`/app/league/list`} style={{ display: 'inline-block' }}>
          <BackBtn type="secondary">Back to List</BackBtn>
        </Link>
        <Spinner show={loading} />
        <div>This is League Season Page</div>
        TODO :
        <div>1. Match schedule // Manish This week game, Next week game,</div>
        <div>
          1.5 Run Button // Joel Tyler Calculate the match this week, and store
          the data into DB, reload the page.
        </div>
        <div>
          2. Standing // Manish Read GameRecord from database, display on the UI
        </div>
        <div>2. Formula for League // Joel & Tyler</div>
        <TeamsInfo data={teams} />
      </div>
    );
  }
}

export default LeagueSeason;
