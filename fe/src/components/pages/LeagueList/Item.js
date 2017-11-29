import React from 'react';
import { List, Map } from 'immutable';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

import Btn from '../../common/Btn/Btn';
import SeasonIcon from '../../common/Icon/Season';
import InviteIcon from '../../common/Icon/Invite';
import JoinIcon from '../../common/Icon/Join';
import ManagerIcon from '../../common/Icon/Manager';
import DraftIcon from '../../common/Icon/Draft';
import DeleteIcon from '../../common/Icon/Delete';

import { Row, Col } from '../../common/Table/Index';

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
      <Row>
        <Col className={cx('name-col', 'text-left')}>{data.get('name')}</Col>
        <Col className={cx('pa-col', 'text-left')}>
          {data
            .get('accounts')
            .map(d => d.get('email'))
            .map(d => <div key={d}>{d}</div>)}
        </Col>
        <Col className={cx('creator-col')}>{creatorEmail}</Col>
        <Col className={cx('time-col')}>
          {format(new Date(data.get('create_time') * 1000), 'MM/DD HH:mm')}
        </Col>
        <Col className={cx('count-col')}>
          {data.get('accounts').count()} / {data.get('limit')}
        </Col>
        <Col className={cx('stage-col')}>{data.get('stage')}</Col>
        <Col className={cx('action-col')}>
          <div className={cx('function-bar')}>
            {leagueStatus === 'Initial' &&
            participantEmails
              .filter(email => email === userInfo.get('email'))
              .count() === 0 ? (
              <Btn
                className={cx('btn')}
                onClick={() => joinLeague(data.get('_id'))}
              >
                <JoinIcon className="icon" />
                Join
              </Btn>
            ) : null}

            {leagueStatus === 'Initial' ? (
              <Btn
                onClick={() => inviteFriend(data.get('_id'), data.get('name'))}
              >
                <InviteIcon className="icon" />
                Invite Friends
              </Btn>
            ) : null}

            {leagueStatus === 'Draft' &&
            participantEmails
              .filter(email => email === userInfo.get('email'))
              .count() > 0 ? (
              <Link to={`/app/league/draft/${data.get('_id')}`}>
                <Btn>
                  <DraftIcon className="icon" />
                  Draft Player
                </Btn>
              </Link>
            ) : null}
            {leagueStatus === 'Draft' && userInfo.get('_id') === creatorId ? (
              <Btn type="danger" onClick={() => deleteLeague(data.get('_id'))}>
                <DeleteIcon className="icon" />
                Delete
              </Btn>
            ) : null}
            {leagueStatus === 'SeasonStart' ? (
              <Link to={`/app/league/season/${data.get('_id')}`}>
                <Btn>
                  <SeasonIcon className="icon" />
                  Schedule
                </Btn>
              </Link>
            ) : null}
            {leagueStatus === 'SeasonStart' ? (
              <Link to={`/app/league/trade/${data.get('_id')}`}>
                <Btn>
                  <ManagerIcon className="icon" />
                  Manage Players
                </Btn>
              </Link>
            ) : null}
          </div>
        </Col>
      </Row>
    );
  }
}

export default LeagueItem;
