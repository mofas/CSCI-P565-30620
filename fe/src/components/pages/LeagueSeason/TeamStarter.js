import React from 'react';
import { fromJS, List, Map, Set } from 'immutable';

import { Table, Thead, Tbody, Row, Col } from '../../common/Table/Index';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

const positionList = [
  'position_qb_0',
  'position_rb_0',
  'position_wr_0',
  'position_wr_1',
  'position_te_0',
  'position_k_0',
  'position_p_0',
  'position_defense_0',
  'position_defense_1',
  'position_defense_2',
  'position_defense_3',
  'position_defense_4'
];

const positionMapping = {
  position_qb_0: 'QB',
  position_rb_0: 'RB',
  position_wr_0: 'WR',
  position_wr_1: 'WR',
  position_te_0: 'TE',
  position_k_0: 'K',
  position_p_0: 'P',
  position_defense_0: 'DEF',
  position_defense_1: 'DEF',
  position_defense_2: 'DEF',
  position_defense_3: 'DEF',
  position_defense_4: 'DEF'
};

class TeamsStarter extends React.PureComponent {
  static defaultProps = {
    data: Map()
  };

  render() {
    const { props } = this;
    const { data } = props;

    console.log(data.toJS());
    return (
      <Table>
        <Thead>
          <Row>
            <Col className={cx('name')}>Name</Col>
            <Col className={cx('position')}>Position</Col>
          </Row>
        </Thead>
        <Tbody>
          {positionList.map(d => {
            return (
              <Row key={d}>
                <Col className={cx('name')}>
                  {data.getIn([d, 'Name']) || 'NA'}
                </Col>
                <Col className={cx('position')}>
                  {data.getIn([d, 'Position']) || positionMapping[d]}
                </Col>
              </Row>
            );
          })}
        </Tbody>
      </Table>
    );
  }
}

export default TeamsStarter;
