import React from 'react';

import { Link } from 'react-router-dom';

import { Row, Col } from '../../common/Table/Index';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class PlayerItem extends React.PureComponent {
  render() {
    const { props } = this;
    const { data, selectPosition } = props;
    return (
      <Row className={cx('player-item')}>
        <div
          className={cx('team-bg')}
          style={{
            background: `url(http://i.nflcdn.com/static/site/7.5/img/subheaders/${(
              data.get('Team') || ''
            ).toLowerCase()}.png) no-repeat 50% 50%`,
          }}
        />
        <Col className={cx('name')}>
          <Link to={`/app/player/detail/${data.get('_id')}`}>
            {data.get('Name')}
          </Link>
        </Col>
        <Col className={cx('position')}>{data.get('Position')}</Col>
        {selectPosition === 'Offense' ? (
          <Col>{data.get('Passing_Yards')}</Col>
        ) : null}
        {selectPosition === 'Offense' ? (
          <Col>{data.get('Rushing_Yards')}</Col>
        ) : null}
        {selectPosition === 'Offense' ? (
          <Col>{data.get('Receiving_Yards')}</Col>
        ) : null}
        {selectPosition === 'Offense' ? (
          <Col>{data.get('Passing_TDs')}</Col>
        ) : null}
        {selectPosition === 'Offense' ? (
          <Col>{data.get('Rushing_TDs')}</Col>
        ) : null}
        {selectPosition === 'Offense' ? (
          <Col>{data.get('Receiving_TD')}</Col>
        ) : null}
        {selectPosition === 'Offense' ? (
          <Col>{data.get('Interceptions_Thrown')}</Col>
        ) : null}
        {selectPosition === 'Defense' ? (
          <Col>{data.get('Interceptions')}</Col>
        ) : null}
        {selectPosition === 'Defense' ? (
          <Col>{data.get('Forced_Fumbles')}</Col>
        ) : null}
        {selectPosition === 'Defense' ? <Col>{data.get('Sacks')}</Col> : null}
        {selectPosition === 'Defense' ? (
          <Col>{data.get('Blocked_Kicks')}</Col>
        ) : null}
        {selectPosition === 'Defense' ? (
          <Col>{data.get('Blocked_Punts')}</Col>
        ) : null}
        {selectPosition === 'Defense' ? (
          <Col>{data.get('Safeties')}</Col>
        ) : null}
        {selectPosition === 'Offense' ? (
          <Col>{data.get('Kickoff_Return_TD')}</Col>
        ) : null}
        {selectPosition === 'Offense' ? (
          <Col>{data.get('Punt_Return_TD')}</Col>
        ) : null}
        {selectPosition === 'Defense' ? (
          <Col>{data.get('Defensive_TD')}</Col>
        ) : null}
        {selectPosition === 'Special' ? (
          <Col>{data.get('Extra_Points_Made')}</Col>
        ) : null}
        {selectPosition === 'Special' ? <Col>{data.get('FG_Made')}</Col> : null}
        {selectPosition === 'Special' ? (
          <Col>{data.get('FG_Missed')}</Col>
        ) : null}
        {selectPosition === 'Special' ? (
          <Col>{data.get('Punting_i20')}</Col>
        ) : null}
        {selectPosition === 'Special' ? (
          <Col>{data.get('Punting_Yards')}</Col>
        ) : null}
      </Row>
    );
  }
}

export default PlayerItem;
