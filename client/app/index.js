/* global NODE_ENV */
import './styles/index.scss';
import {Observable, DOM} from 'rx-dom';
const {post, fromEvent, fromReader, click} = DOM;

if (NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/cache.js')
      .then(console.info.bind(console, 'Worker installed:'))
      .catch(console.error.bind(console, 'Error:'));
  }
}

const API_ENDPOINT = '/api';
const EXTENSIONS_WHITELIST = ['png', 'jpeg', 'gif'];
const FACE_DETECTION_ENDPOINT = `${API_ENDPOINT}/detect`;
const uploadInput = document.getElementById('js-files');
const dropZone = document.getElementById('js-drop-files');
const results = document.getElementById('js-results');
const resultsClose = document.getElementById('js-results__close');
const resultsImages = document.getElementById('js-results__images');
const uploadInput$ = fromEvent(uploadInput, 'change');
const dropZone$ = fromEvent(dropZone, 'drop');
let lastEnter;

const dragOver$ = fromEvent(dropZone, 'dragover')
  .merge(fromEvent(document, 'dragenter'))
  .do(activateUploadBox);

const dragLeave$ = fromEvent(document, 'dragleave').merge(dropZone$)
  .do(deactivateUploadBox);

const dragEffects$ = dragOver$.merge(dragLeave$);

const upload$ = Observable
  .merge(dropZone$, uploadInput$)
  .map(normalizeFiles)
  .map(toArray)
  .map(filterImages)
  .map(filterImagesInWhiteList)
  .do(wait)
  .flatMap(toObservable)
  .do(loadStart)
  .concatMap(faceDetectionAPI)
  .bufferWithCount(2)
  .concatMap(normalizeForCanvassing)
  .bufferWithCount(2)
  .map(renderFaces)
  .do(renderToResults);

const resultsClose$ = click(results)
  .filter(exitableTargets)
  .do(clearResultsImages);

upload$
  .merge(dragEffects$)
  .merge(resultsClose$)
  .subscribe();

/**
 * Check file extension to be in whitelist
 * @param  {File}  f file which will be checked by this predicate
 * @return {Boolean} result of checking extension
 */
function isInWhiteList({type}) {
  return type.match(EXTENSIONS_WHITELIST.join('|'));
}

/**
 * Pass elements of array only in white list
 * @param  {Array} files array of files
 * @return {Array} files after filtering
 */
function filterImagesInWhiteList(files) {
  return files.filter(isInWhiteList);
}

/**
 * Clear html nodes from b-results__images
 */
function clearResultsImages() {
  results.classList.remove('b-results--active');
  removeChildren(resultsImages);
}

/**
 * Check event target to be in the exitable elements
 * @param  {Node} options.target html element which is source of the event
 * @return {Boolean} exitable or not
 */
function exitableTargets({target}) {
  return [resultsClose, results, resultsImages].includes(target);
}

/**
 * Converts object to observable
 * @param  {Object} el element to convert
 * @return {Observable} observable
 */
function toObservable(el) {
  return Observable.from(el);
}

/**
 * Add loading bar to the UI
 */
function loadStart() {
  const loadBar = document.createElement('div');
  loadBar.classList.add('b-results__loading');
  resultsImages.appendChild(loadBar);
}

/**
 * Filter only images from array
 * @param  {Array} files array of files
 * @return {Array}  array without non-images elements
 */
function filterImages(files) {
  return files.filter(isImage);
}

/**
 * Remove all child nodes
 * @param  {Node} node html element
 */
function removeChildren(node) {
  node.innerHTML = '';
}

/**
 * Loading state for css
 * @param {Array} files array of files
 */
function wait(files) {
  if (files.length) results.classList.add('b-results--active');
}

/**
 * Render Images to results list
 * @param {Image} image image to render
 */
function renderToResults(image) {
  const loadBars = document.getElementsByClassName('b-results__loading');
  const loadBar = toArray(loadBars).shift();
  resultsImages.replaceChild(image, loadBar);
}

/**
 * Process faces on canvas
 * @param  {Array} faces [description]
 * @param  {Image} photo [description]
 * @return {Image} image
 */
function renderFaces([faces, photo]) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext("2d");
  [canvas.width, canvas.height] = [photo.width, photo.height];
  ctx.drawImage(photo, 0, 0);
  if (faces.length) {
    ctx.lineWidth = "5";
    ctx.strokeStyle = '#507299';
    faces.forEach(face => ctx.strokeRect(...face));
    ctx.arc(25, 20, 10, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#507299';
  } else {
    ctx.arc(25, 20, 10, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'tomato';
  }
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#fff';
  ctx.stroke();
  photo.src = canvas.toDataURL("image/png");
  photo.classList.add('b-results__image');
  return photo;
}

/**
 * Normalize for easy rendering
 * @param  {Response} response [description]
 * @param  {String} imgAsURI [description]
 * @return {Observable} pair of canvassing primitives
 */
function normalizeForCanvassing([response, imgAsURI]) {
  let faceless = new Image();
  faceless.src = imgAsURI;
  const faceless$ = Observable.return(faceless);
  const detectFaceCallResponse$ = Observable.return(response.response);
  return detectFaceCallResponse$.concat(faceless$);
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
    url: FACE_DETECTION_ENDPOINT,
    responseType: 'json',
    body: form
  });
  const fileAsDataURI$ = fromReader(file).asDataURL();
  return detectFaceCall$.concat(fileAsDataURI$);
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

