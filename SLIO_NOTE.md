

## Copy Repo to slio

If you don't generate ssh access key in slio yet.

You can generate one by input

```
ssh-keygen -t rsa
```

then copy the `cat ~/.ssh/id_rsa` content, and go to page

```
https://github.com/mofas/CSCI-P565-30620/settings/keys
```

Click `Add deploy key` and paste it.


Then go back slio, clone the repo.

```
git clone git@github.com:mofas/CSCI-P565-30620.git
```


### Build front-end server

```
cd fe && npm install
```

It should take minutes.




### Launch mongodb

Change \<username\> to your net ID in the following commands.

```
mkdir /u/<username>/mongodb
mkdir /u/<username>/mongodb/run
mkdir /u/<username>/mongodb/data
mkdir /u/<username>/mongodb/data/db
cp /etc/mongod.conf /u/<username>/mongodb/mongod.conf
vim /u/<username>/mongodb/mongod.conf
```

Edit the config file like following set.

```
 1 ##
 2 ### Basic Defaults
 3 ##
 4
 5 # Comma separated list of ip addresses to listen on (all local ips by default)
 6 bind_ip = 127.0.0.1
 7
 8 # Specify port number (27017 by default)
 9 #port = 27017
10
11 # Fork server process (false by default)
12 fork = false
13
14 # Full path to pidfile (if not set, no pidfile is created)
15 pidfilepath = /u/<username>/mongodb/mongod.pid
16
17 # Log file to send write to instead of stdout - has to be a file, not directory
18 logpath = /u/<username>/mongodb/mongod.log
19
20 # Alternative directory for UNIX domain sockets (defaults to /tmp)
21 unixSocketPrefix = /u/<username>/mongodb/run/mongodb
22
23 # Directory for datafiles (defaults to /data/db/)
24 dbpath = /u/<username>/mongodb/data/db
25
26 # Enable/Disable journaling (journaling is on by default for 64 bit)
27 #journal = true
28 #nojournal = true
29
30
```

Save & Exit vim, then hit

Run the following command to run your mongodb on background
```
nohup mongod --config /u/<username>/mongodb/mongod.conf &
```

If you encounter error like following:
```
2017-10-04T21:03:33.060-0400 SEVERE: Failed global initialization: BadValue Invalid or no user locale set. Please ensure LANG and/or LC_* environment variables are set correctly.
```

Please try the following command, and try it again.
```
export LC_ALL=C
```

You can use `kill %1` to stop mongoDB. (I assume you know how kill work in linux).
You can use mongo shell `mongo localhost:27017` to inspect your DB now.