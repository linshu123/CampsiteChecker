# Cookie Behavior

## Observation

In header of response of all page requests (including the initial recreation.gov page), there is a set-cookie field, which looks like 
```
NSC_MWQSPE-VXQSFD-IUUQT=ffffffff09d44f0645525d5f4f58455e445a4a4221e5;expires=Sun, 27-May-2018 20:03:05 GMT;path=/;secure;httponly
```
`NSC_MWQSPE-VXQSFD-IUUQT=ffffffff09d44f0645525d5f4f58455e445a4a4221e5` is persisted across different sessions, regardless of cookie expiration. It's probably an ID provided by the browser. 

In the header of request, there is a cookie field, which looks like
```
_rauv_=B25D239C10298A6CDC5181254D487698.awolvprodweb15_; _ga=GA1.2.2050808312.1520809742; _gid=GA1.2.1288529124.1527410569; JSESSIONID=774CFD555191A358894FBA5DE616A713.awolvprodweb13; NSC_MWQSPE-VXQSFD-IUUQT=ffffffff09d44f0645525d5f4f58455e445a4a4221e5; _4c_=XZFNa%2BMwEIb%2FStHZOPq0JN9KC0sPe9ml5yJLo9rUiYLsxC3B%2Fz2jNA2kuXg%2BHr0zeedElh52pGWKaym1EpRTXZEP%2BJpIeyJ5COVzJC1h2O8cc8oEY7WRRoMUOgLvoo80NqQin0VHMMEbbm0j2FqRgNrf7wNEdxjnO0xQSWXBhh%2FK%2Fe4zqrCflytwazSof4%2BWCqJ%2Bf0VP5JBHlOzneT%2B1m82yLHUGn8HNQ9rV7%2Bm4OeyG%2BB9c9v0%2FmHC5qQ4JF%2FApQPnHtlY1xbzLaZkgY%2Bmpz2kLD43CasRBhILwndUMrPGU0RAM0w0N2jvQHXceuYROkr%2BXMEOEnC9KmE3DXMbc74T1GfK2vMFwXzwRGIzJu7HQeKyK%2FHl8e315xoxTRQ01gvEaL4ih1ZIjUGy%2FOY6mXHzieF6hlbVK4ZAZvTGNpOW3rusZ
```
Only the `JSESSIONID=774CFD555191A358894FBA5DE616A713.awolvprodweb13` part is important. You can strip the entire field down to just this value and it's still valid. It's refreshed everytime you go to the site.

It seems this field is not changed across all requests to recreation.gov, including the initial main page.

This `JSESSIONID=774CFD555191A358894FBA5DE616A713.awolvprodweb13` is not valid (meaning it can't retrive reservation data) until you manually set the arrival date and departure date on the site. 

## Guesses

The response header `set-cookie` seems to set an expiration date for the cookie, but it doesn't make the cookie valid. 

`JSESSIONID=774CFD555191A358894FBA5DE616A713.awolvprodweb13` is probably returned by a response.

Manually picking the arrival/departure date probably sends a response to activate the `JSESSIONID`. 

# Caching/Throttling Behavior
Observed behavior:
1. Queries on same campsite, for 10 different dates, returns the same availability.
2. Queries on 10 different campsites, for the same date, returns only availability for one site. 
3. If I manually change the campsites and send a new query, it's always valid. It takes me 10 ~ 20 seconds to change the code.
4. A valid cookie returns availability most of the time, but not always. Usually I had to send the query 2 or 3 times to ensure good response. 