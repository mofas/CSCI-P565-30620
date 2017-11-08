# -*- coding: utf-8 -*-
"""
Created on Sat Sep 30 15:36:25 2017

@author: Tyler
"""

import nflgame
import csv


games = nflgame.games(2017, week=[1,2,3,4,5,6])
players = nflgame.combine(games)

#header = ['Name', 'Position', 'Team', 'Passing_Yards', 'Rushing_Yards', 'Receiving_Yards', 'Passing_TDs', 'Rushing_TDs',	
 #         'Receiving_TD','FG_Made','FG_Missed', 'Extra_Points_Made', 'Interceptions',	'Fumbles_Lost']

header = ['Name', 'Position', 'Team', 'Passing_Yards','Rushing_Yards','Receiving_Yards',	'Passing_TDs',	'Rushing_TDs',	
          'Receiving_TD',	'FG_Made', 'FG_Missed',	'Extra_Points_Made', 'Interceptions_Thrown', 'Fumbles_Lost', 'Interceptions',
          'Forced_Fumbles','Sacks','Blocked_Kicks','Blocked_Punts','Safeties','Kickoff_Return_TD','Punt_Return_TD','Defensive_TD', 'Punting_i20', 'Punting_Yards']

with open('nfl_stats_first3.csv', 'w') as fp:
    wr = csv.writer(fp, delimiter=',', lineterminator='\n')
    wr.writerow(header)
    for p in players:
        wr.writerow([p,p.guess_position, p.team,p.passing_yds,p.rushing_yds, p.receiving_yds, p.passing_tds,p.rushing_tds, 
                     p.receiving_tds, p.kicking_fgm, p.kicking_fga - p.kicking_fgm, p.kicking_xpmade, p.passing_int,  p.fumbles_lost,
                     p.defense_int, p.defense_ffum, p.defense_sk, p.defense_xpblk+p.defense_fgblk, p.defense_puntblk, p.defense_safe,
                     p.kickret_tds, p.puntret_tds, p.defense_tds, p.punting_i20, p.punting_yds])
