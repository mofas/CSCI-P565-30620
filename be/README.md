# Server


## Prerequisite

#### Node.js

Please install node.js server from https://nodejs.org/en/.
After you installed, make sure it can be invoked from your command line tools.

Please input `node -v` to see if it can report version of your node.js.

```
$ node -v
v8.4.0
```

#### Yarn

Please install Yarn from https://yarnpkg.com/en/.
After you installed, make sure it can be invoked from your command line tools.

Please input `yarn -v` to see if it can run.

```
$ yarn -v
1.0.1
```

## Setup

```
$ git clone https://github.com/mofas/CSCI-P565-30620.git
$ cd CSCI-P565-30620/be
$ yarn
```

## Start

Run following command on your CLI
```
$ yarn start
```
You should see something like following...

```
yarn start v1.0.1
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

Another example is `http://localhost:5000/add/5/6`, it will return the sum of two number you give.

Take look on src/index.js to see what is logic there.

Please add your toy api and commit to github for practicing.











