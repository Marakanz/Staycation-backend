import cloudinary from "cloudinary";

console.log(process.env.CLOUD_NAME)

const cloud = cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_KEY, 
    api_secret: process.env.CLOUD_KEY_SECRET
})

export default cloud;



