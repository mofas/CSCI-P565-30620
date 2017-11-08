import React from 'react';
import { fromJS, List, Set } from 'immutable';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import API from '../../../middleware/API';

import Btn from '../../common/Btn/Btn';
import Item from './Item';
import Spinner from '../../common/Spinner/Spinner';

import { validateEmail } from '../../../util';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class LeagueList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      leagues: List([]),
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const query = `
      {
        ListLeague{
          _id
          name
          stage
          draft_run
          limit
          creator {
            _id
            email
          }
          create_time
          accounts {
            email
          }
        }
      }
    `;

    this.setState({
      loading: true,
    });

    API.GraphQL(query).then(res => {
      const leagues = fromJS(res.data.ListLeague);
      this.setState({
        loading: false,
        leagues,
      });
    });
  };

  joinLeague = id => {
    this.setState({
      loading: true,
    });

    const mutation = `
      mutation{
        JoinLeague(_id: "${id}"){
          _id
        }
      }
    `;

    API.GraphQL(mutation).then(res => {
      if (res.data.JoinLeague._id) {
        this.loadData();
      } else {
        window.alert(res);
        this.setState({
          loading: false,
        });
      }
    });
  };

  deleteLeague = id => {
    this.setState({
      loading: true,
    });

    const mutation = `
      mutation{
        DeleteLeague(_id: "${id}"){
          success
          error
        }
      }
    `;
    API.GraphQL(mutation).then(res => {
      if (res.data.DeleteLeague.success) {
        this.loadData();
      } else {
        window.alert(res);
        this.setState({
          loading: false,
        });
      }
    });
  };

  inviteFriend = (leagueID, leagueName) => {
    // league/invitation
    const receiver = window.prompt('please input your frined email');
    if (!validateEmail(receiver)) {
      window.alert('Email is not valid');
      return;
    }

    API.API((request, endpoint) => {
      return request
        .post(`${endpoint}/league/invitation`)
        .type('form')
        .send({
          leagueName,
          inviter: this.props.accountStore.getIn(['userInfo', 'email']),
          receiver,
        });
    }).then(res => {
      alert(res.message);
    });
  };

  render() {
    const { state, props } = this;
    const { accountStore } = props;
    const { loading, leagues } = state;
    return (
      <div className={cx('root')}>
        <Spinner show={loading} />
        <Link
          to={'/app/league/create'}
          style={{ width: 200, display: 'block' }}
        >
          <Btn type="secondary">Create New League</Btn>
        </Link>
        <div className={cx('list-wrap')}>
          <div className={cx('pseudo-table')}>
            <div className={cx('pseudo-thead')}>
              <div className={cx('pseudo-row')}>
                <div className={cx('pseudo-col', 'name-col', 'text-left')}>
                  Name
                </div>
                <div className={cx('pseudo-col', 'pa-col', 'text-left')}>
                  Particpants
                </div>
                <div className={cx('pseudo-col', 'creator-col')}>Creator</div>
                <div className={cx('pseudo-col', 'time-col')}>Created at</div>
                <div className={cx('pseudo-col', 'count-col')}>Capacity</div>
                <div className={cx('pseudo-col', 'stage-col')}>Stage</div>
                <div className={cx('pseudo-col', 'action-col')}>Action</div>
              </div>
            </div>
            <div className={cx('pseudo-tbody')}>
              {leagues.map(d => {
                return (
                  <Item
                    key={d.get('_id')}
                    userInfo={accountStore.get('userInfo')}
                    joinLeague={this.joinLeague}
                    deleteLeague={this.deleteLeague}
                    inviteFriend={this.inviteFriend}
                    data={d}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(stores => {
  return {
    accountStore: stores.account,
  };
})(LeagueList);
