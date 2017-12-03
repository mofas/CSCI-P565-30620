import React from 'react';
import { Map, List } from 'immutable';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class Position extends React.PureComponent {
  static defaultProps = {
    position: 'QB',
    positionKey: 'position_qb_0',
    player: Map(),
    handleChangePlayer: () => () => {},
    options: List(),
    style: {},
  };

  render() {
    const { props } = this;
    const {
      position,
      style,
      player,
      handleChangePlayer,
      options,
      positionKey,
    } = props;
    return (
      <div className={cx('position-wrap')} style={style}>
        <div className={cx('position')}>{position}</div>
        <div className={cx('thumb')}>
          {player.get('Name') ? (
            <img
              id="PlayerProfile"
              src={
                './PlayerPics/' +
                player.get('Team') +
                '_' +
                player.get('Name') +
                '.png'
              }
              onError={() =>
                (document.getElementById('PlayerProfile').src =
                  './PlayerPics/default.png')
              }
            />
          ) : (
            <img src={'./PlayerPics/default.png'} />
          )}
        </div>
        <select
          className={cx('player-selector')}
          onChange={handleChangePlayer({
            positionKey,
          })}
          value={player.get('_id') || ''}
        >
          {player.get('_id') ? (
            <option value={player.get('_id')}>{player.get('Name')}</option>
          ) : null}
          {options.map(d => {
            return (
              <option key={d.get('_id')} value={d.get('_id')}>
                {d.get('Name')}
              </option>
            );
          })}
          <option value="">-- Empty --</option>
        </select>
      </div>
    );
  }
}

export default Position;
