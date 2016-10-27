import {DOM} from 'rx-dom';
import {removeChildren} from './image-processor';
const results = document.getElementById('js-results');
const resultsClose = document.getElementById('js-results__close');
const resultsImages = document.getElementById('js-results__images');

export const resultsClose$ = DOM.click(resultsClose).do(clearResultsImages);

/**
 * Clear html nodes from b-results__images
 */
export function clearResultsImages() {
  results.classList.remove('b-results--active');
  removeChildren(resultsImages);
}
