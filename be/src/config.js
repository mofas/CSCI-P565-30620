import { config } from '../package.json';

const defaultConfig = {
  server: {
    hostname: '127.0.0.1',
    port: 5000,
    salt: 'eewew',
  },
  fe: {
    url: 'http://localhost:3000',
  },
  mongo: {
    url: `mongodb://localhost:27017/local`,
  },
  oauth: {
    clientID: process.env.G_OAUTH_CLIENT_ID || '',
    clientSecret: process.env.G_OAUTH_SECRET || '',
    callbackURL: 'http://localhost:5000/oauth2callback',
  },
  duo: {
    disable: true,
    hostname: 'api-00cc3ec1.duosecurity.com',
    integrationKey: 'DI7GFUB7U9UYCE38XRTG',
    secretKey: process.env.DUO_SECRET || '',
  },
  session: {
    cookie: {
      secure: false,
    },
    saveUninitialized: false,
    resave: false,
    secret: 'you_should_not_use_default_secret',
  },
};

const testingConfig = {
  server: {
    hostname: '127.0.0.1',
    port: 5000,
    salt: 'eewew',
  },
  fe: {
    url: 'https://mofas.github.io/CSCI-P565-30620',
  },
  mongo: {
    url: `mongodb://${process.env.DB_ACC}:${
      process.env.DB_PWD
    }@ds155684.mlab.com:55684/football`,
  },
  oauth: {
    clientID: process.env.G_OAUTH_CLIENT_ID,
    clientSecret: process.env.G_OAUTH_SECRET,
    callbackURL: 'https://csci.now.sh/oauth2callback',
  },
  duo: {
    disable: false,
    hostname: 'api-00cc3ec1.duosecurity.com',
    integrationKey: 'DI7GFUB7U9UYCE38XRTG',
    secretKey: process.env.DUO_SECRET || '',
  },
  session: {
    cookie: {
      secure: false,
    },
    saveUninitialized: false,
    resave: false,
    secret: 'you_should_not_use_default_secret',
  },
};

const productionConfig = {
  server: {
    hostname: '127.0.0.1',
    port: 50010,
    salt: 'eewew',
  },
  fe: {
    url: 'http://homes.soic.indiana.edu/cli3',
  },
  mongo: {
    url: `mongodb://${process.env.DB_ACC}:${
      process.env.DB_PWD
    }@ds155684.mlab.com:55684/football`,
  },
  oauth: {
    clientID: process.env.G_OAUTH_CLIENT_ID,
    clientSecret: process.env.G_OAUTH_SECRET,
    callbackURL: 'https://csci.now.sh/oauth2callback',
  },
  duo: {
    disable: false,
    hostname: 'api-00cc3ec1.duosecurity.com',
    integrationKey: 'DI7GFUB7U9UYCE38XRTG',
    secretKey: process.env.DUO_SECRET || '',
  },
  session: {
    cookie: {
      secure: false,
    },
    saveUninitialized: false,
    resave: false,
    secret: 'you_should_not_use_default_secret',
  },
};

const getConfig = () => {
  if (process.env.CONFIG === 'testing') {
    return testingConfig;
  }
  if (process.env.CONFIG === 'production') {
    return productionConfig;
  }

  return defaultConfig;
};

const targetConfig = getConfig();

module.exports = targetConfig;
