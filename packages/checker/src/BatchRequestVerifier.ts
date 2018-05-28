/* 
  Even with a validated cookie, recreation.gov doesn't always return availability.
  So we need to send the same request a few times to verify if the cookie actually works.
*/
export class BatchRequestVerifier {

  private numberOfFailedAttempt: number;
  private hasExecutedCallback: boolean;

  constructor(
    // A function that returns the request promise
    private requestPromiseBuilder: () => Promise < any > ,
    // The number of times to send the request
    private numberOfTimesToTry: number,
    // Function that takes the body of the response, and check if it's valid
    private verifier: (body: any) => boolean,
    // Callback function that is executed whenever one response is valid, or when the last attempt has failed.
    private callback: (didSucceed: boolean, body: any) => void
  ) {
    this.numberOfFailedAttempt = 0;
    this.hasExecutedCallback = false;
  }

  startBatchRequest() {
    for (let i = 0; i < this.numberOfTimesToTry; i++) {
      let promise = this.requestPromiseBuilder();
      promise.then((body: any) => {
        if (this.hasExecutedCallback) {
          return;
        } else if (this.verifier(body)) {
          this.callback(true, body);
          this.hasExecutedCallback = true;
          return;
        } else {
          this.numberOfFailedAttempt += 1;
          if (this.numberOfFailedAttempt === this.numberOfTimesToTry) {
            this.callback(false, body);
            this.hasExecutedCallback = true;
          }
        }
      });
    }
  }
}