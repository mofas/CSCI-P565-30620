import React from 'react';
import { List, Map } from 'immutable';
import Btn from '../../common/Btn/Btn';
import LabelInput from '../../common/Input/LabelInput';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class LeagueItem extends React.PureComponent {
  static defaultProps = {
    createLeague: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      name: 'New League',
      limit: '2',
    };
  }

  changeName = e => {
    this.setState({ name: e.target.value });
  };

  changeLimit = e => {
    this.setState({ limit: e.target.value });
  };

  createLeague = () => {
    //validation
    const { name, limit } = this.state;

    if (!name || name === '') {
      window.alert('Please give name');
      return;
    }

    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 2 || limitNum > 10) {
      window.alert('Max Players must be a number between 2 and 10');
      return;
    }
    this.props.createLeague({ name, limit: limitNum });
  };

  render() {
    const { state, props } = this;
    const { name, limit } = state;
    return (
      <div className={cx('item')}>
        <div className={cx('name')}>Create New League</div>
        <div className={cx('input-wrap')}>
          <LabelInput
            label="League Name"
            value={name}
            onChange={this.changeName}
          />
        </div>
        <div className={cx('input-wrap')}>
          <LabelInput
            label="League Max Players"
            value={limit}
            onChange={this.changeLimit}
          />
        </div>
        <div className={cx('function-bar')} onClick={this.createLeague}>
          <Btn>Create</Btn>
        </div>
      </div>
    );
  }
}

export default LeagueItem;
