// Require the cloudinary library
require('dotenv').config()
const cloudinary = require('cloudinary').v2;
// Need to get the rest of the data and return it to map over in the template (context, and other sizes for srcset).


//Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true
});

module.exports = async function(){

  try {
      // Get details about the asset
      const data = await cloudinary.api.resources({
        type: 'upload', 
        resource_type: 'image',
        prefix: 'schmidty_notes',
        context: true,
        max_results:500
      })
      const imageData = data.resources.map(resource =>{
        const extraSmallImage = cloudinary.url(resource.public_id, {width:300, height:350,crop:"limit"})
        const smallImage = cloudinary.url(resource.public_id, {width:600, height:600,crop:"limit"})
        const mediumImage = cloudinary.url(resource.public_id, {width:1000, height:1000,crop:"limit"})
        const largeImage = cloudinary.url(resource.public_id, {width:1500, height:1500,crop:"limit"})
        const extraLargeImage = cloudinary.url(resource.public_id, {width:2200, height:2200,crop:"limit"})
        return {...resource, extraSmallImage, smallImage, mediumImage, largeImage, extraLargeImage}
      })
      
      console.log(imageData);
      console.log(imageData[1].context)
      return imageData;
      } catch (error) {
      console.error(error);
  }
}

