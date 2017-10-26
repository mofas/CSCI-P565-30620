# -*- coding: utf-8 -*-
#Connect to schedule database
from pymongo import MongoClient
import nflgame
client = MongoClient('localhost', 27017)
dbname = 'local'
colname = 'schedule'
db = client[dbname]
collection = db[colname]
#Get week from database
week = collection.find_one()['week_no']
collection.update_one({'week_no': week}, {'$inc':{'week_no': 1}}) #increments week
#Get stats for current week
games = nflgame.games(2017, week=week)
players = nflgame.combine(games)
players = nflgame.combine(games)
#Connect to players database
colname = 'players'
db = client[dbname]
collection = db[colname]
#Update stats for the current week
for p in players:
    collection.update_one({'$and':[{'Name':p.name}, {'Team':p.team}]}, {'$set':
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
         'Defensive_TD':p.defense_tds}})