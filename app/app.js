const express = require('express');
const compression = require('compression');
const { authenticated } = require('./routes/middleware/authHandler');
const { helm, corsOptions } = require('./config/securitySettings');
const { errorHandler } = require('./routes/middleware/errorHandler');
const { healthRouter } = require('./routes/api/healthRouter');
const { menuRouter } = require('./routes/api/menuRouter');

const app = () => {
    const expressApi = express();
    const baseApiRoute = '/api';

    // enable CORS for testing
    expressApi.use(helm);
    expressApi.use(corsOptions);
    expressApi.use(express.json());
    expressApi.use(compression());

    // Unauthenticated routes
    expressApi.use(baseApiRoute, healthRouter);

    // enable the auth middleware
    expressApi.use(authenticated);
    // Authenticates routes
    expressApi.use(baseApiRoute, menuRouter);

    // error handler
    expressApi.use((error, req, res, next) =>
        errorHandler(error, req, res, next)
    );

    return expressApi;
};
module.exports = {
    app,
};
