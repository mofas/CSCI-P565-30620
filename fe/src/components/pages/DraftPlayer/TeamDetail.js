import React from 'react';
import { List, Map, Range } from 'immutable';
import { Table, Thead, Tbody, Row, Col } from '../../common/Table/Index';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class TeamDetail extends React.PureComponent {
  static defaultProps = {
    data: null,
    poolPlayerWithUser: List(),
    selectedUserIndex: () => {},
  };

  render() {
    const { props } = this;
    const { data, poolPlayerWithUser, selectedUserIndex } = props;

    return (
      <div className={cx('team-detail')}>
        <select onChange={selectedUserIndex} className={cx('selector')}>
          {poolPlayerWithUser.count() > 0 &&
            poolPlayerWithUser.map((d, i) => {
              return (
                <option key={i} value={i}>
                  {d.getIn(['account', 'email'])}
                </option>
              );
            })}
        </select>
        <div>
          {data ? (
            <Table>
              <Thead>
                <Row>
                  <Col> Player {data.getIn(['account', 'email'])} </Col>
                </Row>
                <Row>
                  <Col>Player Name</Col>
                  <Col>Position</Col>
                </Row>
              </Thead>
              <Tbody>
                {data.get('players').map((d, index) => {
                  return (
                    <Row key={index}>
                      <Col>{d.get('Name')}</Col>
                      <Col>{d.get('Position')}</Col>
                    </Row>
                  );
                })}
              </Tbody>
            </Table>
          ) : null}
        </div>
      </div>
    );
  }
}

export default TeamDetail;
