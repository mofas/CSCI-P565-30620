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
  tdpass: 'Points per passing TD',
  passyds: 'Number of passing yards per point',
  tdrush: 'Points per rushing TD',
  rushyds: 'Number of rushing yards per point',
  tdrec: 'Points per receiving TD',
  recyds: 'Number of receiving yards per point',
  fgmade: 'Points per made field goal',
  fgmissed: 'Points per missed field goal',
  xpmade: 'Points per made extra point',
  int: 'Points per interception',
  intthrow: 'Points per interception thrown',
  fumlost: 'Points per fumble lost',
  sack: 'Points per sack',
  forcedfum: 'Points per forced fumble',
  kickblock: 'Points per kick blocked',
  puntblock: 'Points per punt blocked',
  saf: 'Points per safety',
  tdkickret: 'Points per kickoff return TD',
  tdpuntret: 'Points per punt return TD',
  tddef: 'Points per defensive TD',
  i20punt: 'Points per punt inside the 20',
  puntyds: 'Number of punting yards per point',
};

class CreateLeague extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: 'My League',
      limit: '2',
      open: false,
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
    const { name, limit, formula } = this.state;

    if (!name || name === '') {
      window.alert('Please give a league name');
      return;
    }

    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 2 || limitNum > 10 || limitNum % 2 != 0) {
      window.alert('Max Players must be an even number between 2 and 10');
      return;
    }
    const tdpass = parseInt(this.state.formula.get('tdpass'), 10);
    if (isNaN(tdpass) || tdpass < 0 || tdpass > 10) {
      window.alert('TD passes can be between 0 and 10 points');
      return;
    }
    const passyds = parseInt(this.state.formula.get('passyds'), 10);
    if (isNaN(passyds) || passyds < 1 || passyds > 100) {
      window.alert(
        'One point can be given for between 1 and 100 passing yards'
      );
      return;
    }
    const tdrush = parseInt(this.state.formula.get('tdrush'), 10);
    if (isNaN(tdrush) || tdrush < 0 || tdrush > 10) {
      window.alert('TD rushes can be between 0 and 10 points');
      return;
    }
    const rushyds = parseInt(this.state.formula.get('rushyds'), 10);
    if (isNaN(rushyds) || rushyds < 1 || rushyds > 100) {
      window.alert(
        'One point can be given for between 1 and 100 rushing yards'
      );
      return;
    }
    const tdrec = parseInt(this.state.formula.get('tdrec'), 10);
    if (isNaN(tdrec) || tdrec < 0 || tdrec > 10) {
      window.alert('TD receptions can be between 0 and 10 points');
      return;
    }
    const recyds = parseInt(this.state.formula.get('recyds'), 10);
    if (isNaN(recyds) || recyds < 1 || recyds > 100) {
      window.alert(
        'One point can be given for between 1 and 100 receiving yards'
      );
      return;
    }
    const fgmade = parseInt(this.state.formula.get('fgmade'), 10);
    if (isNaN(fgmade) || fgmade < 0 || fgmade > 10) {
      window.alert('Made field goals can be between 0 and 10 points');
      return;
    }
    const fgmissed = parseInt(this.state.formula.get('fgmissed'), 10);
    if (isNaN(fgmissed) || fgmissed > 0 || fgmissed < -10) {
      window.alert('Missed field goals can be between -10 and 0 points');
      return;
    }
    const xpmade = parseInt(this.state.formula.get('xpmade'), 10);
    if (isNaN(xpmade) || xpmade < 0 || xpmade > 5) {
      window.alert('Made extra points can be between 0 and 5 points');
      return;
    }
    const intthrow = parseInt(this.state.formula.get('intthrow'), 10);
    if (isNaN(intthrow) || intthrow > 0 || intthrow < -5) {
      window.alert('Thrown interceptions can be between -5 and 0 points');
      return;
    }
    const int = parseInt(this.state.formula.get('int'), 10);
    if (isNaN(int) || int < 0 || int > 5) {
      window.alert('Interceptions can be between 0 and 5 points');
      return;
    }
    const fumlost = parseInt(this.state.formula.get('fumlost'), 10);
    if (isNaN(fumlost) || fumlost > 0 || fumlost < -5) {
      window.alert('Fumbles lost can be between -5 and 0 points');
      return;
    }
    const sack = parseInt(this.state.formula.get('sack'), 10);
    if (isNaN(sack) || sack < 0 || sack > 5) {
      window.alert('Sacks can be between 0 and 3 points');
      return;
    }
    const forcedfum = parseInt(this.state.formula.get('forcedfum'), 10);
    if (isNaN(forcedfum) || forcedfum < 0 || forcedfum > 5) {
      window.alert('Forced fumbles can be between 0 and 5 points');
      return;
    }
    const kickblock = parseInt(this.state.formula.get('kickblock'), 10);
    if (isNaN(kickblock) || kickblock < 0 || kickblock > 5) {
      window.alert('Blocked kicks can be between 0 and 5 points');
      return;
    }
    const puntblock = parseInt(this.state.formula.get('puntblock'), 10);
    if (isNaN(puntblock) || puntblock < 0 || puntblock > 5) {
      window.alert('Blocked punts can be between 0 and 5 points');
      return;
    }
    const tdkickret = parseInt(this.state.formula.get('tdkickret'), 10);
    if (isNaN(tdkickret) || tdkickret < 0 || tdkickret > 10) {
      window.alert('Kickoff return TDs can be between 0 and 10 points');
      return;
    }
    const tdpuntret = parseInt(this.state.formula.get('tdpuntret'), 10);
    if (isNaN(tdpuntret) || tdpuntret < 0 || tdpuntret > 10) {
      window.alert('Punt return TDs can be between 0 and 10 points');
      return;
    }
    const saf = parseInt(this.state.formula.get('saf'), 10);
    if (isNaN(saf) || saf < 0 || saf > 5) {
      window.alert('Safeties can be between 0 and 5 points');
      return;
    }
    const tddef = parseInt(this.state.formula.get('tddef'), 10);
    if (isNaN(tddef) || tddef < 0 || tddef > 10) {
      window.alert('Defensive TDs can be between 0 and 10 points');
      return;
    }
    const i20punt = parseInt(this.state.formula.get('i20punt'), 10);
    if (isNaN(i20punt) || i20punt < 0 || i20punt > 3) {
      window.alert('Punts inside the 20 can be between 0 and 3 points');
      return;
    }
    const puntyds = parseInt(this.state.formula.get('puntyds'), 10);
    if (isNaN(puntyds) || puntyds < 1 || puntyds > 100) {
      window.alert(
        'One point can be given for between 1 and 100 punting yards'
      );
      return;
    }
    this.createLeague();
  };

  toggle() {
    this.setState({
      open: !this.state.open,
    });
  }

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
        <div className={cx('formula')}>
          <div onClick={() => this.toggle()}>
            <Btn>
              {' '}
              <b> Custom Formula </b>{' '}
            </Btn>
          </div>
          <div className={cx('fspace')}>
            {this.state.open &&
              formulaKey.map(key => {
                return (
                  <div className={cx('input-wrap')} key={key}>
                    <LabelInput
                      label={
                        formulaNameMapping[key] ? formulaNameMapping[key] : key
                      }
                      value={formula.get(key)}
                      onChange={this.changeFormula(key)}
                    />
                  </div>
                );
              })}
          </div>
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
