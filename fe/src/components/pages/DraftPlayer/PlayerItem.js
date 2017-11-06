import React from 'react';
import { fromJS, List } from 'immutable';
import { Link } from 'react-router-dom';

import Btn from '../../common/Btn/Btn';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class PlayerItem extends React.PureComponent {
  static defaultProps = {
    data: List(),
    selectPlayer: () => {},
  };

  render() {
    const { props } = this;
    const { data, selectPlayer, leagueId } = props;
    return (
      <div className={cx('item')}>
        <div className={cx('info')}>
          <div className={cx('thumb')} />
          <Link
            className={cx('basic-info')}
            to={`/app/player/detail/${data.get('_id')}`}
          >
            <div className={cx('name')}>{data.get('Name')}</div>
            <div className={cx('position')}>{data.get('Position')}</div>
          </Link>
        </div>
        <div className={cx('ability')}>
          <div className={cx('ab-item')}>{data.get('Passing_Yards')}</div>
          <div className={cx('ab-item')}>{data.get('Rushing_Yards')}</div>
          <div className={cx('ab-item')}>{data.get('Receiving_Yards')}</div>
          <div className={cx('ab-item')}>{data.get('Passing_TDs')}</div>
          <div className={cx('ab-item')}>{data.get('Rushing_TDs')}</div>
          <div className={cx('ab-item')}>{data.get('Receiving_TD')}</div>
        </div>
        <div className={cx('op')}>
          <Btn onClick={() => selectPlayer(data.get('_id'), leagueId)}>
            Select this Player
          </Btn>
        </div>
      </div>
    );
  }
}

export default PlayerItem;
