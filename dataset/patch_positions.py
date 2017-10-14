#patch CSV
import csv
with open('nfl_stats.csv', 'r') as f:
    newdata = open('positions.csv', 'wb')
    missingpos = open('missingpositions.csv', 'rU')
    reader = csv.reader(f)
    positionreader = csv.reader(missingpos)
    writer = csv.writer(newdata, delimiter=',',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL)
    positions = {}
    for row in positionreader:
        positions[row[0]] = row[1]
    for row in reader:
        if row[0] in positions:
            row[1] = positions[row[0]]
        writer.writerow(row)
    print "Done"
    newdata.close()
    missingpos.close()
