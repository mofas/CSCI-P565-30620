import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { fromJS, List, Map } from 'immutable';

import API from '../../../middleware/API';

import Spinner from '../../common/Spinner/Spinner';

import BackBtn from '../../common/Btn/BackBtn';
import Starter from '../../common/Starter/Index';
import InTeamPlayerList from './InTeamPlayerList';
import PlayerList from '../../common/SelectPlayerList/PlayerList';

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
      players: List(),
      poolPlayer: List(),
      playerInTeam: List(),
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const { l_id, account_id } = this.props.match.params;
    const query = `
      {
        ListPlayer{
          ...playerMain
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

      const rawPoolPlayer = (res.data.QueryPoolPlayer || []).reduce(
        (acc, d) => acc.concat(d.players),
        []
      );
      const playerInTeam =
        (res.data.QueryPoolPlayer || []).filter(d => {
          if (d.account) {
            return d.account._id === account_id;
          }
          return false;
        })[0] || {};

      this.setState({
        players: fromJS(res.data.ListPlayer),
        fantasyTeamId: res.data.QueryFantasyTeam._id,
        fantasyTeamName: res.data.QueryFantasyTeam.name,
        loading: false,
        arrangement,
        poolPlayer: fromJS(rawPoolPlayer || []),
        playerInTeam: fromJS(playerInTeam.players),
      });
    });
  };

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

  handleReleasePlayer = player_id => {
    const { l_id } = this.props.match.params;
    const mutation = `
      mutation{
        ReleasePlayer(league_id:"${l_id}" player_id: "${player_id}"){
          success
        }
      }
    `;

    this.setState({
      loading: true,
    });

    API.GraphQL(mutation).then(res => {
      if (res.data.ReleasePlayer.success) {
        this.setState({
          poolPlayer: this.state.poolPlayer.filter(
            d => d.get('_id') !== player_id
          ),
          playerInTeam: this.state.playerInTeam.filter(
            d => d.get('_id') !== player_id
          ),
        });
      }

      this.setState({
        loading: false,
      });
    });
  };

  selectPlayer = (player_id, leagueId, userId) => {
    const mutation = `
      mutation{
        SelectedPlayer(
        league_id: "${leagueId}",
        player_id:"${player_id}",
        account_id: "${userId}"
      ){
          player_id
        }
      }
    `;

    this.setState({
      loading: true,
    });

    API.GraphQL(mutation).then(res => {
      const { players, poolPlayer, playerInTeam } = this.state;
      if (res) {
        const targetPlayer = this.state.players
          .filter(d => d.get('_id') === player_id)
          .first();

        this.setState({
          poolPlayer: poolPlayer.push(targetPlayer),
          playerInTeam: playerInTeam.push(targetPlayer),
        });
      }
      this.setState({
        loading: false,
      });
    });
  };

  render() {
    const { state, props } = this;
    const { accountStore } = props;
    const { loading, players, arrangement, poolPlayer, playerInTeam } = state;
    const { l_id, account_id } = props.match.params;

    return (
      <div className={cx('root')}>
        <Spinner show={loading} />
        <Link to={`/app/league/list`} style={{ display: 'inline-block' }}>
          <BackBtn type="secondary">Back to List</BackBtn>
        </Link>

        <h3>Player Starter</h3>

        <Starter
          arrangement={arrangement}
          players={poolPlayer}
          handleChangePlayer={this.handleChangePlayer}
        />

        <h3>Player In your Team</h3>
        <InTeamPlayerList
          arrangement={arrangement}
          players={playerInTeam}
          handleReleasePlayer={this.handleReleasePlayer}
        />

        <h3>Select Player from Free Market</h3>
        <PlayerList
          players={players}
          selectPlayer={this.selectPlayer}
          leagueId={this.props.match.params.l_id}
          userId={accountStore.getIn(['userInfo', '_id'])}
          emailId={accountStore.getIn(['userInfo', 'email'])}
          selectedPlayers={poolPlayer}
        />

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

export default connect(stores => {
  return {
    accountStore: stores.account,
  };
})(TradePlayer);
