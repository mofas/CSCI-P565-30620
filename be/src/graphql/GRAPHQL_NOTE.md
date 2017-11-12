

fragment example


{
  QueryTeamArrangement(fancy_team_id: "5a07d82fa1032607cdc586c1") {
    fancy_team_id
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
    position_p{
      ...playerMain
    }
  }
}

fragment playerMain on PlayerType {
  Name
  Position
}





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
        _id
        Name
        Position
      }
      position_k{
        Name
      }
    }
  }
}
