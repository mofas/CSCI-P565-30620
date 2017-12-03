import React from 'react';
import { fromJS, List } from 'immutable';

import PlayerFilter from '../../common/PlayerFilter/PlayerFilter';
import { Tbody, Col } from '../../common/Table/Index';
import PlayerItem from './PlayerItem';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

const extraCol = <Col className={cx('op-col')} />;

class PlayerList extends React.PureComponent {
  static defaultProps = {
    players: List(),
    selectedPlayers: List(),
    selectPlayer: () => {},
    isDisabled: false,
  };

  render() {
    const { props } = this;
    const {
      players,
      selectedPlayers,
      selectPlayer,
      leagueId,
      userId,
      isDisabled,
    } = props;

    return (
      <div className={cx('player-list')}>
        <PlayerFilter data={players} extraCol={extraCol}>
          {(tableData, selectPosition) => (
            <div className={cx('player-item-wrap')}>
              <Tbody>
                {tableData.map(d => {
                  return (
                    <PlayerItem
                      key={d.get('_id')}
                      data={d}
                      selectedPlayers={selectedPlayers}
                      selectPlayer={selectPlayer}
                      leagueId={leagueId}
                      userId={userId}
                      selectPosition={selectPosition}
                      isDisabled={isDisabled}
                    />
                  );
                })}
              </Tbody>
            </div>
          )}
        </PlayerFilter>
      </div>
    );
  }
}

export default PlayerList;
