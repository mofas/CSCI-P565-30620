import React from 'react';
import { fromJS, List, Set } from 'immutable';

import API from '../../../middleware/API';

import Spinner from '../../common/Spinner/Spinner';

import Btn from '../../common/Btn/Btn';
import LabelInput from '../../common/Input/LabelInput';

import TableHeader from './TableHeader';
import Item from './Item';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class PlayerList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      sortKey: '',
      sortDesc: true,
      keyword: '',
      selectPosition: '',
      players: List([]),
      allPosition: List([]),
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

  componentDidMount() {
    const query = `
      {
        ListPlayer{
          _id
          Name
          Position
          Team
          Passing_Yards
          Rushing_Yards
          Receiving_Yards
          Passing_TDs
          Rushing_TDs
          Receiving_TD
          FG_Made
          FG_Missed
          Extra_Points_Made
          Interceptions
          Fumbles_Lost
        }
      }
    `;

    this.setState({
      loading: true,
    });

    API.GraphQL(query).then(res => {
      // console.log('cool!', res);
      const players = fromJS(res.data.ListPlayer);
      const allPosition = players.reduce((acc, d) => {
        if (d.get('Position') !== '') {
          return acc.add(d.get('Position'));
        }
        return acc;
      }, Set());
      this.setState({
        loading: false,
        players: players,
        allPosition: allPosition.toList(),
      });
    });
  }

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
    const {
      loading,
      selectPosition,
      keyword,
      sortKey,
      sortDesc,
      players,
      allPosition,
    } = state;

    let tableData = players;

    if (keyword && keyword.length > 0) {
      tableData = tableData.filter(d => {
        return d
          .get('Name')
          .toLowerCase()
          .includes(keyword.toLowerCase());
      });
    }

    if (selectPosition && selectPosition.length > 0) {
      tableData = tableData.filter(d => {
        return d.get('Position') === selectPosition;
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
      <div className={cx('root')}>
        <Spinner show={loading} />
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
            {allPosition.map(d => {
              return (
                <Btn
                  key={d}
                  type={selectPosition === d ? 'secondary' : 'primary'}
                  className={cx('position-btn')}
                  onClick={() => this.toggleSelectPosition(d)}
                >
                  {d}
                </Btn>
              );
            })}
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
        {tableData.map(d => {
          return <Item key={d.get('_id')} data={d} />;
        })}
      </div>
    );
  }
}

export default PlayerList;
