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
      position_qb {
        ...playerMain
      }
      position_rb {
        ...playerMain
      }
      position_wr {
        ...playerMain
      }
      position_te {
        ...playerMain
      }
      position_k {
        ...playerMain
      }
      position_defense {
        ...playerMain
      }
      position_p {
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
