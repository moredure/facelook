import {DOM} from 'rx-dom';
import {FACE_DETECTION_ENDPOINT} from '../config';
const {post, fromReader} = DOM;

export const fileAsDataURI$ = file => fromReader(file).asDataURL();

export const detectFaceCall$ = file => {
  let form = new FormData();
  form.append('file', file);
  return post({
    url: FACE_DETECTION_ENDPOINT,
    responseType: 'json',
    body: form
  });
};

/**
 * Call to /detect API endpoint to detect faces on an image and
 * concat to the result file asDataUri
 * @param  {File} file image to upload
 * @return {Observable} ajax observable
 */
export function faceDetectionAPI(file) {
  return detectFaceCall$(file)
    .concat(fileAsDataURI$(file));
}
