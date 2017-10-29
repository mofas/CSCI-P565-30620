import React from 'react';
import { List, Map } from 'immutable';
import { Link } from 'react-router-dom';

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
    const participantEmails = (data.getIn(['accounts']) || List())
      .map(d => d.get('email'));
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
          <div className={cx('left-bar')}>
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
              <Btn onClick={() => inviteFriend}>Invite Your Friend</Btn>
            ) : null}

            {leagueStatus === 'Draft' &&
            participantEmails
              .filter(email => email === userInfo.get('email'))
              .count() > 0 ? (
              <Link to={`/app/league/draft/${data.get('_id')}`}>
                <Btn>Go to Draft Player</Btn>
              </Link>
            ) : null}
          </div>
          <div className={cx('right-bar')}>
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
