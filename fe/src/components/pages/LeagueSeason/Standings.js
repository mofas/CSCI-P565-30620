import React from 'react';
import { fromJS, List, Map, Set } from 'immutable';
import { Table, Thead, Tbody, Row, Col } from '../../common/Table/Index';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class Standings extends React.PureComponent {
  static defaultProps = {
    data: List(),
    gameWeek: 1,
  };

  render() {
    const { props } = this;
    const { data, gameWeek } = props;

    return (
      <div className={cx('standings')}>
        <Table>
          <Thead>
            <Row>
              <Col> Standing : Week {gameWeek - 1} </Col>
            </Row>
            <Row>
              <Col>Team</Col>
              <Col className={cx('win')}> Wins </Col>
              <Col className={cx('lose')}> Lose </Col>
            </Row>
          </Thead>
          <Tbody>
            {data.map((d, i) => {
              return (
                <Row key={i}>
                  <Col className={cx('team')}>
                    {(d.getIn(['account', 'email']) || '').split('@')[0] +
                      "'s Team"}
                  </Col>
                  <Col className={cx('win')}>{d.getIn(['win']) || 0}</Col>
                  <Col className={cx('lose')}>{d.getIn(['lose']) || 0}</Col>
                </Row>
              );
            })}
          </Tbody>
        </Table>
      </div>
    );
  }
}

export default Standings;
