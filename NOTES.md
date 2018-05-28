# Cookie Behavior

## Validation

Each "session" contains a few sets of request:

- (1) Initial request to go to recreation.gov main page.
- (2) Second set of requests when you search a park, say, "Yosemite National Park"
  - (2.1) A post request
  - (2.2) A get request
- (3) Third set of requests when you click on a campground, say, "Lower Pines"
  - (3.1) A post request
  - (3.2) A get request
- (4) Request when you search for a date for the campground, say, "Sun 10 Jun 2018 to Mon 11 Jun 2018".

Request (4) is the one we actually care about. But it requires a valid cookie to return real availability, otherwise it only returns the number of campsites they have, not how many are available.

If you look at the cookie field of request (4) header, there is a bunch of stuff, but only `JSESSIONID` ( `JSESSIONID=774CFD555191A358894FBA5DE616A713.awolvprodweb13`) is important. If you have an "activated" `JSESSIONID`, you can strip off all the other crap in cookie field and still get campsite availability.

However, to get an "activated" `JSESSIONID` is slightly more complicated than trivial. From my experiment, we need to perform these few steps (these are performed in SessionIDValidator.ts):

1. Request (1) will return two things: `JSESSIONID`, `_rauv_`. Their value is the same except `_rauv_`'s value has a trailing underscore `_`.
2. Stick the value of `JSESSIONID`, `_rauv_` into request (2.1), (2.2), (3.1), (3.2) in their "cookie" header. 
3. Provide a random nonce (random string) for a key `_4c_` for each set of requests in their "cookie" header. (2.1) and (2.2) will share the same `_4c_` value, and (3.1), (3.2) will share the same `_4c_`. 
4. Send those requests in this order: (1), (2.1) & (2.2) the same time, (3.1) & (3.2) the same time, (4). The same set of requests can go together because on recreation.gov, they are sent on the same page reload. I also inserted a few seconds of delay between each sets. I think that helps with throttling.

After those steps, `JSESSIONID` will be validated. Now we can use this `JSESSIONID` to just perform (4) on any campsite and any date.

## Caveats

There are a few cases where we performed the validation but still can't get the availability response.

1. Even with a perfectly validated `JSESSIONID`, recreation.gov may not give you availability for no reason. Try a few more times, it may succeed on the second or third time. `BatchRequestVerifier` is written specifically for this reason.
2. If you repeatedly query the same campsite with new validated `JSESSIONID` (as I often do in my testing), the campsite page may only return invalid response. I think probably some kind of throttling on how often new `JSESSIONID` can be validated.
3. Validated `JSESSIONID` doesn't work on all campsites. But for one campsite, it works fairly consistently.

# Random Bits

In header of response of all page requests (including the initial recreation.gov page), there is a set-cookie field, which looks like 
```
NSC_MWQSPE-VXQSFD-IUUQT=ffffffff09d44f0645525d5f4f58455e445a4a4221e5;expires=Sun, 27-May-2018 20:03:05 GMT;path=/;secure;httponly
```
`NSC_MWQSPE-VXQSFD-IUUQT=ffffffff09d44f0645525d5f4f58455e445a4a4221e5` is persisted across different sessions, regardless of cookie expiration. It's probably an ID provided by the browser. 