{
  QueryFantasyTeam(_id: "5a07e5ca57c3710de15f645d") {
    _id
    name
    account {
      _id
      email
      role
      status
      ban
    }
    league {
      name
    }
    arrangement {
      position_qb_0 {
        ...playerMain
      }
      position_rb_0 {
        ...playerMain
      }
      position_wr_0 {
        ...playerMain
      }
      position_wr_1 {
        ...playerMain
      }
      position_te_0 {
        ...playerMain
      }
      position_k_0 {
        ...playerMain
      }
      position_p {
        ...playerMain
      }
      position_defense_0 {
        ...playerMain
      }
      position_defense_1 {
        ...playerMain
      }
      position_defense_2 {
        ...playerMain
      }
      position_defense_3 {
        ...playerMain
      }
      position_defense_4 {
        ...playerMain
      }

    }
  }
}

fragment playerMain on PlayerType {
  Name
  Position
  Passing_Yards
  Rushing_Yards
  Receiving_Yards
  Passing_TDs
  Rushing_TDs
  Receiving_TD
  FG_Made
  FG_Missed
  Extra_Points_Made
  Interceptions
  Fumbles_Lost
  Kickoff_Return_TD
  Interceptions_Thrown
  Forced_Fumbles
  Sacks
  Blocked_Kicks
  Blocked_Punts
  Safeties
  Punt_Return_TD
  Defensive_TD
  Punting_Yards
  Punting_i20
}

==========

{
  QueryTeamArrangement(league_id: "5a08b7d7a5f5c440d2159165", account_id: "59e988fe76539f281279d241") {
    position_qb_0 {
      ...playerMain
    }
    position_rb_0 {
      ...playerMain
    }
    position_wr_0 {
      ...playerMain
    }
    position_wr_1 {
      ...playerMain
    }
    position_te_0 {
      ...playerMain
    }
    position_k_0 {
      ...playerMain
    }
    position_p {
      ...playerMain
    }
    position_defense_0 {
      ...playerMain
    }
    position_defense_1 {
      ...playerMain
    }
    position_defense_2 {
      ...playerMain
    }
    position_defense_3 {
      ...playerMain
    }
    position_defense_4 {
      ...playerMain
    }
  }
}

fragment playerMain on PlayerType {
  _id
  Name
  Position
}


mutation{
  UpdateTeamArrangement(fantasy_team_id:"5a18e5ed85944de8e571ac66" position: "position_te" index: 1 player_id: "5a07bc4c95da7e7cf2cd608b"){
    success
  }
}
