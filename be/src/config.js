import { config } from '../package.json';

const defaultConfig = {
  server: {
    hostname: '127.0.0.1',
    port: 5000,
  },
  mongo: {
    url: `mongodb://localhost:27017/local`,
  },
  session: {
    cookie: {
      secure: false, // TODO: should be true in production environment
    },
    saveUninitialized: false,
    resave: false,
    secret: 'you_should_not_use_default_secret',
  },
};

module.exports = defaultConfig;
