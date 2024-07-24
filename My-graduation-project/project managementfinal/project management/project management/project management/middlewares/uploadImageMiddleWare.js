const multer = require('multer');
const ApiError = require('../utils/apiError'); // Adjust the path to your ApiError file if needed

const multerOptions = () => {
    const multerStorage = multer.memoryStorage();
  
    const multerFilter = function (req, file, cb) {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new ApiError('Only Images allowed', 400), false);
        }
    };
  
    const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
    return upload;
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMixOfImages = (arrayOfFields) => multerOptions().fields(arrayOfFields);
