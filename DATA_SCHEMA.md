

#### ACCOUNTS: (accounts)

```js
{
  _id: ""
  email: "admin",
  password: "password",
  role: "player", // admin, player
  status: "0", // -1 for not validated, 0 for normal user.
  valCode: "w34tesgbw34trg4retq4rtwg",
}
```

#### PLAYERS: (players)

```js
{
  _id: xxxxx,
  picture: "./img/player"
  name: "Tom Brady",
  position: "QB",

  team_id: xxx,

  fancy_score_rank: 1, //Integer

  passing_yds: 12, //Integer
  rushing_yds: 12, //Integer
  receiving_yds: 12, //Integer
  passing_tds: 12, //Integer
  rushing_tds: 12, //Integer
  receiving_tds: 12, //Integer
  kicking_fgm: 12, //Integer
  kicking_fgmissed: 12, //Integer computed by kicking_fga - kicking_fgm
  kicking_xpmade: 12, //Integer
  passing_int: 12, //Integer
  fumbles_lost: 12, //Integer
  defense_int: 12, //Integer
  defense_ffum: 12, //Integer
  defense_sk: 12, //Integer
  defense_kick_blocks: 12, //Integer computed by defense_xpblk + defense_fgblk
  defense_puntblk: 12, //Integer
  defense_safe: 12, //Integer
  kickret_tds: 12, //Integer
  puntret_tds: 12, //Integer
  defense_tds: 12, //Integer

//Current week stats
  passing_yds_curr: 12, //Integer
  rushing_yds_curr: 12, //Integer
  receiving_yds_curr: 12, //Integer
  passing_tds_curr: 12, //Integer
  rushing_tds_curr: 12, //Integer
  receiving_tds_curr: 12, //Integer
  kicking_fgm_curr: 12, //Integer
  kicking_fgmissed_curr: 12, //Integer computed by kicking_fga - kicking_fgm
  kicking_xpmade_curr: 12, //Integer
  passing_int_curr: 12, //Integer
  fumbles_lost_curr: 12, //Integer
  defense_int_curr: 12, //Integer
  defense_ffum_curr: 12, //Integer
  defense_sk_curr: 12, //Integer
  defense_kick_blocks_curr: 12, //Integer computed by defense_xpblk + defense_fgblk
  defense_puntblk_curr: 12, //Integer
  defense_safe_curr: 12, //Integer
  kickret_tds_curr: 12, //Integer
  puntret_tds_curr: 12, //Integer
  defense_tds_curr: 12, //Integer
}
```

#### PLAYER_SCORE

```js
{
  _id: "xxxx",
  p_id: "xxxx",
  score: [2, 3, 5], //scores by weeks
}
```


#### LEAGUES (leagues)

```js
{
  _id: "xxxx",
  name: "Our First Leagues",
  stage: "Initial", //Initial, Draft, SeasonStart, Finish
  limit: 4,
  accounts: ["user_id1", "user_id2"],
  draft_run: 0, //draft_run are from 0 to 79 = 20(player in each team) * 4(limit) - 1

  creator: '_account id', // now we can do permission control
  create_time: 12312312312, // unix time
  formula: {
    td_passway_weight: 4,
  }
  draft_start_time: 12312334312, // draft start time
  timeout: 2, // how long user should wait, prior to automatic refresh ( # Minutes)
  lastPickTime: 12312312312, // last pick time
  gameWeek:0 // current game week
}
```

#### POOL (pool)

```js
{
  _id: "....",
  league_id: "xxxx",
  player_id: "xxxx",
  account_id: "xxxx",
}
```

#### ARRANGEMENT (arrangement)

```js
{
  _id: "....",
  fancy_team_id: "xxxx",
  position_qb_0: "player_id_xxx",
  position_rb_0: "player_id_xxx",
  position_wr_0: "player_id_xxx",
  position_wr_1: "player_id_xxx",
  position_te_0: "player_id_xxx",
  position_k_0: "player_id_xxx",
  position_p_0: "player_id_xxx",
  position_defense_0: "player_id_xxx",
  position_defense_1: "player_id_xxx",
  position_defense_2: "player_id_xxx",
  position_defense_3: "player_id_xxx",
  position_defense_4: "player_id_xxx",
}
```

#### FANTASY TEAMS (fantasy_team)

```js
{
  _id: "xxx",
  account_id: "xxxx",
  league_id: "xxx",
  name: "My awesome teams",
  wins: 2,
  lose: 3,
}
```

#### GAME_RECORD

```js
{
  record_id: "xxxxx",
  league_id: "xxx",
  week: 1,
  first_team: "xxxxx",
  second_team: "xxxxxx",
  winner: 0, // 0 mean first, 1 mean second
  first_score: 44,
  second_score: 23,
}
```

#### SCHEDULE (schedule)

```js
{
  league_id: "xxxx"
  week_no: 1, //Integer
  first_team: "xxxxx",
  second_team: "xxxxx",
}
```


#### Message (messages)

```js
{
  room_id: "1341324",
  sender: "email@cool.com",
  message: "this is message",
}
```










