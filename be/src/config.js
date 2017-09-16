import { config } from '../package.json';

const defaultConfig = {
  server: {
    hostname: '127.0.0.1',
    port: 5000,
    session: {
      saveUninitialized: false,
      resave: false,
      secret: 'cool secrect',
    },
  },
};

module.exports = defaultConfig;
