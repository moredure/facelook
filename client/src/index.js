import {DOM} from 'rx-dom';
import {App} from './main';

DOM.ready().subscribe(App);

/* global NODE_ENV */
if (NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/cache.js')
      .catch(console.error.bind(console, 'Error:'));
  }
}
