import {DOM} from 'rx-dom';
let lastEnter;
const dropZone = document.getElementById('js-drop-files');
export const dropZone$ = DOM.fromEvent(dropZone, 'drop');

const dragOver$ = DOM.fromEvent(dropZone, 'dragover')
  .merge(DOM.fromEvent(document, 'dragenter'))
  .do(activateUploadBox);

const dragLeave$ = DOM.fromEvent(document, 'dragleave')
  .merge(dropZone$)
  .do(deactivateUploadBox);

export const dragndrop$ = dragOver$.merge(dragLeave$);

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
