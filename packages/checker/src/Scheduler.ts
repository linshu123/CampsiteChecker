import {
  SendRequest
} from './CampRequest';

function executeOnRepeat() {
  SendRequest();
  setInterval(function sno() {
    SendRequest();
  }, 20 * 1000);
};

executeOnRepeat();