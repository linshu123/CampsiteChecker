# CampsiteChecker
A simple tool for checking campsite

## First Time Setup

```
npm install
lerna bootstrap // This may take a few minutes
```

## Developer Workflow

1. Run watch:
```
npm run watch
```
2. Edit code, your `.ts` files will be automatically picked up and transpiled.
3. If you have UI changes, you can verify by going to `localhost:3000` on your browser.

## Other Commands

Run just web UI (Verify by going to `localhost:3000` on your broswer):

```
npm run start
```

Run just the worker:

```
npm run scheduler
```