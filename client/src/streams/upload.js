import {Observable, DOM} from 'rx-dom';
import {faceDetectionAPI} from '../api';
import {dropZone$} from './dragndrop';
import {resultsClose$} from './close';
import {
  normalizeFiles, toArray,
  filterMaxFileSize, filterImages,
  filterImagesInWhiteList, toObservable,
  normalizeForCanvassing, renderFaces
} from './image-processor';

const uploadInput = document.getElementById('js-files');
const results = document.getElementById('js-results');
const resultsImages = document.getElementById('js-results__images');
const uploadInput$ = DOM.fromEvent(uploadInput, 'change');

export const upload$ = dropZone$
  .merge(uploadInput$)
  .flatMap(processFacesFactory)
  .do(renderToResults);

/**
 * Process faces and then render it on canvas
 * @param  {Event} ev file change or drag & drop event
 * @return {Observable} return observable stream with results
 * of rendering faces
 */
export function processFacesFactory(ev) {
  return Observable.of(ev)
    .map(normalizeFiles)
    .map(toArray)
    .map(filterMaxFileSize)
    .map(filterImages)
    .map(filterImagesInWhiteList)
    .do(wait)
    .flatMap(toObservable)
    .concatMap(faceDetectionAPI)
    .bufferWithCount(2)
    .concatMap(normalizeForCanvassing)
    .bufferWithCount(2)
    .map(renderFaces)
    .takeUntil(resultsClose$)
    .finally(loadEnd)
    .catch(addErrorStatus);
}

/**
 * Return created div
 * @return {Node} div element
 */
function createDiv() {
  return document.createElement('div');
}

/**
 * Added error status to the end of previous loaded images
 * @return {Observable} observable
 */
function addErrorStatus() {
  let error = createDiv();
  error.classList.add('b-results__error');
  resultsImages.appendChild(error);
  return Observable.empty();
}

/**
 * Add loading bar to the UI
 */
export function loadStart() {
  let loadBar = createDiv();
  loadBar.classList.add('b-results__loading');
  resultsImages.appendChild(loadBar);
}

/**
 * Remove loading bar
 */
export function loadEnd() {
  let loadBar = document.querySelector('.b-results__loading');
  if (loadBar) {
    loadBar.parentNode.removeChild(loadBar);
  }
}

/**
 * Loading state for css
 * @param {Array} files array of files
 */
export function wait(files) {
  if (files.length) {
    results.classList.add('b-results--active');
    loadStart();
  }
}

/**
 * Render Images to results list
 * @param {Image} image image to render
 */
export function renderToResults(image) {
  let loadBar = document.querySelector('.b-results__loading');
  resultsImages.insertBefore(image, loadBar);
}
