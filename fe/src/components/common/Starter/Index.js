import React from 'react';
import { fromJS, List, Map, Set } from 'immutable';

import Position from './Position';
import bg from './football_bg.jpg';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

const defensePosition = Set([
  'CB',
  'DB',
  'DT',
  'NT',
  'DE',
  'LB',
  'OLB',
  'ILB',
  'MLB',
  'FS',
  'SS',
  'DEF',
  'SAF',
  'DL',
]);

const defensePositionFilter = d => defensePosition.has(d.get('Position'));

class Starter extends React.PureComponent {
  static defaultProps = {
    arrangement: Map(),
    players: List(),
    handleChangePlayer: () => {},
  };

  render() {
    const { props } = this;
    const { arrangement, players, handleChangePlayer } = props;
    return (
      <div className={cx('root')}>
        <img className={cx('bg')} src={bg} />
        <Position
          style={{
            left: 80,
            top: 220,
          }}
          position="QB"
          positionKey="position_qb"
          positionIndex={0}
          player={arrangement.getIn(['position_qb', 0])}
          options={players.filter(d => d.get('Position') === 'QB')}
          handleChangePlayer={handleChangePlayer}
        />
        <Position
          style={{
            left: 260,
            top: 220,
          }}
          position="K"
          positionKey="position_k"
          positionIndex={0}
          player={arrangement.getIn(['position_k', 0])}
          options={players.filter(d => d.get('Position') === 'K')}
          handleChangePlayer={handleChangePlayer}
        />
        <Position
          style={{
            left: 260,
            top: 40,
          }}
          position="TE"
          positionKey="position_te"
          positionIndex={0}
          player={arrangement.getIn(['position_te', 0])}
          options={players.filter(d => d.get('Position') === 'TE')}
          handleChangePlayer={handleChangePlayer}
        />
        <Position
          style={{
            left: 260,
            top: 400,
          }}
          position="P"
          positionKey="position_p"
          positionIndex={0}
          player={arrangement.getIn(['position_p', 0])}
          options={players.filter(d => d.get('Position') === 'P')}
          handleChangePlayer={handleChangePlayer}
        />

        <Position
          style={{
            left: 440,
            top: 220,
          }}
          position="RB"
          positionKey="position_rb"
          positionIndex={0}
          player={arrangement.getIn(['position_rb', 0])}
          options={players.filter(d => d.get('Position') === 'RB')}
          handleChangePlayer={handleChangePlayer}
        />

        <Position
          style={{
            left: 440,
            top: 40,
          }}
          position="WR"
          positionKey="position_rb"
          positionIndex={0}
          player={arrangement.getIn(['position_wr', 0])}
          options={players.filter(d => d.get('Position') === 'WR')}
          handleChangePlayer={handleChangePlayer}
        />

        <Position
          style={{
            left: 440,
            top: 400,
          }}
          position="WR"
          positionKey="position_wr"
          positionIndex={1}
          player={arrangement.getIn(['position_wr', 1])}
          options={players.filter(d => d.get('Position') === 'WR')}
          handleChangePlayer={handleChangePlayer}
        />

        {/* DEF */}

        <Position
          style={{
            left: 680,
            top: 220,
          }}
          position="DEF"
          positionKey="position_defense"
          positionIndex={0}
          player={arrangement.getIn(['position_defense', 0])}
          options={players.filter(defensePositionFilter)}
          handleChangePlayer={handleChangePlayer}
        />
        <Position
          style={{
            left: 860,
            top: 100,
          }}
          position="DEF"
          positionKey="position_defense"
          positionIndex={1}
          player={arrangement.getIn(['position_defense', 1])}
          options={players.filter(defensePositionFilter)}
          handleChangePlayer={handleChangePlayer}
        />
        <Position
          style={{
            left: 860,
            top: 340,
          }}
          position="DEF"
          positionKey="position_defense"
          positionIndex={2}
          player={arrangement.getIn(['position_defense', 2])}
          options={players.filter(defensePositionFilter)}
          handleChangePlayer={handleChangePlayer}
        />
        <Position
          style={{
            left: 1040,
            top: 40,
          }}
          position="DEF"
          positionKey="position_defense"
          positionIndex={3}
          player={arrangement.getIn(['position_defense', 3])}
          options={players.filter(defensePositionFilter)}
          handleChangePlayer={handleChangePlayer}
        />
        <Position
          style={{
            left: 1040,
            top: 400,
          }}
          position="DEF"
          positionKey="position_defense"
          positionIndex={4}
          player={arrangement.getIn(['position_defense', 4])}
          options={players.filter(defensePositionFilter)}
          handleChangePlayer={handleChangePlayer}
        />
      </div>
    );
  }
}

export default Starter;
