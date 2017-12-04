import React from 'react';
import { List, Map, Range } from 'immutable';
import { Table, Thead, Tbody, Row, Col } from '../../common/Table/Index';

import CountDown from './CountDown';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class TeamsInfo extends React.PureComponent {
  static defaultProps = {
    leagueData: Map(),
    data: List(),
    reload: () => {},
  };

  render() {
    const { props } = this;
    const { leagueData, reload } = props;

    const draft_run = leagueData.get('draft_run') || 0;
    const userList = (leagueData.get('accounts') || List()).map(d =>
      d.get('email')
    );

    const userListCount = userList.count();

    return (
      <div className={cx('sequence')}>
        {/*
        <img
          className={cx('watermark')}
          src="https://upload.wikimedia.org/wikipedia/en/thumb/8/80/NFL_Draft_logo.svg/806px-NFL_Draft_logo.svg.png"
        />
        */}
        <CountDown
          timeout={leagueData.get('timeout') * 60}
          lastPickTime={leagueData.get('lastPickTime')}
          reload={reload}
        />
        <Table>
          <Thead>
            <Row>
              <Col className={cx('round')}>Round</Col>
              {userList.map((_, i) => (
                <Col className={cx('user')} key={i}>
                  No. {i + 1} Picker
                </Col>
              ))}
            </Row>
          </Thead>
          {Range(0, 20).map(i => {
            let seqUserList = i % 2 === 1 ? userList : userList.reverse();
            return (
              <Row key={i}>
                <Col className={cx('round')}>{i + 1}</Col>
                {seqUserList.map((d, j) => {
                  const pickerNo = userListCount * i + j;
                  const statusCx =
                    pickerNo < draft_run
                      ? 'pass'
                      : pickerNo === draft_run ? 'now' : 'coming';

                  return (
                    <Col className={cx(['user', statusCx])} key={j}>
                      {d}
                    </Col>
                  );
                })}
              </Row>
            );
          })}
        </Table>
      </div>
    );
  }
}

export default TeamsInfo;
