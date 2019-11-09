
const path = require('path');

// Config Server
const { applyToDefaults } = require('hoek');
const { parsed } = require('dotenv').config();
const { name, version, description } = require('../package.json');

exports.glueOptions = async() => ({
    relativeTo: path.join(__dirname, '/'),
});

exports.configure = async(config = {}) => {
    applyToDefaults(process.env, applyToDefaults(parsed || {}, config));
};

exports.loadServer = async() => ({
    port: process.env.PORT,
    host: process.env.HOST,
    address: process.env.ADDRESS,
    app: {
        globals: process.env,
    },
    debug: {
        log: process.env.NODE_ENV === 'production' ? 'info' : '*',
        request: process.env.NODE_ENV === 'production' ? ['error'] : '*',
    },
    routes: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control'],
        },
    },
});

exports.loadPlugins = async() => ({
    plugins: [{
            plugin: 'inert',
        },
        {
            plugin: 'vision',
        },
        {
            plugin: 'hapi-swagger',
            routes: {
                prefix: `/api/${process.env.API_VERSION}`,
            },
            options: {
                host: process.env.HOST_SWAGGER,
                info: {
                    title: `${name}: API documentation. ${description}`,
                    version,
                },
            },
        },
        {
            plugin: 'blipp',
        },
        {
            plugin: 'hapi-alive',
            routes: {
                prefix: `/api/${process.env.API_VERSION}`,
            },
            options: {
                path: '/health',
                tags: ['api', 'health', 'monitor'],
            },
        },
        {
            plugin: 'hapi-boom-decorators',
        },
        {
            plugin: './plugins/methods/upload-gc',
        },
        {
            plugin: './plugins/routes/upload-file',
            routes: {
                prefix: `/api/${process.env.API_VERSION}`,
            },
        }
    ],
});