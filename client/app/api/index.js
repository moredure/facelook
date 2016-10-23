import {DOM} from 'rx-dom';
import {FACE_DETECTION_ENDPOINT} from '../config';

/**
 * Call to /detect API endpoint to detect faces on an image
 * @param  {File} file image to upload
 * @return {Observable} ajax observable
 */
export function faceDetectionAPI(file) {
  let form = new FormData();
  form.append('file', file);
  const detectFaceCall$ = DOM.post({
    url: FACE_DETECTION_ENDPOINT,
    responseType: 'json',
    body: form
  });
  const fileAsDataURI$ = DOM.fromReader(file).asDataURL();
  return detectFaceCall$.concat(fileAsDataURI$);
}
