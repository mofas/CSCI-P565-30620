import React from 'react';
import { List, Map } from 'immutable';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

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
    inviteFriend: () => {},
  };

  render() {
    const { props } = this;
    const { joinLeague, deleteLeague, inviteFriend, userInfo, data } = props;

    const leagueStatus = data.get('stage');
    const participantEmails = (data.getIn(['accounts']) || List()).map(d =>
      d.get('email')
    );

    const creatorId = data.getIn(['creator', '_id']);
    const creatorEmail = data.getIn(['creator', 'email']);
    return (
      <div className={cx('pseudo-row')}>
        <div className={cx('pseudo-col', 'name-col', 'text-left')}>
          {data.get('name')}
        </div>
        <div className={cx('pseudo-col', 'pa-col', 'text-left')}>
          {data
            .get('accounts')
            .map(d => d.get('email'))
            .join(',')}
        </div>
        <div className={cx('pseudo-col', 'creator-col')}>{creatorEmail}</div>
        <div className={cx('pseudo-col', 'time-col')}>
          {format(new Date(data.get('create_time') * 1000), 'MM/DD HH:mm')}
        </div>
        <div className={cx('pseudo-col', 'count-col')}>
          {data.get('accounts').count()} / {data.get('limit')}
        </div>
        <div className={cx('pseudo-col', 'stage-col')}>{data.get('stage')}</div>
        <div className={cx('pseudo-col', 'action-col')}>
          <div className={cx('function-bar')}>
            {leagueStatus === 'Initial' &&
            participantEmails
              .filter(email => email === userInfo.get('email'))
              .count() === 0 ? (
              <Btn
                className={cx('btn')}
                onClick={() => joinLeague(data.get('_id'))}
              >
                Join
              </Btn>
            ) : null}

            {leagueStatus === 'Initial' ? (
              <Btn
                onClick={() => inviteFriend(data.get('_id'), data.get('name'))}
              >
                Invite Your Friend
              </Btn>
            ) : null}

            {leagueStatus === 'Draft' &&
            participantEmails
              .filter(email => email === userInfo.get('email'))
              .count() > 0 ? (
              <Link to={`/app/league/draft/${data.get('_id')}`}>
                <Btn>Go to Draft Player</Btn>
              </Link>
            ) : null}
            {userInfo.get('_id') === creatorId ? (
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
