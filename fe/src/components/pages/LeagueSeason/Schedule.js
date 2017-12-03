import React from 'react';
import { fromJS, List, Map, Set } from 'immutable';
import { Table, Thead, Tbody, Row, Col } from '../../common/Table/Index';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class Schedule extends React.PureComponent {
  static defaultProps = {
    data: List(),
    gameWeek: 1,
  };

  render() {
    const { props } = this;
    const { data, gameWeek } = props;

    return (
      <Table className={cx('schedule')}>
        <Thead>
          <Row>
            <Col>Game Schedule</Col>
          </Row>
          <Row>
            <Col>Week No</Col>
            <Col>first_team</Col>
            <Col>second_team </Col>
          </Row>
        </Thead>
        <Tbody>
          {data.map((d, i) => {
            return d.get('week_no') === gameWeek ||
              d.get('week_no') === gameWeek + 1 ? (
              <Row key={i}>
                <Col>{d.get('week_no')}</Col>
                <Col>{d.getIn(['first_team', 'email'])}</Col>
                <Col>{d.getIn(['second_team', 'email'])}</Col>
              </Row>
            ) : null;
          })}
        </Tbody>
      </Table>
    );
  }
}

export default Schedule;
