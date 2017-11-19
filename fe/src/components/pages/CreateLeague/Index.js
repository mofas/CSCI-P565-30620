import React from 'react';
import { fromJS, List, Set, Map } from 'immutable';
import { connect } from 'react-redux';

import API from '../../../middleware/API';

import Btn from '../../common/Btn/Btn';
import LabelInput from '../../common/Input/LabelInput';
import Spinner from '../../common/Spinner/Spinner';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

const formulaKey = [
  'tdpass',
  'passyds',
  'tdrush',
  'rushyds',
  'tdrec',
  'recyds',
  'fgmade',
  'fgmissed',
  'xpmade',
  'int',
  'intthrow',
  'fumlost',
  'sack',
  'forcedfum',
  'kickblock',
  'puntblock',
  'saf',
  'tdkickret',
  'tdpuntret',
  'tddef',
  'i20punt',
  'puntyds',
];

// we can define better name for inut field
const formulaNameMapping = {
  tdpass: 'TD Passing',
};

class CreateLeague extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: 'My League',
      limit: '2',
      formula: Map({
        tdpass: 4,
        passyds: 25,
        tdrush: 6,
        rushyds: 10,
        recyds: 10,
        tdrec: 6,
        fgmade: 3,
        fgmissed: -1,
        xpmade: 1,
        intthrow: -2,
        int: 2,
        fumlost: -2,
        sack: 1,
        forcedfum: 2,
        kickblock: 2,
        puntblock: 2,
        tdkickret: 6,
        saf: 2,
        tdpuntret: 6,
        tddef: 6,
        i20punt: 1,
        puntyds: 50,
      }),
    };
  }

  updateLeagueTime = () => {};

  createLeague = () => {
    const { name, limit, formula } = this.state;

    this.setState({
      loading: true,
    });

    const epoc_date = Math.round(new Date().getTime() / 1000.0); // pass date from draft page

    const variables = {
      data: {
        name,
        limit,
        epoc_date,
        formula: formula.toJS(),
      },
    };

    const mutation = `
        mutation($data: LeagueInputType){
          CreateLeague(data: $data){
            _id

          }
        }
      `;

    API.GraphQL(mutation, variables).then(res => {
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

  changeFormula = key => e => {
    this.setState({
      formula: this.state.formula.updateIn([key], () => e.target.value),
    });
  };

  handleCreateLeague = () => {
    const { name, limit } = this.state;

    if (!name || name === '') {
      window.alert('Please give a league name');
      return;
    }

    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 2 || limitNum > 10) {
      window.alert('Max Players must be a number between 2 and 10');
      return;
    }

    const tdpass = parseInt(formula.get('tdpass'), 10);
    if (isNaN(tdpass) || tdpass < 0 || tdpass > 10) {
      window.alert('tdpass must be a number between 0 and 10');
      return;
    }
    this.createLeague();
  };

  render() {
    const { state, props } = this;
    const { name, limit, formula } = state;
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
        {formulaKey.map(key => {
          return (
            <div className={cx('input-wrap')} key={key}>
              <LabelInput
                label={formulaNameMapping[key] ? formulaNameMapping[key] : key}
                value={formula.get(key)}
                onChange={this.changeFormula(key)}
              />
            </div>
          );
        })}
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
