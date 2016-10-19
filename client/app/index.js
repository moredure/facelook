/* global NODE_ENV */
import './styles/index.scss';
import './main.js';

if (NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/static/cache.js')
    .then(console.info.bind(console, 'Worker installed:'))
    .catch(console.error.bind(console, 'Error:'));
  }
}
