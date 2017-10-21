import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';

import Navbar from '../components/common/Navbar/Navbar';
import News from '../components/pages/News/Index';

import LeagueList from '../components/pages/LeagueList/Index';

import PlayerList from '../components/pages/PlayerList/Index';
import PlayerDetail from '../components/pages/PlayerDetail/Index';

import classnames from 'classnames/bind';
import style from './App.css';
const cx = classnames.bind(style);

export default class MainLayout extends Component {
  render() {
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
          </div>
        </div>
      </div>
    );
  }
}
