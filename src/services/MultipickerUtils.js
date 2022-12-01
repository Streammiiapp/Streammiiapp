import ImageCropPicker from 'react-native-image-crop-picker';
import MultiPicker from 'react-native-image-crop-picker';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';

import utility from '../utility';

const VIDEO_PICKER_OPTIONS = {
   mediaType: 'video',
   videoQuality: 'medium',
   durationLimit: 120,
   allowsEditing: true,
   storageOptions: {
      cameraRoll: true,
      waitUntilSaved: true,
   },
};

const IMAGE_CONFIG = {
   multiple: true,
   maxFiles: 6,
   mediaType: 'photo',
   // compressImageMaxWidth: 1024,
   // compressImageMaxHeight: 1024,
   // compressImageQuality: 1,
};

const IMAGE_CONFIG_LOW_QUALITY = {
   // compressImageMaxWidth: 800,
   // compressImageMaxHeight: 600,
   compressImageQuality: 1,
};

const CROP_CONFIG = {
   // width: 1600,
   // height: 1200,
   avoidEmptySpaceAroundImage: true,
};

const IMAGE_PICKER_CONST = {
   mediaType: 'video',
   videoQuality: 'high',
};

// const openImagePickerVideoGallery = cb => {
//   launchImageLibrary(IMAGE_PICKER_CONST, ({uri}) => {
//     uri &&
//       cb({
//         mime: getUriType(uri),
//         path: uri,
//       });
//   });
// };
// ImagePicker.launchImageLibrary(IMAGE_PICKER_CONST, cb);

const getUriType = uri => {
   const uriParts = uri.split('.');
   const fileType = uriParts[uriParts.length - 1];
   return fileType;
};

// returns promise
const selectMultipleImages = (
   config: Object = utility.isPlatformAndroid()
      ? {
         ...IMAGE_CONFIG_LOW_QUALITY,
         multiple: true,
         maxFiles: 6,
      }
      : IMAGE_CONFIG,
) => MultiPicker.openPicker(config);

const selectSingleImage = (config: Object = IMAGE_CONFIG) =>
   MultiPicker.openPicker({
      ...config,
      multiple: false,
      mediaType: 'photo',
      compressImageQuality: 1,
   });




const recordVideo = async () => {
   try {
      const video = await ImagePicker.openCamera({
         mediaType: "video",

      })
      const meta_data = { height: video.height, width: video.width, size: video.size }

      return {
         url: video.path,
         type: video.mime,
         ext: video.filename?.split('.').pop() ?? 'mp4',
         meta_data: meta_data
      }
   } catch (error) {
      global.log({ error });
   }

}

const pickImageOrVideo = async () => {
   try {
      const media = await MultiPicker.openPicker({
         mediaType: 'any',
         width: 300,
         height: 400,
         //    cropping: true,
      })
      const meta_data = { height: media.height, width: media.width, size: media.size }
      return {
         url: media.path,
         type: media.mime,
         name: media.mime?.split('/')[0],
         ext: media.filename?.split('.').pop() ?? `png`,
         meta_data: meta_data
      }
   } catch (error) {
      global.log({ error });
   }

}


const captureImage = async () => {
   try {
      const media = await ImagePicker.openCamera({
         mediaType: 'any',
         width: 300,
         height: 400,
         cropping: true,
      })
      const meta_data = { height: media.height, width: media.width, size: media.size }

      return {
         url: media.path,
         type: media.mime,
         ext: media.filename?.split('.').pop() ?? `png`,
         meta_data: meta_data
      }
   } catch (error) {
      global.log({ error });
   }

}


const selectVideo = () =>
   MultiPicker.openPicker({
      mediaType: 'any',
   });

const selectCameraVideo = () =>
   MultiPicker.openPicker({
      mediaType: 'video',
   });

const selectCameraVideoOrImage = () =>


   MultiPicker.openCamera({
      mediaType: 'any',
      cropping: false
      ,
   })






const selectCameraImage = () =>
   MultiPicker.openCamera(
      utility.isPlatformAndroid() ? IMAGE_CONFIG_LOW_QUALITY : {},
   );

//const pickVideo = (cb) => ImagePicker.showImagePicker(VIDEO_PICKER_OPTIONS, (video) => cb(video));

const cropImage = imgObj => {
   return MultiPicker.openCropper({ ...imgObj, ...CROP_CONFIG });
};

export {
   selectMultipleImages,
   selectVideo,
   selectSingleImage,
   selectCameraVideo,
   cropImage,
   IMAGE_CONFIG_LOW_QUALITY,
   //pickVideo,
   selectCameraImage,
   selectCameraVideoOrImage,
   recordVideo,
   pickImageOrVideo,
   captureImage

   // openImagePickerVideoGallery,
   // openGallery,
};
