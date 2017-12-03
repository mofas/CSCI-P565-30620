import React from 'react';
import { fromJS, List, Set } from 'immutable';

import Btn from '../../common/Btn/Btn';
import LabelInput from '../../common/Input/LabelInput';

import { Table, Thead, Tbody, Row, Col } from '../../common/Table/Index';
import TableHeader from './TableHeader';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

const PositionMapping = fromJS({
  Offense: ['QB', 'TE', 'WR', 'RB', 'HB', 'FB'],
  Defense: [
    'CB',
    'DB',
    'DT',
    'NT',
    'DE',
    'LB',
    'OLB',
    'ILB',
    'MLB',
    'FS',
    'SS',
    'DEF',
    'SAF',
    'DL',
  ],
  Special: ['K', 'P'],
});

class PlayerList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: List(),

      sortKey: '',
      sortDesc: true,
      keyword: '',
      selectPosition: 'Offense',
      extraCol: null,
    };
  }

  toggleSelectPosition = d => {
    if (d === this.state.selectPosition) {
      this.setState({
        selectPosition: this.state.selectPosition,
      });
    } else {
      this.setState({
        selectPosition: d,
      });
    }
  };

  changeKeyword = e => {
    this.setState({
      keyword: e.target.value,
    });
  };

  setSortKey = key => {
    if (key === this.state.sortKey) {
      if (this.state.sortDesc === false) {
        this.setState({
          sortKey: '',
          sortDesc: true,
        });
      } else {
        this.setState({
          sortKey: key,
          sortDesc: false,
        });
      }
    } else {
      this.setState({
        sortKey: key,
        sortDesc: true,
      });
    }
  };

  render() {
    const { state, props } = this;
    const { data, children } = props;
    const { selectPosition, keyword, sortKey, sortDesc } = state;

    let tableData = data;

    if (keyword && keyword.length > 0) {
      tableData = tableData.filter(d => {
        return d
          .get('Name')
          .toLowerCase()
          .includes(keyword.toLowerCase());
      });
    }

    if (selectPosition) {
      const filterPositions = PositionMapping.get(selectPosition);
      tableData = tableData.filter(d => {
        return filterPositions.includes(d.get('Position'));
      });
    }

    if (sortKey && sortKey.length > 0) {
      tableData = tableData.sort((a, b) => {
        let ret = b.get(sortKey) - a.get(sortKey);
        if (!sortDesc) {
          return -1 * ret;
        } else {
          return ret;
        }
      });
    }

    return (
      <div>
        <div className={cx('search-bar')}>
          <LabelInput
            label="Search by Name"
            type="text"
            value={keyword}
            onChange={this.changeKeyword}
          />
        </div>
        <div className={cx('position-filter')}>
          <div className={cx('position-btn-wrap')}>
            <Btn
              type={selectPosition === 'Offense' ? 'secondary' : 'primary'}
              className={cx('position-btn')}
              onClick={() => this.toggleSelectPosition('Offense')}
            >
              Offense
            </Btn>
            <Btn
              type={selectPosition === 'Defense' ? 'secondary' : 'primary'}
              className={cx('position-btn')}
              onClick={() => this.toggleSelectPosition('Defense')}
            >
              Defense
            </Btn>
            <Btn
              type={selectPosition === 'Special' ? 'secondary' : 'primary'}
              className={cx('position-btn')}
              onClick={() => this.toggleSelectPosition('Special')}
            >
              Special
            </Btn>
          </div>
        </div>
        <Table>
          <Thead>
            <Row>
              <Col className={cx('name')}>Name</Col>
              <Col className={cx('position')}>Position</Col>
              {selectPosition === 'Offense' ? (
                <TableHeader
                  headerKey="Passing_Yards"
                  name="Passing Yds"
                  sortKey={sortKey}
                  sortDesc={sortDesc}
                  onClick={() => this.setSortKey('Passing_Yards')}
                />
              ) : null}
              {selectPosition === 'Offense' ? (
                <TableHeader
                  headerKey="Rushing_Yards"
                  name="Rushing Yds"
                  sortKey={sortKey}
                  sortDesc={sortDesc}
                  onClick={() => this.setSortKey('Rushing_Yards')}
                />
              ) : null}
              {selectPosition === 'Offense' ? (
                <TableHeader
                  headerKey="Receiving_Yards"
                  name="Receiving Yds"
                  sortKey={sortKey}
                  sortDesc={sortDesc}
                  onClick={() => this.setSortKey('Receiving_Yards')}
                />
              ) : null}
              {selectPosition === 'Offense' ? (
                <TableHeader
                  headerKey="Passing_TDs"
                  name="Passing Tds"
                  sortKey={sortKey}
                  sortDesc={sortDesc}
                  onClick={() => this.setSortKey('Passing_TDs')}
                />
              ) : null}
              {selectPosition === 'Offense' ? (
                <TableHeader
                  headerKey="Rushing_TDs"
                  name="Rushing Tds"
                  sortKey={sortKey}
                  sortDesc={sortDesc}
                  onClick={() => this.setSortKey('Rushing_TDs')}
                />
              ) : null}
              {selectPosition === 'Offense' ? (
                <TableHeader
                  headerKey="Receiving_TD"
                  name="Receiving Tds"
                  sortKey={sortKey}
                  sortDesc={sortDesc}
                  onClick={() => this.setSortKey('Receiving_TD')}
                />
              ) : null}
              {selectPosition === 'Offense' ? (
                <TableHeader
                  headerKey="Interceptions_Thrown"
                  name="Interceptions Thrown"
                  sortKey={sortKey}
                  sortDesc={sortDesc}
                  onClick={() => this.setSortKey('Interceptions_Thrown')}
                />
              ) : null}
              {selectPosition === 'Defense' ? (
                <TableHeader
                  headerKey="Interceptions"
                  name="Interceptions"
                  sortKey={sortKey}
                  sortDesc={sortDesc}
                  onClick={() => this.setSortKey('Interceptions')}
                />
              ) : null}
              {selectPosition === 'Defense' ? (
                <TableHeader
                  headerKey="Forced_Fumbles"
                  name="Forced Fumbles"
                  sortKey={sortKey}
                  sortDesc={sortDesc}
                  onClick={() => this.setSortKey('Forced_Fumbles')}
                />
              ) : null}
              {selectPosition === 'Defense' ? (
                <TableHeader
                  headerKey="Sacks"
                  name="Sacks"
                  sortKey={sortKey}
                  sortDesc={sortDesc}
                  onClick={() => this.setSortKey('Sacks')}
                />
              ) : null}
              {selectPosition === 'Defense' ? (
                <TableHeader
                  headerKey="Blocked_Kicks"
                  name="Blocked Kicks"
                  sortKey={sortKey}
                  sortDesc={sortDesc}
                  onClick={() => this.setSortKey('Blocked_Kicks')}
                />
              ) : null}
              {selectPosition === 'Defense' ? (
                <TableHeader
                  headerKey="Blocked_Punts"
                  name="Blocked Punts"
                  sortKey={sortKey}
                  sortDesc={sortDesc}
                  onClick={() => this.setSortKey('Blocked_Punts')}
                />
              ) : null}
              {selectPosition === 'Defense' ? (
                <TableHeader
                  headerKey="Safeties"
                  name="Safeties"
                  sortKey={sortKey}
                  sortDesc={sortDesc}
                  onClick={() => this.setSortKey('Safeties')}
                />
              ) : null}
              {selectPosition === 'Offense' ? (
                <TableHeader
                  headerKey="Kickoff_Return_TD"
                  name="Kickoff Return Tds"
                  sortKey={sortKey}
                  sortDesc={sortDesc}
                  onClick={() => this.setSortKey('Kickoff_Return_TD')}
                />
              ) : null}
              {selectPosition === 'Offense' ? (
                <TableHeader
                  headerKey="Punt_Return_TD"
                  name="Punt Return Tds"
                  sortKey={sortKey}
                  sortDesc={sortDesc}
                  onClick={() => this.setSortKey('Punt_Return_TD')}
                />
              ) : null}
              {selectPosition === 'Defense' ? (
                <TableHeader
                  headerKey="Defensive_TD"
                  name="Defensive Tds"
                  sortKey={sortKey}
                  sortDesc={sortDesc}
                  onClick={() => this.setSortKey('Defensive_TD')}
                />
              ) : null}
              {selectPosition === 'Special' ? (
                <TableHeader
                  headerKey="Extra_Points_Made"
                  name="Extra Points"
                  sortKey={sortKey}
                  sortDesc={sortDesc}
                  onClick={() => this.setSortKey('Extra_Points_Made')}
                />
              ) : null}
              {selectPosition === 'Special' ? (
                <TableHeader
                  headerKey="FG_Made"
                  name="Made Field Goals"
                  sortKey={sortKey}
                  sortDesc={sortDesc}
                  onClick={() => this.setSortKey('FG_Made')}
                />
              ) : null}
              {selectPosition === 'Special' ? (
                <TableHeader
                  headerKey="FG_Missed"
                  name="Missed Field Goals"
                  sortKey={sortKey}
                  sortDesc={sortDesc}
                  onClick={() => this.setSortKey('FG_Missed')}
                />
              ) : null}
              {selectPosition === 'Special' ? (
                <TableHeader
                  headerKey="Punting_i20"
                  name="Punts Inside 20"
                  sortKey={sortKey}
                  sortDesc={sortDesc}
                  onClick={() => this.setSortKey('Punting_i20')}
                />
              ) : null}
              {selectPosition === 'Special' ? (
                <TableHeader
                  headerKey="Punting_Yards"
                  name="Punting Yards"
                  sortKey={sortKey}
                  sortDesc={sortDesc}
                  onClick={() => this.setSortKey('Punting_Yards')}
                />
              ) : null}
              {this.props.extraCol}
            </Row>
          </Thead>
          {children(tableData, selectPosition)}
        </Table>
      </div>
    );
  }
}

export default PlayerList;
