import {
  SendRequest
} from './CampRequest';

function executeOnRepeat(func: any, interval: number) {
  setInterval(func, interval);
}(function main() {
  SendRequest();
})()