import {Observable} from 'rx-dom';
import {MAX_FILE_SIZE, EXTENSIONS_WHITELIST} from '../config';

/**
 * isLowerThenMaxFileSize
 * @param  {File}  file - Checked file
 * @return {Boolean} result of checking file size
 */
export function isLowerThenMaxFileSize(file) {
  return file.size <= MAX_FILE_SIZE;
}

/**
 * filterMaxFileSize
 * @param  {Array} files array of files to filter based on file size
 * @return {Array} filtered array
 */
export function filterMaxFileSize(files) {
  return files.filter(isLowerThenMaxFileSize);
}

/**
 * Check file extension to be in whitelist
 * @param  {File}  f file which will be checked by this predicate
 * @return {Boolean} result of checking extension
 */
export function isInWhiteList({type}) {
  return type.match(EXTENSIONS_WHITELIST.join('|'));
}

/**
 * Pass elements of array only in white list
 * @param  {Array} files array of files
 * @return {Array} files after filtering
 */
export function filterImagesInWhiteList(files) {
  return files.filter(isInWhiteList);
}

/**
 * Converts object to observable;
 * Converts object to observable;

 * @param  {Object} el element to convert
 * @return {Observable} observable
 */
export function toObservable(el) {
  return Observable.from(el);
}

/**
 * Filter only images from array
 * @param  {Array} files array of files
 * @return {Array}  array without non-images elements
 */
export function filterImages(files) {
  return files.filter(isImage);
}

/**
 * Remove all child nodes
 * @param  {Node} node html element
 */
export function removeChildren(node) {
  node.innerHTML = '';
}

/**
 * Process faces on canvas
 * @param  {Array} faces [description]
 * @param  {Image} photo [description]
 * @return {Image} image
 */
export function renderFaces([faces, photo]) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext("2d");
  [canvas.width, canvas.height] = [photo.width, photo.height];
  ctx.drawImage(photo, 0, 0);
  if (faces.length) {
    ctx.lineWidth = "5";
    ctx.strokeStyle = '#507299';
    faces.forEach(face => ctx.strokeRect(...face));
  } else {
    let base = canvas.height < canvas.width ? canvas.height : canvas.width;
    let radius = base * 0.05;
    let position = radius * 1.5;
    ctx.arc(position, position, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#fff';
    ctx.stroke();
  }
  photo.src = canvas.toDataURL("image/png", 1.0);
  photo.classList.add('b-results__image');
  return photo;
}

/**
 * Normalize for easy rendering
 * @param  {Response} response [description]
 * @param  {String} imgAsURI [description]
 * @return {Observable} pair of canvassing primitives
 */
export function normalizeForCanvassing([response, imgAsURI]) {
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
export function isImage({type}) {
  return type.match('image.*');
}

/**
 * Convert an array-like object to Js array
 * @param  {Object} arrayLikeObject array like obj
 * @return {Array} converted array
 */
export function toArray(arrayLikeObject) {
  return Array.prototype.slice.call(arrayLikeObject);
}

/**
 * Normalize different event types and extract files from them
 * @param  {Object} options.dataTransfer data transfer object
 * @param  {Object} options.target target html object
 * @return {File} file with image
 */
export function normalizeFiles({dataTransfer, target}) {
  return dataTransfer ? dataTransfer.files : target.files;
}
