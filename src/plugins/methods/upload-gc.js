const { name, version } = require('../../../package.json');
const {
    uploadFile,
    deleteFile,
    validateMetadataImages,
    validateMetadataFiles,
    securityFile,
    downloadFile,
} = require('../../utils/upload-file');
/**
 * @module upload-file-plugin
 */
exports.plugin = {
    name: `${name}:methods:upload-file`,
    version,
};

/**
 * @async
 * @function catalog-manager-plugin/register
 * @param {object} server
 * @param {object} options
 */
exports.plugin.register = async(server) => {
    server.method('uploadGCFiles', async(files, pathUpload, isPublic) => {
        try {
            return await uploadFile(files, pathUpload, isPublic);
        } catch (ex) {
            throw ex;
        }
    });

    server.method('validateMetadataImages', async(file) => {
        try {
            return await validateMetadataImages(file);
        } catch (ex) {
            throw ex;
        }
    });

    server.method('validateMetadataFiles', async(file) => {
        try {
            return await validateMetadataFiles(file);
        } catch (ex) {
            throw ex;
        }
    });

    server.method('deleteFile', async(urlFile) => {
        try {
            return await deleteFile(urlFile);
        } catch (ex) {
            throw ex;
        }
    });

    server.method('securityFile', async(urlFile, isPublic) => {
        try {
            return await securityFile(urlFile, isPublic);
        } catch (ex) {
            throw ex;
        }
    });

    server.method('downloadFile', async(urlFile) => {
        try {
            return await downloadFile(urlFile);
        } catch (ex) {
            throw ex;
        }
    });
};