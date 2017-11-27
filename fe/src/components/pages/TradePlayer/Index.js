import React from 'react';
import { fromJS, List, Map } from 'immutable';
import { Link } from 'react-router-dom';

import API from '../../../middleware/API';

import Spinner from '../../common/Spinner/Spinner';

import BackBtn from '../../common/Btn/BackBtn';
import Starter from '../../common/Starter/Index';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class TradePlayer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fantasyTeamId: '',
      fantasyTeamName: '',
      loading: false,
      arrangement: Map(),
      poolPlayer: List(),
    };
  }

  componentDidMount() {
    const { l_id, account_id } = this.props.match.params;
    const query = `

      {
        QueryFantasyTeam(league_id: "${l_id}", account_id: "${account_id}") {
          _id
          name
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
        QueryPoolPlayer(league_id:"${l_id}"){
          account{
            _id
          }
          players{
            ...playerMain
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
      loading: true,
    });

    API.GraphQL(query).then(res => {
      const arrangement = fromJS(res.data.QueryFantasyTeam.arrangement);
      const rawPoolPlayer =
        (res.data.QueryPoolPlayer || []).filter(d => {
          if (d.account) {
            return d.account._id === account_id;
          }
          return false;
        })[0] || {};

      this.setState({
        fantasyTeamId: res.data.QueryFantasyTeam._id,
        fantasyTeamName: res.data.QueryFantasyTeam.name,
        loading: false,
        arrangement,
        poolPlayer: fromJS(rawPoolPlayer.players || []),
      });
    });
  }

  handleChangePlayer = ({ positionKey }) => e => {
    this.setState({
      loading: true,
    });
    const { poolPlayer } = this.state;
    const player_id = e.target.value;

    const mutation = `
        mutation{
          UpdateTeamArrangement(fantasy_team_id:"${this.state.fantasyTeamId}"
          position: "${positionKey}"
          player_id: "${player_id}"){
            success
          }
        }
    `;

    API.GraphQL(mutation).then(res => {
      console.log(res);
      if (res.data.UpdateTeamArrangement.success) {
        let value = null;
        if (player_id !== '') {
          value = poolPlayer.filter(d => d.get('_id') === player_id).first();
        }
        //update local state.
        this.setState({
          arrangement: this.state.arrangement.updateIn(
            [positionKey],
            () => value
          ),
        });
      }

      this.setState({
        loading: false,
      });
    });
  };

  render() {
    const { state, props } = this;
    const { loading, arrangement, poolPlayer } = state;

    const { l_id, account_id } = props.match.params;

    return (
      <div className={cx('root')}>
        <Spinner show={loading} />
        <Link to={`/app/league/list`} style={{ display: 'inline-block' }}>
          <BackBtn type="secondary">Back to List</BackBtn>
        </Link>

        <Starter
          arrangement={arrangement}
          players={poolPlayer}
          handleChangePlayer={this.handleChangePlayer}
        />
        <div>league ID: {l_id}</div>
        <div>account ID: {account_id}</div>
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
