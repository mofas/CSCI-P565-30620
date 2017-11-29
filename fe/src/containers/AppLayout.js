import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Route } from 'react-router-dom';

import Navbar from '../components/common/Navbar/Navbar';
import News from '../components/pages/News/Index';

import PlayerList from '../components/pages/PlayerList/Index';
import PlayerDetail from '../components/pages/PlayerDetail/Index';

import LeagueList from '../components/pages/LeagueList/Index';
import CreateLeague from '../components/pages/CreateLeague/Index';
import DraftPlayer from '../components/pages/DraftPlayer/Index';
import LeagueSeason from '../components/pages/LeagueSeason/Index';
import TradePlayer from '../components/pages/TradePlayer/Index';

import ChatRoom from '../components/pages/ChatRoom/Index';
import UserList from '../components/pages/UserList/Index';

import classnames from 'classnames/bind';
import style from './App.css';
const cx = classnames.bind(style);

class MainLayout extends Component {
  render() {
    const { props } = this;
    const { accountStore } = props;
    const role = accountStore.getIn(['userInfo', 'role']);
    return (
      <div>
        <Navbar />
        <div className={cx('container')}>
          <div className={cx('menu')}>
            <Link className={cx('link')} to="/app/news">
              News
            </Link>
            <Link className={cx('link')} to="/app/player/list">
              Players
            </Link>
            <Link className={cx('link')} to="/app/league/list">
              Leagues
            </Link>
            <Link className={cx('link')} to="/app/chatroom/main">
              Main Chat Room
            </Link>
            {role === 'admin' ? (
              <Link className={cx('link')} to="/app/user/list">
                Users
              </Link>
            ) : null}
          </div>
          <div className={cx('content')}>
            <Route exact path="/app/news" component={News} />
            <Route exact path="/app/player/list" component={PlayerList} />
            <Route
              exact
              path="/app/player/detail/:p_id"
              component={PlayerDetail}
            />
            <Route exact path="/app/league/list" component={LeagueList} />
            <Route exact path="/app/league/create" component={CreateLeague} />
            <Route
              exact
              path="/app/league/draft/:l_id"
              component={DraftPlayer}
            />
            <Route
              exact
              path="/app/league/season/:l_id"
              component={LeagueSeason}
            />
            <Route
              exact
              path="/app/league/trade/:l_id"
              component={TradePlayer}
            />
            <Route exact path="/app/chatroom/:room_id" component={ChatRoom} />
            <Route exact path="/app/user/list" component={UserList} />
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
})(MainLayout);
