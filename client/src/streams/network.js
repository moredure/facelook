import {Observable} from 'rx-dom';

const filesLabel = document.getElementById('js-files-label');
const msg = document.getElementsByClassName('b-header__network-status')[0];

const online$ = Observable.create(function(ob) {
  window.addEventListener('online', function(ev) {
    console.info('Online!');
    ob.onNext(ev);
  }, false);
}).do(removeOfflineStatus);

const offline$ = Observable.create(function(ob) {
  window.addEventListener('offline', function(ev) {
    console.warn('Offline!');
    ob.onNext(ev);
  }, false);
}).do(addOfflineStatus);

export const network$ = offline$.merge(online$);

/**
 * Offline status displayer
 * @param  {Event} ev [description]
 */
function addOfflineStatus(ev) {
  filesLabel.disabled = true;
  msg.classList.add('b-header__network-status--offline');
}

/**
 * Online status displayer
 * @param  {Event} ev [description]
 */
function removeOfflineStatus(ev) {
  filesLabel.disabled = false;
  msg.classList.remove('b-header__network-status--offline');
}

