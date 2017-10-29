import React from 'react';
import { fromJS, List, Set } from 'immutable';

import Btn from '../../common/Btn/Btn';
import LabelInput from '../../common/Input/LabelInput';

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
  Kicking: ['K'],
});

class PlayerList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: List(),

      sortKey: '',
      sortDesc: true,
      keyword: '',
      selectPosition: '',
    };
  }

  toggleSelectPosition = d => {
    if (d === this.state.selectPosition) {
      this.setState({
        selectPosition: '',
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
          <div className={cx('position-selector')}>Filter Position</div>
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
              type={selectPosition === 'Kicking' ? 'secondary' : 'primary'}
              className={cx('position-btn')}
              onClick={() => this.toggleSelectPosition('Kicking')}
            >
              Kicking
            </Btn>
          </div>
        </div>

        <div className={cx('header', 'item')}>
          <div className={cx('info')}>
            <div className={cx('basic-info')}>
              <div className={cx('thumb-placeholder')} />
              <div className={cx('name')}>Name</div>
              <div className={cx('position')}>Position</div>
            </div>
          </div>
          <div className={cx('ability')}>
            <TableHeader
              headerKey="Passing_Yards"
              name="Passing Yds"
              sortKey={sortKey}
              sortDesc={sortDesc}
              onClick={() => this.setSortKey('Passing_Yards')}
            />
            <TableHeader
              headerKey="Rushing_Yards"
              name="Rushing Yds"
              sortKey={sortKey}
              sortDesc={sortDesc}
              onClick={() => this.setSortKey('Rushing_Yards')}
            />
            <TableHeader
              headerKey="Receiving_Yards"
              name="Receiving Yds"
              sortKey={sortKey}
              sortDesc={sortDesc}
              onClick={() => this.setSortKey('Receiving_Yards')}
            />
            <TableHeader
              headerKey="Passing_TDs"
              name="Passing Tds"
              sortKey={sortKey}
              sortDesc={sortDesc}
              onClick={() => this.setSortKey('Passing_TDs')}
            />
            <TableHeader
              headerKey="Rushing_TDs"
              name="Rushing Tds"
              sortKey={sortKey}
              sortDesc={sortDesc}
              onClick={() => this.setSortKey('Rushing_TDs')}
            />
            <TableHeader
              headerKey="Receiving_TD"
              name="Receiving Tds"
              sortKey={sortKey}
              sortDesc={sortDesc}
              onClick={() => this.setSortKey('Receiving_TD')}
            />
          </div>
        </div>
        {children(tableData)}
      </div>
    );
  }
}

export default PlayerList;
