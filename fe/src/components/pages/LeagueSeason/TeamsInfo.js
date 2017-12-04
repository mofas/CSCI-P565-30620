import React from 'react';
import { fromJS, List, Map, Set } from 'immutable';
import { Table, Thead, Tbody, Row, Col } from '../../common/Table/Index';

import Btn from '../../common/Btn/Btn';
import TeamStarter from './TeamStarter';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class TeamsInfo extends React.PureComponent {
  static defaultProps = {
    data: List(),
  };

  render() {
    const { props } = this;
    const { data } = props;

    return (
      <div className={cx('teams-info')}>
        <Table>
          <Thead>
            <Row>
              <Col>Team Starter</Col>
            </Row>
            <Row>
              <Col className={cx('name')}>Name</Col>
              <Col className={cx('position')}>Position</Col>
            </Row>
          </Thead>
          {data.map((d, i) => {
            return (
              <div key={i}>
                <Row>
                  <Col>
                    {(d.getIn(['account', 'email']) || '').split('@')[0] +
                      "'s Team"}
                  </Col>
                </Row>
                <TeamStarter data={d.get('arrangement') || Map()} />
              </div>
            );
          })}
        </Table>
      </div>
    );
  }
}

export default TeamsInfo;
