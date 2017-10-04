

#### ACCOUNTS:

```js
{
  user_id: ""
  username: "admin",
  password: "password",
  role: "player", // admin, player
  status: "0", // -1 for not validated, 0 for normal user.
  valCode: "w34tesgbw34trg4retq4rtwg",
}
```

#### PLAYERS:

```js
{
  player_id: xxxxx,
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
  kicking_fga: 12, //Integer
  kicking_fgm: 12, //Integer
  kicking_xpmade: 12, //Integer
  passing_int: 12, //Integer
  fumbles_lost: 12, //Integer
  defense_int: 12, //Integer
  defense_ffum: 12, //Integer
  defense_sk: 12, //Integer
  defense_xpblk+defense_fgblk: 12, //Integer
  defense_puntblk: 12, //Integer
  defense_safe: 12, //Integer
  kickret_tds: 12, //Integer
  puntret_tds: 12, //Integer
  defense_tds: 12, //Integer


}
```

#### PLAYER_SCORE

```js
{
  league_id: "xxxx",
  p_id: "xxxx",
  score: [2, 3, 5], //scores by weeks
}
```

#### TEAMS:

```js
{
  team_id: "xxx",
  name: "Chicago Bears",
  code: "CHI",
}


#### LEAGUES
{
  league_id: "xxxx",
  name: "Our First Leagues",
}
```

#### POOL

```js
{
  league_id: "xxxx",
  player_id: "xxxx",
  fancy_team_id: "xxxx",
}
```

#### FANTASY TEAMS

```js
{
  account_id: "xxxx",
  fancy_team_id: "xxx",
  league_id: "xxx",
  name: "My awesome teams"
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

#### SCHEDULE

```js
  week_no: 1, //Integer
  first_team: "xxxxx",
  second_team: "xxxxx",
```






