import React from 'react';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

class News extends React.PureComponent {
  render() {
    const { props } = this;
    return (
      <div className={cx('root')}>
        <h1 className={cx('title')}>Team List</h1>
        <div className={cx('wrap')}>
          <a href="http://www.azcardinals.com/">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/ARI.svg" />
          </a>
          <a href="http://www.atlantafalcons.com/">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/ATL.svg" />
          </a>
          <a href="http://www.azcardinals.com/">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/BAL.svg" />
          </a>
          <a href="http://www.azcardinals.com/">
            <img src="https://static.nfl.com/static/site/img/logos/svg/teams/BUF.svg" />
          </a>
        </div>
      </div>
    );
  }
}

export default News;
