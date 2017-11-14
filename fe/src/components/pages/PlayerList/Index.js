import React from 'react';
import { fromJS, List, Set } from 'immutable';

import API from '../../../middleware/API';

import Spinner from '../../common/Spinner/Spinner';

import PlayerFilter from '../../common/PlayerFilter/PlayerFilter';
import { Tbody } from '../../common/Table/Index';
import Item from './Item';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class PlayerList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      players: List(),
    };
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
      }
    `;

    this.setState({
      loading: true,
    });

    API.GraphQL(query).then(res => {
      console.log(res);
      const players = fromJS(res.data.ListPlayer);
      this.setState({
        loading: false,
        players: players,
      });
    });
  }

  render() {
    const { state, props } = this;
    const { loading, players } = state;

    return (
      <div className={cx('root')}>
        <Spinner show={loading} />
        <PlayerFilter data={players}>
          {(tableData, selectPosition) => (
            <Tbody>
              {tableData.map(d => {
                return (
                  <Item
                    key={d.get('_id')}
                    data={d}
                    selectPosition={selectPosition}
                  />
                );
              })}
            </Tbody>
          )}
        </PlayerFilter>
      </div>
    );
  }
}

export default PlayerList;
