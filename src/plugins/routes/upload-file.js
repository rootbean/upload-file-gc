const { badImplementation, conflict } = require('boom');
const { error, log } = require('console');
const { name, version } = require('../../../package.json');

const { MAX_BYTES_IMAGES } = process.env;

/**  * @module upload-file-plugin  */
exports.plugin = {
    name: `${name}:route:routefile`,
    version,
};

/**
 *
 * @async
 * @function upload-file-plugin/register
 * @param {object} server
 * @param {object} options
 */
exports.plugin.register = async(server) => {

    // Upload files by brand
    server.route({
        path: '/upload-files',
        method: 'PUT',
        options: {
            description: 'Upload Files',
            notes: 'Upload Files',
            tags: ['api'],
            payload: {
                maxBytes: MAX_BYTES_IMAGES,
                output: 'file',
                parse: true,
                allow: 'multipart/form-data',
            },
            pre: [{
                assign: 'log',
                method: async(request) => {
                    log(request.path, 'at', Date.now());
                    return true;
                },
            }, {
                assign: 'validateFile',
                method: async(request) => {
                    try {
                        const { payload } = request;
                        if (!payload.file) {
                            return conflict('No se adjunto ningún archivo');
                        }

                        const result = await server.methods.validateMetadataFiles(payload.file);
                        if(!result) {
                            return conflict('File: Formato no permitido');
                        }

                        return true;
                    } catch (ex) {
                        throw ex;
                    }
                },
            }],
        },
        handler: async(request, h) => {
            try {
                const { payload } = request;
                const resultFile = await server.methods.uploadGCFiles(payload.file, `test`, true);
                return h.response({
                    urlFile: resultFile,
                    message: 'Upload file success'
                }).code(200);
            } catch (e) {
                error('Error Upload File', e);
                return badImplementation('process failed');
            }
        },
    });

};