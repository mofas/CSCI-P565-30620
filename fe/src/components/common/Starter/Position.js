import React from 'react';
import { Map, List } from 'immutable';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class Position extends React.PureComponent {
  static defaultProps = {
    position: 'QB',
    positionKey: 'position_qb',
    positionIndex: 0,
    player: Map(),
    handleChangePlayer: () => {},
    options: List(),
    style: {},
  };
  render() {
    const { props } = this;
    const { position, style, player, handleChangePlayer, options } = props;

    console.log(player.toJS());
    return (
      <div className={cx('position-wrap')} style={style}>
        <div className={cx('position')}>{position}</div>
        <div className={cx('thumb')} />
        <select onChange={handleChangePlayer}>
          {options.map(d => {
            return (
              <option
                value={d.get('_id')}
                selected={player.get('_id') === d.get('_id')}
              >
                {d.get('Name')}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
}

export default Position;
