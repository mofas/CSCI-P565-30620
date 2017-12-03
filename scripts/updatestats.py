# -*- coding: utf-8 -*-
#Connect to schedule database
from pymongo import MongoClient
import nflgame
client = MongoClient('localhost', 27017)
dbname = 'local'
colname = 'leagues'
db = client[dbname]
collection = db[colname]
#Get week from database
week = collection.find_one()['gameWeek']
collection.update_many({'gameWeek': week}, {'$inc':{'gameWeek': 1}}) #increments week
#Get stats for current week
games = nflgame.games(2017, week=week)
players = nflgame.combine(games)
#Connect to players database
colname = 'players'
db = client[dbname]
collection = db[colname]
#Update stats for the current week
for p in players:
    collection.update_one({'$and':[{'Name':p.name[:2] + ' ' + p.name[2:]}, {'Team':p.team}]}, {'$set':
        {'Passing_Yards_curr':p.passing_yds,
         'Rushing_Yards_curr':p.rushing_yds,
         'Receiving_Yards_curr':p.receiving_yds,
         'Passing_TDs_curr':p.passing_tds,
         'Rushing_TDs_curr':p.rushing_tds,
         'Receiving_TD_curr':p.receiving_tds,
         'FG_Made_curr':p.kicking_fgm,
         'FG_Missed_curr':p.kicking_fga - p.kicking_fgm,
         'Extra_Points_Made_curr':p.kicking_xpmade,
         'Interceptions_Thrown_curr':p.passing_int,
         'Fumbles_Lost_curr':p.fumbles_lost,
         'Interceptions_curr':p.defense_int,
         'Forced_Fumbles_curr':p.defense_ffum,
         'Sacks_curr':p.defense_sk,
         'Blocked_Kicks_curr':p.defense_xplblk+p.defense_fgblk,
         'Blocked_Punts_curr':p.defense_puntblk,
         'Safeties_curr':p.defense_safe,
         'Kickoff_Return_TD_curr':p.kickret_tds,
         'Punt_Return_TD_curr':p.puntret_tds,
         'Defensive_TD_curr':p.defense_tds,
         'Punting_i20_curr': p.punting_i20,
         'Punting_Yards_curr': p.punting_yds}})
    collection.update_one({'$and':[{'Name':p.name[:2] + ' ' + p.name[2:]}, {'Team':p.team}]}, {'$inc':
        {'Passing_Yards':p.passing_yds,
         'Rushing_Yards':p.rushing_yds,
         'Receiving_Yards':p.receiving_yds,
         'Passing_TDs':p.passing_tds,
         'Rushing_TDs':p.rushing_tds,
         'Receiving_TD':p.receiving_tds,
         'FG_Made':p.kicking_fgm,
         'FG_Missed':p.kicking_fga - p.kicking_fgm,
         'Extra_Points_Made':p.kicking_xpmade,
         'Interceptions_Thrown':p.passing_int,
         'Fumbles_Lost':p.fumbles_lost,
         'Interceptions':p.defense_int,
         'Forced_Fumbles':p.defense_ffum,
         'Sacks':p.defense_sk,
         'Blocked_Kicks':p.defense_xplblk+p.defense_fgblk,
         'Blocked_Punts':p.defense_puntblk,
         'Safeties':p.defense_safe,
         'Kickoff_Return_TD':p.kickret_tds,
         'Punt_Return_TD':p.puntret_tds,
         'Defensive_TD':p.defense_tds,
         'Punting_i20': p.punting_i20,
         'Punting_Yards': p.punting_yds}})