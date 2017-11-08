# -*- coding: utf-8 -*-
"""
Created on Sat Oct 14 15:53:11 2017

@author: Tyler
"""

import pandas as pd 
import csv
import math

#Name, Position, Team, Rank



#def getScore(df):
#    for index, row in df.iterrows():
#        score = row['Passing_Yards']//25 + row['Rushing_Yards']//10 + row['Receiving_Yards']//10 + row['Passing_TDs']*4 
#        score = score + row['Rushing_TDs'] * 6 + row['Receiving_TD'] * 6 + row['FG_Made'] * 3 - row['FG_Missed'] + row['Extra_Points_Made']
#        score = score - row['Interceptions_Thrown'] * 2 - row['Fumbles_Lost'] * 2 + row['Interceptions'] * 2 + row['Forced_Fumbles'] * 2
#        score = score + row['Sacks'] + row['Blocked_Kicks'] * 2 + row['Blocked_Punts'] * 2 + row['Safeties'] * 2 + row['Kickoff_Return_TD'] * 6
#        score = score + row['Punt_Return_TD']*6 + row['Defensive_TD'] * 6
#
#    return score 
#    
#hunt = df[df['Name'] == 'K.Hunt']
#score = getScore(hunt)

#--------------PATCHING----------------------
with open('nfl_stats_first3.csv', 'r') as f:
    newdata = open('player_data.csv', 'wb')
    missingpos = open('missingpositions.csv', 'rU')
    reader = csv.reader(f)
    positionreader = csv.reader(missingpos)
    writer = csv.writer(newdata, delimiter=',',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL)
    positions = {}
    for row in positionreader:
        positions[row[0]] = row[1]
    for row in reader:
        if row[0] in positions and row[1] == '':
            row[1] = positions[row[0]]
        if row[1] not in ['G', 'T', 'C', 'LT', 'LG', 'RG', 'RT', 'LS', 'OG', 'OT']:
            writer.writerow(row)
    print "Done"
    newdata.close()
    missingpos.close()
   
#---------------------CALC SCORE ----------------------------
df = pd.read_csv('player_data.csv')
header = ['Name', 'Position', 'Team', 'Score']
with open('nfl_scores.csv', 'w') as fp:
    wr = csv.writer(fp, delimiter=',', lineterminator='\n')
    wr.writerow(header)
    for index, row in df.iterrows():
        score = row['Passing_Yards']//25 + row['Rushing_Yards']//10 + row['Receiving_Yards']//10 + row['Passing_TDs']*4 
        score = score + row['Rushing_TDs'] * 6 + row['Receiving_TD'] * 6 + row['FG_Made'] * 3 - row['FG_Missed'] + row['Extra_Points_Made']
        score = score - row['Interceptions_Thrown'] * 2 - row['Fumbles_Lost'] * 2 + row['Interceptions'] * 2 + row['Forced_Fumbles'] * 2
        score = score + row['Sacks'] + row['Blocked_Kicks'] * 2 + row['Blocked_Punts'] * 2 + row['Safeties'] * 2 + row['Kickoff_Return_TD'] * 6
        score = score + row['Punt_Return_TD']*6 + row['Defensive_TD'] * 6 + row['Punting_Yards'] // 50 + row['Punting_i20']
        #Write the data
        wr.writerow([row['Name'], row['Position'], row['Team'], int(math.ceil(score))])
        
#---------------------------CALC RANK -----------------------------------------------
df = pd.read_csv('nfl_scores.csv')

kickers = df[df['Position'].isin(['K', 'P'])]
kickers['Rank'] = kickers['Score'].rank(ascending=False)
kickers['Rank'] = kickers['Rank'].apply(math.floor)

offense = df[df['Position'].isin(['QB', 'WR', 'TE', 'RB', 'FB'])]
offense['Rank'] = offense['Score'].rank(ascending=False)
offense['Rank'] = offense['Rank'].apply(math.floor)

defense = df[df['Position'].isin(['CB', 'DB', 'DT', 'NT', 'DE', 'LB', 'OLB', 'ILB', 'FS', 'SS', 'DEF', 'SAF', 'MLB', 'DL'])]
defense['Rank'] = defense['Score'].rank(ascending=False)
defense['Rank'] = defense['Rank'].apply(math.floor)

positions = [kickers, offense, defense]
ranks = pd.concat(positions)

rankDict= {}
for index, row in ranks.iterrows():
    rankDict[(row['Name'], row['Team'])] = row['Rank']
    

#-----------------------Write Master Initial File ----------------------#
import nflgame

games = nflgame.games(2017, week=[1,2,3])
players = nflgame.combine(games)

header = ['Name', 'Position', 'Team', 'Passing_Yards','Rushing_Yards','Receiving_Yards',	'Passing_TDs',	'Rushing_TDs',	
          'Receiving_TD',	'FG_Made', 'FG_Missed',	'Extra_Points_Made', 'Interceptions_Thrown', 'Fumbles_Lost', 'Interceptions',
          'Forced_Fumbles','Sacks','Blocked_Kicks','Blocked_Punts','Safeties','Kickoff_Return_TD','Punt_Return_TD','Defensive_TD', 'Rank', 'Punting_i20', 'Punting_Yards']

with open('nfl_stats.csv', 'w') as fp:
    df = pd.read_csv('player_data.csv')
    wr = csv.writer(fp, delimiter=',', lineterminator='\n')
    wr.writerow(header)
    for index, row in df.iterrows():
        #score = rankDict[(row['Name'], row['Team'])]
        try:
            score = rankDict[(row['Name'], row['Team'])]
            wr.writerow( [row['Name'][:2]+ ' ' + row['Name'][2:], row['Position'], row['Team'], row['Passing_Yards'],row['Rushing_Yards'],row['Receiving_Yards'],row['Passing_TDs'],row['Rushing_TDs'],	
          row['Receiving_TD'],	row['FG_Made'], row['FG_Missed'],	row['Extra_Points_Made'], row['Interceptions_Thrown'], row['Fumbles_Lost'], row['Interceptions'],
          row['Forced_Fumbles'],row['Sacks'],row['Blocked_Kicks'],row['Blocked_Punts'],row['Safeties'],row['Kickoff_Return_TD'],row['Punt_Return_TD'],row['Defensive_TD'], int(score),
          row['Punting_i20'], row['Punting_Yards']]
            )
        except:
            print(row['Name'])
   
