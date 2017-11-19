import React from 'react';
import { fromJS, List, Set } from 'immutable';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import API from '../../../middleware/API';

import Btn from '../../common/Btn/Btn';
import CreateIcon from '../../common/Icon/Create';

import Item from './Item';
import Spinner from '../../common/Spinner/Spinner';

import { validateEmail } from '../../../util';

import { Table, Thead, Tbody, Row, Col } from '../../common/Table/Index';

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
    const receiver = window.prompt("Please input your friend's email");
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
        <Link to={'/app/league/create'} style={{ display: 'inline-block' }}>
          <Btn type="secondary">
            <CreateIcon className="icon" />
            Create New League
          </Btn>
        </Link>
        <div className={cx('list-wrap')}>
          <Table>
            <Thead>
              <Row>
                <Col className={cx('name-col', 'text-left')}>Name</Col>
                <Col className={cx('pa-col', 'text-left')}>Particpants</Col>
                <Col className={cx('creator-col')}>Creator</Col>
                <Col className={cx('time-col')}>Created at</Col>
                <Col className={cx('count-col')}>Capacity</Col>
                <Col className={cx('stage-col')}>Stage</Col>
                <Col className={cx('action-col')}>Action</Col>
              </Row>
            </Thead>
            <Tbody>
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
            </Tbody>
          </Table>
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
