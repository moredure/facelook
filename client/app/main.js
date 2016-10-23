import './styles/index.scss';
import {Observable, DOM} from 'rx-dom';
import {faceDetectionAPI} from './api';
import {network$} from './utils/network';
import {dragndrop$, dropZone$} from './utils/dragndrop';
import {
  normalizeFiles, toArray,
  filterMaxFileSize, filterImages,
  filterImagesInWhiteList, toObservable,
  normalizeForCanvassing, renderFaces,
  removeChildren
} from './utils';

const uploadInput = document.getElementById('js-files');
const results = document.getElementById('js-results');
const resultsClose = document.getElementById('js-results__close');
const resultsImages = document.getElementById('js-results__images');
const uploadInput$ = DOM.fromEvent(uploadInput, 'change');

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

const resultsClose$ = DOM.click(results)
  .filter(exitableTargets)
  .do(clearResultsImages);

/**
 * Initialization
 */
export default function App() {
  console.info('Started!');
  dragndrop$
    .merge(resultsClose$)
    .merge(upload$)
    .merge(network$)
    .subscribe();
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
