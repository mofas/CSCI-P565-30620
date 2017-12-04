import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { fromJS, List, Map } from 'immutable';

import API from '../../../middleware/API';

import Spinner from '../../common/Spinner/Spinner';

import BackBtn from '../../common/Btn/BackBtn';
import Btn from '../../common/Btn/Btn';
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
      initial: false,
      loading: false,
      arrangement: Map(),
      players: List(),
      poolPlayer: List(),
      playerInTeam: List(),
    };
  }

  componentDidMount() {
    const account_id = this.props.accountStore.getIn(['userInfo', '_id']);
    if (account_id && !this.state.initial) {
      this.loadData(account_id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const account_id = nextProps.accountStore.getIn(['userInfo', '_id']);
    if (account_id && !this.state.initial) {
      this.loadData(account_id);
    }
  }

  loadData = account_id => {
    const { l_id } = this.props.match.params;
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
          Interceptions_Thrown
          Forced_Fumbles
          Sacks
          Blocked_Kicks
          Blocked_Punts
          Safeties
          Kickoff_Return_TD
          Punt_Return_TD
          Defensive_TD
          Punting_i20
          Punting_Yards
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
        Team
      }
    `;

    this.setState({
      loading: true,
      initial: true,
    });

    API.GraphQL(query).then(res => {
      const QueryFantasyTeam = res.data.QueryFantasyTeam || {};
      const arrangement = fromJS(QueryFantasyTeam.arrangement || {});

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
        fantasyTeamId: QueryFantasyTeam._id,
        fantasyTeamName: QueryFantasyTeam.name,
        loading: false,
        arrangement,
        poolPlayer: fromJS(rawPoolPlayer || []),
        playerInTeam: fromJS(playerInTeam.players || []),
      });
    });
  };

  createTeam = () => {
    const leagueId = this.props.match.params.l_id;
    const account_id = this.props.accountStore.getIn(['userInfo', '_id']);
    const mutation = `
      mutation{
        CreateFantasyTeam(
        league_id: "${leagueId}",
        account_id: "${account_id}"
      ){
          success
          error
        }
      }
    `;

    API.GraphQL(mutation).then(res => {
      window.location.reload();
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
          success
          error
        }
      }
    `;

    this.setState({
      loading: true,
    });

    API.GraphQL(mutation).then(res => {
      const { players, poolPlayer, playerInTeam } = this.state;
      if (res.data.SelectedPlayer.success) {
        const targetPlayer = this.state.players
          .filter(d => d.get('_id') === player_id)
          .first();
        this.setState({
          poolPlayer: poolPlayer.push(targetPlayer),
          playerInTeam: playerInTeam.push(targetPlayer),
        });
      } else {
        window.alert(res.data.SelectedPlayer.error);
      }
      this.setState({
        loading: false,
      });
    });
  };

  render() {
    const { state, props } = this;
    const { accountStore } = props;
    const {
      loading,
      players,
      arrangement,
      poolPlayer,
      playerInTeam,
      fantasyTeamId,
    } = state;

    const { l_id } = props.match.params;
    const account_id = this.props.accountStore.getIn(['userInfo', '_id']);

    if (!loading && !fantasyTeamId) {
      return (
        <div className={cx('root')}>
          <Spinner show={loading} />
          <Link to={`/app/league/list`} style={{ display: 'inline-block' }}>
            <BackBtn type="secondary">Back to List</BackBtn>
          </Link>
          <h3>Look like you don't create your team successfully.</h3>
          <Btn onClick={this.createTeam}>Click to create team</Btn>
        </div>
      );
    }

    return (
      <div className={cx('root')}>
        <Spinner show={loading} />
        <Link to={`/app/league/list`} style={{ display: 'inline-block' }}>
          <BackBtn type="secondary">Back to List</BackBtn>
        </Link>

        <h3>Starters</h3>

        <Starter
          arrangement={arrangement}
          players={playerInTeam}
          handleChangePlayer={this.handleChangePlayer}
        />

        <h3>Your Team</h3>
        <InTeamPlayerList
          arrangement={arrangement}
          players={playerInTeam}
          handleReleasePlayer={this.handleReleasePlayer}
        />

        <h3>Select Free Agent</h3>
        <PlayerList
          players={players}
          selectPlayer={this.selectPlayer}
          leagueId={this.props.match.params.l_id}
          userId={accountStore.getIn(['userInfo', '_id'])}
          emailId={accountStore.getIn(['userInfo', 'email'])}
          selectedPlayers={poolPlayer}
        />
      </div>
    );
  }
}

export default connect(stores => {
  return {
    accountStore: stores.account,
  };
})(TradePlayer);
