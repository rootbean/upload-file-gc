const { Storage } = require('@google-cloud/storage');

const { BUCKET_NAME, PROJECT_ID_GC, URL_IMAGES_GC } = process.env;
// Creates a client
const storage = new Storage({
    projectId: PROJECT_ID_GC,
    keyFilename: './serviceAccountKey.json',
});

const getPublicUrl = filename => `${URL_IMAGES_GC}/${filename}`;

const imageFilter = (file) => {
    // accept image only
    const fileName = file.headers['content-type'];
    return fileName.match(/image\/jpg|jpeg|png|gif$/);
};

const fileFilter = (file) => {
    // accept pdf only
    const fileName = file.headers['content-type'];
    return fileName.match(/image\/png|jpeg$/);
};

const upload = async(fileUpload, pathImage, isPublic) => {
    try {
        const { headers, path } = fileUpload;
        const options = {
            metadata: {
                contentType: headers['content-type'],
            },
        };
    
        const resultStorage = await storage.bucket(BUCKET_NAME).upload(path, options);
        
        let newPath;
        if (pathImage && resultStorage) {
            const dataFile = resultStorage[0].metadata;
            newPath = `${pathImage}/${dataFile.name}`;
            await storage.bucket(BUCKET_NAME).file(dataFile.name).move(newPath);
        }
        
        if (isPublic) {
            await storage.bucket(BUCKET_NAME).file(newPath).makePublic();
        }
        const url = getPublicUrl(newPath);
        return url;
    } catch (ex) {
        throw ex;
    }
};

const deleteFile = async(urlImage) => {
    try {
        const urlStart = `https://storage.googleapis.com/${BUCKET_NAME}`;
        const newUrlImage = urlImage.replace(urlStart, '');
        return await storage.bucket(BUCKET_NAME).file(newUrlImage).delete();
    } catch (ex) {
        throw ex;
    }
};

exports.uploadFile = async(file, pathUpload, isPublic) => {
    try {
        return await upload(file, pathUpload, isPublic);
    } catch (ex) {
        throw ex;
    }
};

exports.validateMetadataImages = (file) => {
    try {
        return imageFilter(file);
    } catch (ex) {
        throw ex;
    }
};

exports.validateMetadataFiles = (file) => {
    try {
        return fileFilter(file);
    } catch (ex) {
        throw ex;
    }
};

exports.deleteFile = async(urlImage) => {
    try {
        return await deleteFile(urlImage);
    } catch (ex) {
        throw ex;
    }
};

exports.securityFile = async(urlImage, isPublic) => {
    try {
        const urlStart = `https://storage.googleapis.com/${BUCKET_NAME}`;
        const newUrlImage = urlImage.replace(urlStart, '');
        if (isPublic) {
            return await storage.bucket(BUCKET_NAME).file(newUrlImage).makePublic();
        } else {
            return await storage.bucket(BUCKET_NAME).file(newUrlImage).makePrivate();
        }
    } catch (ex) {
        throw ex;
    }
}

exports.downloadFile = async(urlImage) => {
    try {
        const dataImage = {};
        const urlStart = `https://storage.googleapis.com/${BUCKET_NAME}`;
        const newUrlImage = urlImage.replace(urlStart, '');
        dataImage.image = await storage.bucket(BUCKET_NAME).file(newUrlImage).createReadStream();
        const [metadata] = await storage.bucket(BUCKET_NAME).file(newUrlImage).getMetadata();
        dataImage.metadata = metadata;
        return dataImage;
    } catch (ex) {
        throw ex;
    }
}