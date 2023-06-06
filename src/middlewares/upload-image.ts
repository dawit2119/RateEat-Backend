import { Request, Response, NextFunction } from "express";
import { Storage } from "@google-cloud/storage";
import path from "path";
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

export interface FileRequest extends Request {
  mediaImages: string[];
  mediaVideos: string[];
  googleStoragePublicUrl?: string;
  updatedMenuImages?: string[];
  menuImages?: string[];
  licenseImage?: string[];
  reviewImages?: string[];
  reviewVideos?: string[];
}

let keyFilenameContent;

if (process.env.NODE_ENV === 'production') {
  const client = new SecretManagerServiceClient();
  const secretName = `projects/${process.env.PROJECT_ID}/secrets/RateEat_Storage_Bucket/versions/latest`;
  (async function fetchSecret() {
    const [version] = await client.accessSecretVersion({ name: secretName });
    keyFilenameContent = version.payload?.data?.toString();
  })();
} else if (process.env.NODE_ENV === 'development') {
  keyFilenameContent = "./storage_bucket_credentials.json";
}

const storage = new Storage({
  keyFilename: keyFilenameContent,
});

const bucketName = "rateeat_bucket";
const bucket = storage.bucket(bucketName);

export function uploadProfileImages(
  req: FileRequest,
  res: Response,
  next: NextFunction,
) {
  const file = req.file; // Get the file from the request
  if (!file) {
    return next();
  }

  // Create a unique file name for storage (adjust as needed)
  const uniqueFileName = Date.now() + path.extname(file.originalname);
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

export async function uploadCandidateRestaurantImages(
  req: FileRequest,
  res: Response,
  next: NextFunction
) {
  const menuImages = req.files["menuImages"] as Express.Multer.File[];
  const licenseImage = req.files["licenseImage"] as Express.Multer.File[];

  // Check if there are no files to upload
  if (!menuImages.length) {
    return next();
  }

  const publicUrlsMenu: string[] = [];
  const publicUrlsLicense: string[] = [];

  try {
    // Upload menuImages
    for (const file of menuImages) {
      const uniqueFileName = Date.now() + path.extname(file.originalname);
      const destination = `RateEat/CandidateMenuImages/${uniqueFileName}`;
      const [gcsFile] = await bucket.upload(file.path, { destination });
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsFile.name}`;
      publicUrlsMenu.push(publicUrl);
    }
    
    if (licenseImage){
      // Upload licenseImage
      for (const file of licenseImage) {
        const uniqueFileName = Date.now() + path.extname(file.originalname);
        const destination = `RateEat/LicenseImages/${uniqueFileName}`;
        const [gcsFile] = await bucket.upload(file.path, { destination });
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsFile.name}`;
        publicUrlsLicense.push(publicUrl);
      }
    }
    // Assign URLs to request object
    req.menuImages = publicUrlsMenu;
    req.licenseImage = publicUrlsLicense;
    req.googleStoragePublicUrl = publicUrlsMenu[0];

    next();
  } catch (error) {
    console.error(`Error uploading images: ${error}`);
    next(error);
  }
}

