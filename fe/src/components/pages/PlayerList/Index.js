import React from 'react';
import { fromJS } from 'immutable';

import Item from './Item';

import classnames from 'classnames/bind';
import style from './Index.css';
const cx = classnames.bind(style);

const randomInt = range => {
  return Math.ceil(Math.random() * range);
};

const genStat = () => {
  return fromJS({
    passing_yds: randomInt(60),
    rushing_yds: randomInt(20),
    receiving_yds: randomInt(40),
    passing_tds: randomInt(10),
    rushing_tds: randomInt(10),
    receiving_tds: randomInt(100),
    kicking_fgm: randomInt(100),
    kicking_fga: randomInt(100),
    kicking_fgm: randomInt(100),
    kicking_xpmade: randomInt(40),
    passing_int: randomInt(40),
    fumbles_lost: randomInt(40),
    defense_int: randomInt(20),
    defense_ffum: randomInt(20),
    defense_sk: randomInt(40),
    defense_xpblk_defense_fgblk: randomInt(40),
    defense_puntblk: randomInt(40),
    defense_safe: randomInt(60),
    kickret_tds: randomInt(40),
    puntret_tds: randomInt(40),
    defense_tds: randomInt(40),
  });
};

const genDummyData = () => {
  const ret = fromJS([
    {
      name: 'T.Mitchell',
      position: 'CB',
      team: 'ICB',
      fancy_score_rank: 1,
    },
    {
      name: 'L.Johnson',
      position: 'RB',
      team: 'ICB',
      fancy_score_rank: 4,
    },
    {
      name: 'K.Redfern',
      position: 'P',
      team: 'ICB',
      fancy_score_rank: 11,
    },
    {
      name: 'T.Jones',
      position: 'WR',
      team: 'ICB',
      fancy_score_rank: 17,
    },
    {
      name: 'K.Williams',
      position: 'RB',
      team: 'ICB',
      fancy_score_rank: 25,
    },
    {
      name: 'I.Momah',
      position: 'TE',
      team: 'ICB',
      fancy_score_rank: 33,
    },
    {
      name: 'B.Dunn',
      position: 'DT',
      team: 'ICB',
      fancy_score_rank: 54,
    },
    {
      name: 'T.Bohanon',
      position: 'FB',
      team: 'ICB',
      fancy_score_rank: 101,
    },
    {
      name: 'T.Smith',
      position: 'CB',
      team: 'ICB',
      fancy_score_rank: 119,
    },
    {
      name: 'M.Lynch',
      position: 'RB',
      team: 'ICB',
      fancy_score_rank: 173,
    },
    {
      name: 'G.Tavecchio',
      position: 'K',
      team: 'ICB',
      fancy_score_rank: 233,
    },
  ]);

  return ret.map(d => d.merge(genStat()));
};

const dummyData = genDummyData();

class PlayerList extends React.PureComponent {
  render() {
    console.log(dummyData.toJS());
    const { props } = this;
    return (
      <div className={cx('root')}>
        {dummyData.map(d => {
          return <Item data={d} />;
        })}
      </div>
    );
  }
}

export default PlayerList;