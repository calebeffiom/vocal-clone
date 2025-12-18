import { v2 as cloudinary } from 'cloudinary';
// Configuration
const {
    CLOUDINARY_API_KEY,
    CLOUDINARY_SECRET,
    CLOUDINARY_NAME
} = process.env;
cloudinary.config({
    cloud_name: CLOUDINARY_NAME as string,
    api_key: CLOUDINARY_API_KEY as string,
    api_secret: CLOUDINARY_SECRET as string
});

export default cloudinary