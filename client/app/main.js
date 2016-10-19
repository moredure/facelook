import * as Rx from 'rx-dom';
const {Observable, DOM} = Rx;
const {post, fromEvent, fromReader} = DOM;
const uploadInput = document.getElementById('js-files');
const dropZone = document.querySelector('#js-drop-files');
let lastEnter;
let uploadInput$ = fromEvent(uploadInput, 'change');
let dropZone$ = fromEvent(dropZone, 'drop');

const dragOver$ = Observable.merge(
  fromEvent(dropZone, 'dragover'),
  fromEvent(document, 'dragenter'))
  .do(activateUploadBox);

const dragLeave$ = Observable.merge(
  fromEvent(document, 'dragleave'),
  dropZone$)
  .do(deactivateUploadBox);

Observable
.merge(dragOver$, dragLeave$)
.subscribe();

const upload$ = Observable
.merge(dropZone$, uploadInput$)
.map(normalizeFiles)
.map(toArray)
.flatMap(files => Observable.from(files))
.filter(isImage)
.flatMap(faceDetectionAPI)
.bufferWithCount(2)
.flatMap(normalizeForCanvassing)
.bufferWithCount(2)
.map(processFaces);

upload$.subscribe(renderToResults);

/**
 * Process faces on canvas
 * @param  {Array} faces [description]
 * @param  {Image} photo [description]
 * @return {Image} image
 */
function processFaces([faces, photo]) {
  if (faces.length) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d");
    [canvas.width, canvas.height] = [photo.width, photo.height];
    ctx.drawImage(photo, 0, 0);
    ctx.lineWidth = "5";
    ctx.strokeStyle = "#507299";
    faces.forEach(face => ctx.strokeRect(...face));
    photo.src = canvas.toDataURL("image/png");
  } else photo.classList.add('js-no-faces');
  return photo;
}

/**
 * Render Images to results list
 * @param {Image} image image to render
 */
function renderToResults(image) {
  console.info(image);
}

/**
 * Normalize for easy rendering
 * @param  {Response} jsonResponse [description]
 * @param  {String} imgAsURI [description]
 * @return {Observable} pair of canvassing primitives
 */
function normalizeForCanvassing([jsonResponse, imgAsURI]) {
  let faceless = new Image();
  faceless.src = imgAsURI;
  const faceless$ = Observable.of(faceless);
  const detectFaceCallResponse$ = Observable.of(jsonResponse.response);
  return Observable.concat(detectFaceCallResponse$, faceless$);
}

/**
 * Test file media type to be image
 * @param  {File}  file tested file
 * @return {Boolean} is image or not
 */
function isImage({type}) {
  return type.match('image.*');
}

/**
 * Call to /detect API endpoint to detect faces on an image
 * @param  {File} file image to upload
 * @return {Observable} ajax observable
 */
function faceDetectionAPI(file) {
  let form = new FormData();
  form.append('file', file);
  const detectFaceCall$ = post({
    url: '/detect',
    responseType: 'json',
    body: form
  });
  const fileAsDataURI$ = fromReader(file).asDataURL();
  return Observable.concat(
    detectFaceCall$,
    fileAsDataURI$
  );
}

/**
 * Convert an array-like object to Js array
 * @param  {Object} arrayLikeObject array like obj
 * @return {Array} converted array
 */
function toArray(arrayLikeObject) {
  return Array.prototype.slice.call(arrayLikeObject);
}

/**
 * This function adds class to show drop zone
 * @param {Event} ev DOM enent
 */
function activateUploadBox(ev) {
  ev.preventDefault();
  lastEnter = ev.target;
  dropZone.classList.add('b-upload-box--active');
}

/**
 * This function removes class to show drop zone
 * @param {Event} ev DOM event
 */
function deactivateUploadBox(ev) {
  ev.preventDefault();
  if (lastEnter === ev.target) {
    dropZone.classList.remove('b-upload-box--active');
  }
}

/**
 * Normalize different event types and extract files from them
 * @param  {Object} options.dataTransfer data transfer object
 * @param  {Object} options.target target html object
 * @return {File} file with image
 */
function normalizeFiles({dataTransfer, target}) {
  return dataTransfer ? dataTransfer.files : target.files;
}
