

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


## Build front-end server

Then you will need to create homepage by SICE Homepage Management

```
https://help.sice.indiana.edu/homes/
```

Select HTML/PHP/CGI Options, and then there is folder `cgi-pub` will be creatd in your user folder.


Follwoing commands will install dependency, and it should take minutes.

```
cd fe && npm install
```

Before you build file, edit package.json

```git
-  "homepage": "http://mofas.github.io/CSCI-P565-30620",
+  "homepage": "http://homes.soic.indiana.edu/<username>/",
```


Hit the following commands to build file.

```
npm run build:production
```

  Then we just need to copy our page to that folder,
```
rm -rf /u/cli3/cgi-pub
mv ./build ./cgi-pub && mv -f ./cgi-pub /u/cli3/
```

Then you can visit page

```
http://homes.soic.indiana.edu/cli3
```


## Launch mongodb



### Option 1: Install mongodb locally

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

Save & Exit vim, then hit the following command to run mongodb on background
```
nohup mongod --config /u/<username>/mongodb/mongod.conf &
```

If you encounter an error like following:
```
2017-10-04T21:03:33.060-0400 SEVERE: Failed global initialization: BadValue Invalid or no user locale set. Please ensure LANG and/or LC_* environment variables are set correctly.
```

Please try the following command, and try it again.
```
export LC_ALL=C
```

You can use `kill %1` to stop mongoDB. (I assume you know how kill work in linux), and you can use mongo shell `mongo localhost:27017` to inspect your DB now.


#### Option 2: Run mongodb inside docker


```
mkdir /u/<username>/mongodb
mkdir /u/<username>/mongodb/data
mkdir /u/<username>/mongodb/data/db
docker run -p 27017:27017 -v /u/<username>/mongodb/data/db:/data/db --name my-mongo-db -d mongo --storageEngine wiredTiger
```

If it start successfully, you can use `docker ps` to check.
It should look like

```
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                      NAMES
7164be7891c7        mongo               "docker-entrypoint..."   2 days ago          Up 3 seconds        0.0.0.0:27017->27017/tcp   my-mongo-db
```

You can use mongo shell `mongo localhost:27017` to inspect your DB now.


## Build Backend

1. Export all environment variable

2.

```
cd be && npm install
npm run compile
npm run start:production
```