export async function uploadUpdatedMenuImages(
  req: FileRequest,
  res: Response,
  next: NextFunction
) {
  const updatedMenuImages = req.files["updatedMenuImages"] as Express.Multer.File[];

  // Check if there are no files to upload
  if (!updatedMenuImages.length) {
    return next();
  }

  const publicUrlUpdatedMenu: string[] = [];

  try {
    // Upload updatedMenuImages
    for (const file of updatedMenuImages) {
      const uniqueFileName = Date.now() + path.extname(file.originalname);
      const destination = `RateEat/UpdatedMenuImages/${uniqueFileName}`;
      const [gcsFile] = await bucket.upload(file.path, { destination });
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsFile.name}`;
      publicUrlUpdatedMenu.push(publicUrl);
    }
    // Assign URLs to request object
    req.updatedMenuImages = publicUrlUpdatedMenu;

    next();
  } catch (error) {
    console.error(`Error uploading images: ${error}`);
    next(error);
  }
}

export async function uploadReviewFiles(
  req: FileRequest,
  res: Response,
  next: NextFunction
) {
  const itemReviewImages = req.files["item_review_images"] as Express.Multer.File[];
  const itemReviewVideos = req.files["item_review_videos"] as Express.Multer.File[];
  const restaurantReviewImages = req.files["restaurant_review_images"] as Express.Multer.File[];
  const restaurantReviewVideos = req.files["restaurant_review_videos"] as Express.Multer.File[];

  // Check if there are no files to upload
  if (!itemReviewImages && !itemReviewVideos && !restaurantReviewImages && !restaurantReviewVideos) {
    return next();
  }

  const itemReviewImagesUrls: string[] = [];
  const itemReviewVideosUrls: string[] = [];
  const RestaurantReviewImagesUrls: string[] = [];
  const RestaurantReviewVideosUrls: string[] = [];

  try {
    // Upload itemReviewImagse
    if (itemReviewImages){
    for (const file of itemReviewImages) {
      const uniqueFileName = Date.now() + path.extname(file.originalname);
      const destination = `RateEat/ItemReviewImages/${uniqueFileName}`;      
      const [gcsFile] = await bucket.upload(file.path, { destination });
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsFile.name}`;
      itemReviewImagesUrls.push(publicUrl);
    }
    req.reviewImages = itemReviewImagesUrls;
  }
  if (itemReviewVideos){
    for (const file of itemReviewVideos) {
      const uniqueFileName = Date.now() + path.extname(file.originalname);
      const destination = `RateEat/ItemReviewVideos/${uniqueFileName}`;      
      const [gcsFile] = await bucket.upload(file.path, { destination });
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsFile.name}`;
      itemReviewVideosUrls.push(publicUrl);
    }
    req.reviewVideos = itemReviewVideosUrls;
  }
  if (restaurantReviewImages){
    for (const file of restaurantReviewImages) {
      const uniqueFileName = Date.now() + path.extname(file.originalname);
      const destination = `RateEat/RestaurantReviewImages/${uniqueFileName}`;      
      const [gcsFile] = await bucket.upload(file.path, { destination });
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsFile.name}`;
      RestaurantReviewImagesUrls.push(publicUrl);
    }
    req.reviewImages = RestaurantReviewImagesUrls;
  }
  if (restaurantReviewVideos){
    for (const file of restaurantReviewVideos) {
      const uniqueFileName = Date.now() + path.extname(file.originalname);
      const destination = `RateEat/RestaurantReviewVideos/${uniqueFileName}`;      
      const [gcsFile] = await bucket.upload(file.path, { destination });
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsFile.name}`;
      RestaurantReviewVideosUrls.push(publicUrl);
    }
    req.reviewVideos = RestaurantReviewVideosUrls;
  }
    next();
  } catch (error) {
    console.error(`Error uploading media: ${error}`);
    next(error);
  }
}

export async function uploadMediaFiles(
  req: FileRequest,
  res: Response,
  next: NextFunction
) {
  const itemImages = req.files["item_images"] as Express.Multer.File[];
  const itemVideos = req.files["item_videos"] as Express.Multer.File[];
  const restaurantImages = req.files["restaurant_images"] as Express.Multer.File[];
  const restaurantVideos = req.files["restaurant_videos"] as Express.Multer.File[];

  // Check if there are no files to upload
  if (!itemImages && !itemVideos && !restaurantImages && !restaurantVideos) {
    return next();
  }

  const itemImagesUrls: string[] = [];
  const itemVideosUrls: string[] = [];
  const RestaurantImagesUrls: string[] = [];
  const RestaurantVideosUrls: string[] = [];

  try {
    // Upload itemImage
    if (itemImages){
    for (const file of itemImages) {
      const uniqueFileName = Date.now() + path.extname(file.originalname);
      const destination = `RateEat/ItemImages/${uniqueFileName}`;      
      const [gcsFile] = await bucket.upload(file.path, { destination });
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsFile.name}`;
      itemImagesUrls.push(publicUrl);
    }
    req.mediaImages = itemImagesUrls;
  }
  // Upload itemVideo
  if (itemVideos){
    for (const file of itemVideos) {
      const uniqueFileName = Date.now() + path.extname(file.originalname);
      const destination = `RateEat/ItemVideos/${uniqueFileName}`;      
      const [gcsFile] = await bucket.upload(file.path, { destination });
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsFile.name}`;
      itemVideosUrls.push(publicUrl);
    }
    req.mediaVideos = itemVideosUrls;
  }
  // upload restaurantImage
  if (restaurantImages){
    for (const file of restaurantImages) {
      const uniqueFileName = Date.now() + path.extname(file.originalname);
      const destination = `RateEat/RestaurantImages/${uniqueFileName}`;      
      const [gcsFile] = await bucket.upload(file.path, { destination });
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsFile.name}`;
      RestaurantImagesUrls.push(publicUrl);
    }
    req.mediaImages = RestaurantImagesUrls;
  }
  // upload restaurantVideo
  if (restaurantVideos){
    for (const file of restaurantVideos) {
      const uniqueFileName = Date.now() + path.extname(file.originalname);
      const destination = `RateEat/RestaurantVideos/${uniqueFileName}`;      
      const [gcsFile] = await bucket.upload(file.path, { destination });
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${gcsFile.name}`;
      RestaurantVideosUrls.push(publicUrl);
    }
    req.mediaVideos = RestaurantVideosUrls;
  }
    next();
  } catch (error) {
    console.error(`Error uploading media: ${error}`);
    next(error);
  }
}