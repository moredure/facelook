import {Observable} from 'rx-dom';

const filesLabel = document.getElementById('js-files-label');
const msg = document.getElementsByClassName('b-header__network-status')[0];

const online$ = Observable.create(function(ob) {
  window.addEventListener('online', function(ev) {
    console.info('Online!');
    ob.onNext(ev);
  }, false);
});

const offline$ = Observable.create(function(ob) {
  window.addEventListener('offline', function(ev) {
    console.warn('Offline!');
    ob.onNext(ev);
  }, false);
});

export const network$ = offline$
  .merge(online$)
  .do(onlineStatus);

/**
 * Online status displayer
 * @param  {Event} ev [description]
 */
function onlineStatus(ev) {
  filesLabel.disabled = !filesLabel.disabled;
  msg.classList.toggle('b-header__network-status--offline');
}
