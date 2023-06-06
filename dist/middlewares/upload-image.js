"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMediaFiles = exports.uploadReviewFiles = exports.uploadUpdatedMenuImages = exports.uploadCandidateRestaurantImages = exports.uploadProfileImages = void 0;
const storage_1 = require("@google-cloud/storage");
const path_1 = __importDefault(require("path"));
const secret_manager_1 = require("@google-cloud/secret-manager");
let keyFilenameContent;
if (process.env.NODE_ENV === 'production') {
    const client = new secret_manager_1.SecretManagerServiceClient();
    const secretName = `projects/${process.env.PROJECT_ID}/secrets/RateEat_Storage_Bucket/versions/latest`;
    (function fetchSecret() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const [version] = yield client.accessSecretVersion({ name: secretName });
            keyFilenameContent = (_b = (_a = version.payload) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.toString();
        });
    })();
}
else if (process.env.NODE_ENV === 'development') {
    keyFilenameContent = "./storage_bucket_credentials.json";
}
const storage = new storage_1.Storage({
    keyFilename: keyFilenameContent,
});
const bucketName = "rateeat_bucket";
const bucket = storage.bucket(bucketName);
function uploadProfileImages(req, res, next) {
    const file = req.file; // Get the file from the request
    if (!file) {
        return next();
    }
    // Create a unique file name for storage (adjust as needed)
    const uniqueFileName = Date.now() + path_1.default.extname(file.originalname);
    const destination = `RateEat/ProfileImages/${uniqueFileName}`;
    bucket.upload(file.path, { destination }, (err, gcsFile) => {
        if (err) {
            console.error(`Error uploading image ${uniqueFileName}: ${err}`);
            return next(err);
        }
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsFile.name}`;
        req.googleStoragePublicUrl = publicUrl;
        next();
    });
}
exports.uploadProfileImages = uploadProfileImages;
function uploadCandidateRestaurantImages(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const menuImages = req.files["menuImages"];
        const licenseImage = req.files["licenseImage"];
        // Check if there are no files to upload
        if (!menuImages.length) {
            return next();
        }
        const publicUrlsMenu = [];
        const publicUrlsLicense = [];
        try {
            // Upload menuImages
            for (const file of menuImages) {
                const uniqueFileName = Date.now() + path_1.default.extname(file.originalname);
                const destination = `RateEat/CandidateMenuImages/${uniqueFileName}`;
                const [gcsFile] = yield bucket.upload(file.path, { destination });
                const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsFile.name}`;
                publicUrlsMenu.push(publicUrl);
            }
            if (licenseImage) {
                // Upload licenseImage
                for (const file of licenseImage) {
                    const uniqueFileName = Date.now() + path_1.default.extname(file.originalname);
                    const destination = `RateEat/LicenseImages/${uniqueFileName}`;
                    const [gcsFile] = yield bucket.upload(file.path, { destination });
                    const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsFile.name}`;
                    publicUrlsLicense.push(publicUrl);
                }
            }
            // Assign URLs to request object
            req.menuImages = publicUrlsMenu;
            req.licenseImage = publicUrlsLicense;
            req.googleStoragePublicUrl = publicUrlsMenu[0];
            next();
        }
        catch (error) {
            console.error(`Error uploading images: ${error}`);
            next(error);
        }
    });
}
exports.uploadCandidateRestaurantImages = uploadCandidateRestaurantImages;
function uploadUpdatedMenuImages(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedMenuImages = req.files["updatedMenuImages"];
        // Check if there are no files to upload
        if (!updatedMenuImages.length) {
            return next();
        }
        const publicUrlUpdatedMenu = [];
        try {
            // Upload updatedMenuImages
            for (const file of updatedMenuImages) {
                const uniqueFileName = Date.now() + path_1.default.extname(file.originalname);
                const destination = `RateEat/UpdatedMenuImages/${uniqueFileName}`;
                const [gcsFile] = yield bucket.upload(file.path, { destination });
                const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsFile.name}`;
                publicUrlUpdatedMenu.push(publicUrl);
            }
            // Assign URLs to request object
            req.updatedMenuImages = publicUrlUpdatedMenu;
            next();
        }
        catch (error) {
            console.error(`Error uploading images: ${error}`);
            next(error);
        }
    });
}
exports.uploadUpdatedMenuImages = uploadUpdatedMenuImages;
function uploadReviewFiles(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const itemReviewImages = req.files["item_review_images"];
        const itemReviewVideos = req.files["item_review_videos"];
        const restaurantReviewImages = req.files["restaurant_review_images"];
        const restaurantReviewVideos = req.files["restaurant_review_videos"];
        // Check if there are no files to upload
        if (!itemReviewImages && !itemReviewVideos && !restaurantReviewImages && !restaurantReviewVideos) {
            return next();
        }
        const itemReviewImagesUrls = [];
        const itemReviewVideosUrls = [];
        const RestaurantReviewImagesUrls = [];
        const RestaurantReviewVideosUrls = [];
        try {
            // Upload itemReviewImagse
            if (itemReviewImages) {
                for (const file of itemReviewImages) {
                    const uniqueFileName = Date.now() + path_1.default.extname(file.originalname);
                    const destination = `RateEat/ItemReviewImages/${uniqueFileName}`;
                    const [gcsFile] = yield bucket.upload(file.path, { destination });
                    const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsFile.name}`;
                    itemReviewImagesUrls.push(publicUrl);
                }
                req.reviewImages = itemReviewImagesUrls;
            }
            if (itemReviewVideos) {
                for (const file of itemReviewVideos) {
                    const uniqueFileName = Date.now() + path_1.default.extname(file.originalname);
                    const destination = `RateEat/ItemReviewVideos/${uniqueFileName}`;
                    const [gcsFile] = yield bucket.upload(file.path, { destination });
                    const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsFile.name}`;
                    itemReviewVideosUrls.push(publicUrl);
                }
                req.reviewVideos = itemReviewVideosUrls;
            }
            if (restaurantReviewImages) {
                for (const file of restaurantReviewImages) {
                    const uniqueFileName = Date.now() + path_1.default.extname(file.originalname);
                    const destination = `RateEat/RestaurantReviewImages/${uniqueFileName}`;
                    const [gcsFile] = yield bucket.upload(file.path, { destination });
                    const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsFile.name}`;
                    RestaurantReviewImagesUrls.push(publicUrl);
                }
                req.reviewImages = RestaurantReviewImagesUrls;
            }
            if (restaurantReviewVideos) {
                for (const file of restaurantReviewVideos) {
                    const uniqueFileName = Date.now() + path_1.default.extname(file.originalname);
                    const destination = `RateEat/RestaurantReviewVideos/${uniqueFileName}`;
                    const [gcsFile] = yield bucket.upload(file.path, { destination });
                    const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsFile.name}`;
                    RestaurantReviewVideosUrls.push(publicUrl);
                }
                req.reviewVideos = RestaurantReviewVideosUrls;
            }
            next();
        }
        catch (error) {
            console.error(`Error uploading media: ${error}`);
            next(error);
        }
    });
}
exports.uploadReviewFiles = uploadReviewFiles;
function uploadMediaFiles(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const itemImages = req.files["item_images"];
        const itemVideos = req.files["item_videos"];
        const restaurantImages = req.files["restaurant_images"];
        const restaurantVideos = req.files["restaurant_videos"];
        // Check if there are no files to upload
        if (!itemImages && !itemVideos && !restaurantImages && !restaurantVideos) {
            return next();
        }
        const itemImagesUrls = [];
        const itemVideosUrls = [];
        const RestaurantImagesUrls = [];
        const RestaurantVideosUrls = [];
        try {
            // Upload itemImage
            if (itemImages) {
                for (const file of itemImages) {
                    const uniqueFileName = Date.now() + path_1.default.extname(file.originalname);
                    const destination = `RateEat/ItemImages/${uniqueFileName}`;
                    const [gcsFile] = yield bucket.upload(file.path, { destination });
                    const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsFile.name}`;
                    itemImagesUrls.push(publicUrl);
                }
                req.mediaImages = itemImagesUrls;
            }
            // Upload itemVideo
            if (itemVideos) {
                for (const file of itemVideos) {
                    const uniqueFileName = Date.now() + path_1.default.extname(file.originalname);
                    const destination = `RateEat/ItemVideos/${uniqueFileName}`;
                    const [gcsFile] = yield bucket.upload(file.path, { destination });
                    const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsFile.name}`;
                    itemVideosUrls.push(publicUrl);
                }
                req.mediaVideos = itemVideosUrls;
            }
            // upload restaurantImage
            if (restaurantImages) {
                for (const file of restaurantImages) {
                    const uniqueFileName = Date.now() + path_1.default.extname(file.originalname);
                    const destination = `RateEat/RestaurantImages/${uniqueFileName}`;
                    const [gcsFile] = yield bucket.upload(file.path, { destination });
                    const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsFile.name}`;
                    RestaurantImagesUrls.push(publicUrl);
                }
                req.mediaImages = RestaurantImagesUrls;
            }
            // upload restaurantVideo
            if (restaurantVideos) {
                for (const file of restaurantVideos) {
                    const uniqueFileName = Date.now() + path_1.default.extname(file.originalname);
                    const destination = `RateEat/RestaurantVideos/${uniqueFileName}`;
                    const [gcsFile] = yield bucket.upload(file.path, { destination });
                    const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsFile.name}`;
                    RestaurantVideosUrls.push(publicUrl);
                }
                req.mediaVideos = RestaurantVideosUrls;
            }
            next();
        }
        catch (error) {
            console.error(`Error uploading media: ${error}`);
            next(error);
        }
    });
}
exports.uploadMediaFiles = uploadMediaFiles;
