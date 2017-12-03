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

const defensePositionFilter = inPosition => d => {
  return (
    defensePosition.has(d.get('Position')) && !inPosition.has(d.get('_id'))
  );
};

class Starter extends React.PureComponent {
  static defaultProps = {
    arrangement: Map(),
    players: List(),
    handleChangePlayer: () => () => {},
  };

  render() {
    const { props } = this;
    const { arrangement, players, handleChangePlayer } = props;

    const inPosition = arrangement.filter(d => d).reduce((acc, key) => {
      return acc.add(key.get('_id'));
    }, Set());

    const defensePosFilter = defensePositionFilter(inPosition);

    return (
      <div className={cx('root')}>
        <img className={cx('bg')} src={bg} />
        <Position
          style={{
            left: 260,
            top: 220,
          }}
          position="QB"
          positionKey="position_qb_0"
          player={arrangement.getIn(['position_qb_0']) || Map()}
          options={players.filter(
            d => d.get('Position') === 'QB' && !inPosition.has(d.get('_id'))
          )}
          handleChangePlayer={handleChangePlayer}
        />
        <Position
          style={{
            left: 1150,
            top: 20,
          }}
          position="K"
          positionKey="position_k_0"
          player={arrangement.getIn(['position_k_0']) || Map()}
          options={players.filter(
            d => d.get('Position') === 'K' && !inPosition.has(d.get('_id'))
          )}
          handleChangePlayer={handleChangePlayer}
        />
        <Position
          style={{
            left: 260,
            top: 40,
          }}
          position="TE"
          positionKey="position_te_0"
          player={arrangement.getIn(['position_te_0']) || Map()}
          options={players.filter(
            d => d.get('Position') === 'TE' && !inPosition.has(d.get('_id'))
          )}
          handleChangePlayer={handleChangePlayer}
        />
        <Position
          style={{
            left: 1150,
            top: 430,
          }}
          position="P"
          positionKey="position_p_0"
          player={arrangement.getIn(['position_p_0']) || Map()}
          options={players.filter(
            d => d.get('Position') === 'P' && !inPosition.has(d.get('_id'))
          )}
          handleChangePlayer={handleChangePlayer}
        />

        <Position
          style={{
            left: 80,
            top: 220,
          }}
          position="RB"
          positionKey="position_rb_0"
          player={arrangement.getIn(['position_rb_0']) || Map()}
          options={players.filter(
            d => d.get('Position') === 'RB' && !inPosition.has(d.get('_id'))
          )}
          handleChangePlayer={handleChangePlayer}
        />

        <Position
          style={{
            left: 440,
            top: 40,
          }}
          position="WR"
          positionKey="position_wr_0"
          player={arrangement.getIn(['position_wr_0']) || Map()}
          options={players.filter(
            d => d.get('Position') === 'WR' && !inPosition.has(d.get('_id'))
          )}
          handleChangePlayer={handleChangePlayer}
        />

        <Position
          style={{
            left: 440,
            top: 400,
          }}
          position="WR"
          positionKey="position_wr_1"
          player={arrangement.getIn(['position_wr_1']) || Map()}
          options={players.filter(
            d => d.get('Position') === 'WR' && !inPosition.has(d.get('_id'))
          )}
          handleChangePlayer={handleChangePlayer}
        />

        {/* DEF */}

        <Position
          style={{
            left: 680,
            top: 400,
          }}
          position="DEF"
          positionKey="position_defense_0"
          player={arrangement.getIn(['position_defense_0']) || Map()}
          options={players.filter(defensePosFilter)}
          handleChangePlayer={handleChangePlayer}
        />
        <Position
          style={{
            left: 680,
            top: 40,
          }}
          position="DEF"
          positionKey="position_defense_1"
          player={arrangement.getIn(['position_defense_1']) || Map()}
          options={players.filter(defensePosFilter)}
          handleChangePlayer={handleChangePlayer}
        />
        <Position
          style={{
            left: 680,
            top: 220,
          }}
          position="DEF"
          positionKey="position_defense_2"
          player={arrangement.getIn(['position_defense_2']) || Map()}
          options={players.filter(defensePosFilter)}
          handleChangePlayer={handleChangePlayer}
        />
        <Position
          style={{
            left: 900,
            top: 150,
          }}
          position="DEF"
          positionKey="position_defense_3"
          player={arrangement.getIn(['position_defense_3']) || Map()}
          options={players.filter(defensePosFilter)}
          handleChangePlayer={handleChangePlayer}
        />
        <Position
          style={{
            left: 900,
            top: 350,
          }}
          position="DEF"
          positionKey="position_defense_4"
          player={arrangement.getIn(['position_defense_4']) || Map()}
          options={players.filter(defensePosFilter)}
          handleChangePlayer={handleChangePlayer}
        />
      </div>
    );
  }
}

export default Starter;
