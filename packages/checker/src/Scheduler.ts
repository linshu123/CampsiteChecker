import {
  SendRequest
} from './CampRequest';

const kIntervalInSeconds = 20;

function executeOnRepeat() {
  // Execute once immediately, then every interval time.
  SendRequest();
  setInterval(function () {
    SendRequest();
  }, kIntervalInSeconds * 1000);
};

executeOnRepeat();