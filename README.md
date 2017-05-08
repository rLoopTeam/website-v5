# rLoop Website (v-5)

A complete revamp of the rLoop website. 

## Setup

We recommend having Node v6 installed on your computer.

```sh
git clone git@github.com:rLoopTeam/website-v5.git &&
cd website-v5 &&
npm install
```


### Develop
Make sure that these folders exist:  
 - src/data
 - src/fonts
 - src/images
 - src/scripts
 - src/styles

If using windows, we suggest using git bash console to run the scripts.

Use `npm run watch` to compile the dist directory in real time.

Use `npm run serve` to serve `/dist` at `http://localhost:8080`.

### Deploy

Use `npm run dist` to compile the dist directory.

Statically serve dist folder
