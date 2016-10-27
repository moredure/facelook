import {network$} from './network';
import {dragndrop$} from './dragndrop';
import {upload$} from './upload';
import {resultsClose$} from './close';

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
