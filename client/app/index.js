/* global NODE_ENV */
import './styles/index.scss';
import {Observable, DOM} from 'rx-dom';

if (NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/static/cache.js')
    .then(console.info.bind(console, 'Worker installed:'))
    .catch(console.error.bind(console, 'Error:'));
  }
}

const {post, fromEvent, fromReader, click} = DOM;
const {getElementById, createElement, getElementsByClassName} = document;
const uploadInput = getElementById('js-files');
const dropZone = getElementById('js-drop-files');
const results = getElementById('js-results');
const resultsClose = getElementById('js-results__close');
const resultsImages = getElementById('js-results__images');
const uploadInput$ = fromEvent(uploadInput, 'change');
const dropZone$ = fromEvent(dropZone, 'drop');
let lastEnter;

const dragOver$ = fromEvent(dropZone, 'dragover')
.merge(fromEvent(document, 'dragenter'))
.do(activateUploadBox);

const dragLeave$ = fromEvent(document, 'dragleave')
.merge(dropZone$)
.do(deactivateUploadBox);

const dragEffects$ = dragOver$.merge(dragLeave$);

const upload$ = Observable
.merge(dropZone$, uploadInput$)
.map(normalizeFiles)
.map(toArray)
.map(filterImages)
.do(wait)
.flatMap(toObservable)
.do(loadStart)
.flatMap(faceDetectionAPI)
.bufferWithCount(2)
.flatMap(normalizeForCanvassing)
.bufferWithCount(2)
.map(processFaces)
.do(renderToResults);

const resultsClose$ = click(results)
.filter(exitableTargets)
.do(clearResultsImages);

upload$
.merge(dragEffects$)
.merge(resultsClose$)
.subscribe();

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
  let loadBar = createElement('div');
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
  let loadBar = toArray(getElementsByClassName('b-results__loading')).shift();
  resultsImages.replaceChild(image, loadBar);
}

/**
 * Process faces on canvas
 * @param  {Array} faces [description]
 * @param  {Image} photo [description]
 * @return {Image} image
 */
function processFaces([faces, photo]) {
  const canvas = createElement('canvas');
  const ctx = canvas.getContext("2d");
  [canvas.width, canvas.height] = [photo.width, photo.height];
  ctx.drawImage(photo, 0, 0);
  if (faces.length) {
    ctx.lineWidth = "5";
    ctx.strokeStyle = "#507299";
    faces.forEach(face => ctx.strokeRect(...face));
    photo.src = canvas.toDataURL("image/png");
  }
  photo.classList.add('b-results__image');
  return photo;
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
    url: '/detect',
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

