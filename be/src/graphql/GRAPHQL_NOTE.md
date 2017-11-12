

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
