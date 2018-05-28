import {
  SendRequest
} from './CampRequest';
import {
  SessionIDValidator
} from './SessionIDValidator';

function executeOnRepeat(func: any, interval: number) {
  setInterval(func, interval);
}(function main() {
  SendRequest();
})()