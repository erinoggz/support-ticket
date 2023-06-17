import { config } from 'dotenv';
config();

const configuration = {
  appname: 'support-ticket',
  mongo: {
    uri: process.env.DATABASE,
  },
  web: {
    environment: process.env.NODE_ENV,
    port: parseInt(process.env.PORT) || 6677,
    jwt_secret: process.env.JWT_SECRET,
    jwt_duration: process.env.JWT_DURATION,
  },
};

export default configuration;
