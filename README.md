# Software Engineering


Before you start develop Backend, please install mongodb at first.

# Database

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




