# Server


## Prerequisite

### Database

We use mongodb as our primary database.
WE can choose install mongodb locally, or running in docker.

#### 1. Install mongodb locally

Download mongodb from website (https://www.mongodb.com/), and follow instructions to finish installing. After success install, please run mongodb at port 27017, which is default setting.

#### 2. Run mongodb inside docker

Run the following command to start docker container, change `<YOUR_LOCAL_DIR>` to path you want to store data.

```
docker run -p 27017:27017 -v /<YOUR_LOCAL_DIR>/db_data:/data/db --name my-mongo-db -d mongo --storageEngine wiredTiger
```

If it start successfully, you can use `docker ps` to check.
It should look like

```
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                      NAMES
7164be7891c7        mongo               "docker-entrypoint..."   2 days ago          Up 3 seconds        0.0.0.0:27017->27017/tcp   my-mongo-db
```

### Mongodb Client Tool

I will suggest to use Robo 3T (https://robomongo.org/) as client for mongodb.


### Email service

we will use sendgrid as our email service, please ensure `sendgrid.env` in this folder. Please do not store `sendgrid.env` to any public access space.




## Setup

```
$ git clone https://github.com/mofas/CSCI-P565-30620.git
$ cd CSCI-P565-30620/be
$ yarn
```

## Start

Run following command on your CLI
```
$ yarn dev
```
You should see something like following...

```
yarn dev v1.0.1
warning package.json: No license field
$ nodemon --exec npm run babel-node -- ./src/index.js
[nodemon] 1.12.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `npm run babel-node ./src/index.js`

> game-server@0.0.1 babel-node /../CSCI-P565-30620/be
> babel-node "./src/index.js"
```


## Play with it.

Navigate to `http://localhost:5000/echo/hello_world`, it should display hello_world.

You can change `hello_world` to other text, and to see what happen.

Another example is `http://localhost:5000/add/5/6`, it will return the sum of two numbers you give.

Take look on src/index.js to see what logic there.

Please add your own api and commit to github for practicing.


## Deploy to ZEIT

Ask CY, CY will do it for you.

```
now
```

```
now alias game-server-ltrrxlifwx.now.sh csci.now.sh
```


## Deploy to SLIO


Compile file
```
yarn run compile
```

Start Server or Restart
```
npm run start:production
```












