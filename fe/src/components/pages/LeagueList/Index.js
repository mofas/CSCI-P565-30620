import React from 'react';
import { fromJS, List, Set } from 'immutable';
import { connect } from 'react-redux';

import API from '../../../middleware/API';

import Item from './Item';
import CreateLeague from './CreateLeague';
import Spinner from '../../common/Spinner/Spinner';

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
        this.loadData();
      } else {
        window.alert(res);
        this.setState({
          loading: false,
        });
      }
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

  render() {
    const { state, props } = this;
    const { accountStore } = props;
    const { loading, leagues } = state;
    return (
      <div className={cx('root')}>
        <Spinner show={loading} />
        {accountStore.getIn(['userInfo', 'role']) === 'admin' ? (
          <CreateLeague createLeague={this.createLeague} />
        ) : null}
        {leagues.map(d => {
          return (
            <Item
              key={d.get('_id')}
              userInfo={accountStore.get('userInfo')}
              joinLeague={this.joinLeague}
              deleteLeague={this.deleteLeague}
              data={d}
            />
          );
        })}
      </div>
    );
  }
}

export default connect(stores => {
  return {
    accountStore: stores.account,
  };
})(LeagueList);
