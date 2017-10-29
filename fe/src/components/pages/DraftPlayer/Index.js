import React from 'react';
import { fromJS, List, Set } from 'immutable';

import API from '../../../middleware/API';

import Spinner from '../../common/Spinner/Spinner';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class DraftPlayer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
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
        }
      }
    `;

    this.setState({
      loading: true,
    });

    API.GraphQL(query).then(res => {
      // console.log('cool!', res);
      const players = fromJS(res.data.ListPlayer);
      const allPosition = players.reduce((acc, d) => {
        if (d.get('Position') !== '') {
          return acc.add(d.get('Position'));
        }
        return acc;
      }, Set());
      this.setState({
        loading: false,
        players: players,
        allPosition: allPosition.toList(),
      });
    });
  }

  render() {
    const { state, props } = this;
    return (
      <div className={cx('root')}>
        <h1>This is draft page!!</h1>
        <div>TODO: Draft Sequence</div>
        <div>TODO: Player List </div>
        <div>TODO: Chat room</div>
        <div>TODO: Choose player status for all players</div>
      </div>
    );
  }
}

export default DraftPlayer;
