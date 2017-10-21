import React from 'react';
import { List, Map } from 'immutable';
import Btn from '../../common/Btn/Btn';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class LeagueItem extends React.PureComponent {
  static defaultProps = {
    data: List(),
    userInfo: Map(),
    joinLeague: () => {},
    deleteLeague: () => {},
  };

  render() {
    const { props } = this;
    const { joinLeague, deleteLeague, userInfo, data } = props;
    return (
      <div className={cx('item')}>
        <div className={cx('name')}>{data.get('name')}</div>
        <div className={cx('info-wrap')}>
          <div className={cx('info-title')}>Current Players / Max Players</div>
          <div className={cx('info-content')}>
            {data.get('accounts').count()} / {data.get('limit')}
          </div>
        </div>
        <div className={cx('info-wrap')}>
          <div className={cx('info-title')}>Stage</div>
          <div className={cx('info-content')}>{data.get('stage')}</div>
        </div>
        <div className={cx('function-bar')}>
          <div>
            {data.get('stage') === 'Initial' ? data
              .get('accounts')
              .filter(d => d.get('email') === userInfo.get('email'))
              .count() === 0 ? (
              <Btn
                className={cx('btn')}
                onClick={() => joinLeague(data.get('_id'))}
              >
                Join
              </Btn>
            ) : (
              <Btn className={cx('btn')} disabled>
                Joined
              </Btn>
            ) : null}
          </div>
          <div>
            {userInfo.get('role') === 'admin' ? (
              <Btn type="danger" onClick={() => deleteLeague(data.get('_id'))}>
                {' '}
                Delete
              </Btn>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default LeagueItem;
