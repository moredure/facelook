import './styles/index.scss';
import {network$} from './utils/network';
import {Observable, DOM} from 'rx-dom';
import {faceDetectionAPI} from './api';
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
const resultsClose$ = DOM.click(resultsClose).do(clearResultsImages);

export const processFacesFactory = ev => {
  return Observable.of(ev)
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
    .takeUntil(resultsClose$);
};

export const upload$ = dropZone$
  .merge(uploadInput$)
  .flatMap(processFacesFactory)
  .do(renderToResults);

/**
 * Initialization
 */
export function App() {
  console.info('Started!');
  dragndrop$
    .merge(upload$)
    .merge(resultsClose$)
    .merge(network$)
    .subscribe();
}

/**
 * Clear html nodes from b-results__images
 */
export function clearResultsImages() {
  results.classList.remove('b-results--active');
  removeChildren(resultsImages);
}

/**
 * Add loading bar to the UI
 */
export function loadStart() {
  const loadBar = document.createElement('div');
  loadBar.classList.add('b-results__loading');
  resultsImages.appendChild(loadBar);
}

/**
 * Loading state for css
 * @param {Array} files array of files
 */
export function wait(files) {
  if (files.length) results.classList.add('b-results--active');
}

/**
 * Render Images to results list
 * @param {Image} image image to render
 */
export function renderToResults(image) {
  console.log(image);
  const loadBars = document.getElementsByClassName('b-results__loading');
  if (loadBars.length) {
    const loadBar = toArray(loadBars).shift();
    resultsImages.replaceChild(image, loadBar);
  } else {
    removeChildren(resultsImages);
  }
}
