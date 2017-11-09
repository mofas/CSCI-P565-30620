#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Wed Nov  8 18:03:53 2017

@author: joelpark
"""

#patch videos
import pandas as pd
videos = pd.read_csv('nflvideos.csv')
stats = pd.read_csv('nfl_stats.csv')
for index, row in videos.iterrows():
    name = row['Name'][:2] + ' ' + row['Name'][2:]
    videos.set_value(index, 'Name', name)
stats = pd.merge(stats, videos, on=['Name', 'Team', 'Position'], how='outer')
stats.to_csv('temp.csv', index=False)