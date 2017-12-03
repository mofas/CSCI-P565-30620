import React from 'react';
import { fromJS, List, Map, Set } from 'immutable';
import { Table, Thead, Tbody, Row, Col } from '../../common/Table/Index';

import Btn from '../../common/Btn/Btn';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class TeamsInfo extends React.PureComponent {
  static defaultProps = {
    leagueData: Map(),
    selectionOrder: Map(),
    data: List(),
  };

  render() {
    const { props } = this;
    const { leagueData, selectionOrder } = props;

    return (
      <div className={cx('sequence')}>
        <img
          className={cx('watermark')}
          src="https://upload.wikimedia.org/wikipedia/en/thumb/8/80/NFL_Draft_logo.svg/806px-NFL_Draft_logo.svg.png"
        />
        <div> Run-no {leagueData.get('draft_run') + 1} </div>
        <div>
          Round:
          {Math.floor(leagueData.get('draft_run') / leagueData.get('limit')) +
            1}
        </div>

        <div>
          {selectionOrder.length > 0 &&
            selectionOrder.map((d, index) => {
              return index < 7 ? (
                index === 0 ? (
                  <div
                    key={index}
                    className={cx('component', 'thick')}
                    onClick={this.toggleModal}
                  >
                    {index + 1}:{d['email'].split('@')[0]}
                  </div>
                ) : (
                  <div key={index} className={cx('component')}>
                    {index + 1}:{d['email'].split('@')[0]}
                  </div>
                )
              ) : null;
            })}
        </div>
      </div>
    );
  }
}

export default TeamsInfo;
