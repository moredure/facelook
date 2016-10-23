import './styles/index.scss';
import {Observable, DOM} from 'rx-dom';
import {faceDetectionAPI} from './api';
import {
  normalizeFiles,
  toArray,
  filterMaxFileSize,
  filterImages,
  filterImagesInWhiteList,
  toObservable,
  normalizeForCanvassing,
  renderFaces,
  removeChildren
} from './utils';

const {fromEvent, click} = DOM;
const uploadInput = document.getElementById('js-files');
const dropZone = document.getElementById('js-drop-files');
const results = document.getElementById('js-results');
const resultsClose = document.getElementById('js-results__close');
const resultsImages = document.getElementById('js-results__images');

const uploadInput$ = fromEvent(uploadInput, 'change');
const dropZone$ = fromEvent(dropZone, 'drop');
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
  .map(filterMaxFileSize)
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

dragEffects$
  .merge(resultsClose$)
  .merge(upload$)
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
 * Add loading bar to the UI
 */
function loadStart() {
  const loadBar = document.createElement('div');
  loadBar.classList.add('b-results__loading');
  resultsImages.appendChild(loadBar);
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

let lastEnter;

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

/* global NODE_ENV */
if (NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/cache.js')
      .catch(console.error.bind(console, 'Error:'));
  }
}
