import React from 'react';
import { fromJS, List, Set } from 'immutable';
import { connect } from 'react-redux';

import API from '../../../middleware/API';

import Btn from '../../common/Btn/Btn';
import LabelInput from '../../common/Input/LabelInput';
import Spinner from '../../common/Spinner/Spinner';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class CreateLeague extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: 'My League',
      limit: '2',
    };
  }

  createLeague = ({ name, limit }) => {
    this.setState({
      loading: true,
    });

    const mutation = `
        mutation{
          CreateLeague(data: {name: "${name}", limit: ${limit} }){
            _id
          }
        }
      `;

    API.GraphQL(mutation).then(res => {
      if (res.data.CreateLeague._id) {
        window.location.href = '#/app/league/list';
      } else {
        window.alert(res);
        this.setState({
          loading: false,
        });
      }
    });
  };

  changeName = e => {
    this.setState({ name: e.target.value });
  };

  changeLimit = e => {
    this.setState({ limit: e.target.value });
  };

  handleCreateLeague = () => {
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
    this.createLeague({ name, limit: limitNum });
  };

  render() {
    const { state, props } = this;
    const { name, limit } = state;
    return (
      <div className={cx('root')}>
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
        <div className={cx('input-wrap')}>
          <LabelInput label="Formular Param 1" disabled />
        </div>
        <div className={cx('function-bar')} onClick={this.handleCreateLeague}>
          <Btn>Create</Btn>
        </div>
      </div>
    );
  }
}

export default connect(stores => {
  return {
    accountStore: stores.account,
  };
})(CreateLeague);