require("dotenv").config()
const cloudinary = require('cloudinary').v2


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
    secure: true
  });


  const uploadImage =(stream,folder)=>{
      
    return new Promise((resolve, reject)=>{
        let cloudinaryStream = cloudinary.uploader.upload_stream({folder, resource_type: "image" }, 
            (error,result)=>{
            if(result){
                resolve(result)
                return
            }else{
                reject(error)
            }
        }) 
        stream.pipe(cloudinaryStream)
    })

  }
  module.exports= {uploadImage}