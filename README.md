# torrent-files-library [![Build Status](https://img.shields.io/travis/jy95/torrent-files-library.svg)](https://travis-ci.org/jy95/torrent-files-library)  [![Coveralls branch](https://img.shields.io/coveralls/jy95/torrent-files-library/master.svg)](https://coveralls.io/github/jy95/torrent-files-library?branch=master) [![Dependency Status](https://img.shields.io/david/jy95/torrent-files-library.svg)](https://david-dm.org/jy95/torrent-files-library)  [![Dev Dependency Status](https://img.shields.io/david/dev/jy95/torrent-files-library.svg)](https://david-dm.org/jy95/torrent-files-library?type=dev) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![Join the chat at https://gitter.im/torrent-files-library-/Lobby](https://badges.gitter.im/torrent-files-library-/Lobby.svg)](https://gitter.im/torrent-files-library-/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)  [![Greenkeeper badge](https://badges.greenkeeper.io/jy95/torrent-files-library.svg)](https://greenkeeper.io/)
> Scan directories to build a library of media files (movie or tv show) that follows torrent naming conventions

PS: see the repository [mediaScan](https://github.com/jy95/mediaScan) for the TypeScript version of this lib.

## What to do with this library ?

A lot of things :
* Basic listing purposes :
    * [List found movies](https://jy95.github.io/torrent-files-library/manual/listFoundMovies.html)
    * [List each found tv serie](https://jy95.github.io/torrent-files-library/manual/listEachTvSerie.html)
    * [Detect the category of each file](https://jy95.github.io/torrent-files-library/manual/getCategoryForEachFile.html)
* Filtering purposes :
    * [Filter movies based on search parameters](https://jy95.github.io/torrent-files-library/manual/filterMoviesByParameters.html)
    * [Filter tv-shown based on search parameters](https://jy95.github.io/torrent-files-library/manual/filterTvSeriesByParameters.html)
* Miscellaneous purposes
    * [Create custom playlist(s)](https://jy95.github.io/torrent-files-library/manual/createPlaylist.html)
* ...

Don't hesitate to suggest new features : it is always worthy :)

## Documentation
For more examples and API details, see [API documentation with manual](https://jy95.github.io/torrent-files-library/)

## Installation

For npm users :

```shell
$ npm install --save torrent-files-library
```

for Yarn :
```shell
$ yarn add torrent-files-library
```

## Test

```shell
npm test
```

To generate a test coverage report:

```shell
npm run coverage
```
## Contributing

* If you're unsure if a feature would make a good addition, you can always [create an issue](https://github.com/jy95/torrent-files-library/issues/new) first.
* We aim for 100% test coverage. Please write tests for any new functionality or changes.
* Any API changes should be fully documented.
* Make sure your code meets our linting standards. Run `npm run lint` to check your code.
* Be mindful of others when making suggestions and/or code reviewing.
