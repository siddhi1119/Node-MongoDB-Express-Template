import axios from "axios";
import FormData from "form-data";


const uploadImage = async (image) => {
    if (!image) return null;

    const imgbbApiKey = process?.env?.IMGBB_API_KEY;

    const imageUploadPromises = image.map(async (images) => {
        const formData = new FormData();
        formData.append('image', images);

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
            headers: {            
                ...formData.getHeaders()
            },
            data: formData
        };
    

    try{
        const response = await axios.request(config);
        return response?.data?.data?.display_url;
    } catch (error){
        console.error('Error uploading image:', error);
        throw new Error('Image upload failed');
    }
});

return Promise.all(imageUploadPromises);
}


export {  
    uploadImage
  };