import React from 'react';
import { fromJS, List, Map, Set } from 'immutable';

import Btn from '../../common/Btn/Btn';
import { Table, Thead, Tbody, Row, Col } from '../../common/Table/Index';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class InTeamPlaterList extends React.PureComponent {
  static defaultProps = {
    players: List(),
    handleReleasePlayer: () => () => {}
  };

  render() {
    const { props } = this;
    const { players, arrangement, handleReleasePlayer } = props;

    const inPosition = arrangement.filter(d => d).reduce((acc, key) => {
      return acc.add(key.get('_id'));
    }, Set());

    return (
      <Table>
        <Thead>
          <Row>
            <Col>Name</Col>
            <Col>Position</Col>
            <Col>Action</Col>
          </Row>
        </Thead>
        <Tbody>
          {players.map((d, i) => {
            return (
              <Row key={d.get('_id')}>
                <Col>{d.get('Name')}</Col>
                <Col>{d.get('Position')}</Col>
                <Col>
                  {!inPosition.has(d.get('_id')) ? (
                    <Btn onClick={() => handleReleasePlayer(d.get('_id'))}>
                      Release Player
                    </Btn>
                  ) : (
                    <Btn disabled>Release Player</Btn>
                  )}
                </Col>
              </Row>
            );
          })}
        </Tbody>
      </Table>
    );
  }
}

export default InTeamPlaterList;
