import React from 'react';
import { fromJS, List, Map, Set } from 'immutable';

import Btn from '../../common/Btn/Btn';
import TeamStarter from './TeamStarter';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class TeamsInfo extends React.PureComponent {
  static defaultProps = {
    data: List()
  };

  render() {
    const { props } = this;
    const { data } = props;

    return (
      <div className={cx('teams')}>
        <div className={cx('title')}>Team Starter</div>
        {data.map(d => {
          return (
            <div
              className={cx('team-info')}
              key={d.getIn(['account', 'email'])}
            >
              <div className={cx('team-owner')}>
                {d.getIn(['account', 'email']).split('@')[0] + "'s Team"}
              </div>
              <div className={cx('player-list')} key={d.get('_id')}>
                <TeamStarter data={d.get('arrangement') || Map()} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default TeamsInfo;
