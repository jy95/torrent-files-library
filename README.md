# torrent-files-library [![Build Status](https://img.shields.io/travis/jy95/torrent-files-library.svg)](https://travis-ci.org/jy95/torrent-files-library)  [![Coveralls branch](https://img.shields.io/coveralls/jy95/torrent-files-library/master.svg)](https://coveralls.io/github/jy95/torrent-files-library?branch=master) [![Dependency Status](https://img.shields.io/david/jy95/torrent-files-library.svg)](https://david-dm.org/jy95/torrent-files-library)  [![Dev Dependency Status](https://img.shields.io/david/dev/jy95/torrent-files-library.svg)](https://david-dm.org/jy95/torrent-files-library?type=dev) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
> Enables to get a library of downloaded torrent files (movie or tv show) from a directory

## Installation

For npm users :

```sh
$ npm install --save torrent-files-library
```

for Yarn :
```sh
$ yarn add torrent-files-library
```

## Demo

```node
const TorrentLibrary = require("torrent-files-library");

let paths = [
	"D:\\DDL\\FILMS", // a path where I can find both movies and tv-series
	"D:\\DDL\\SERIES TV\\Le juge et le pilote" // a path where I can find episodes of a tv-serie
];

// create an instance
let libInstance = new TorrentLibrary();

// add these paths inside this lib
libInstance
	.addNewPath(...paths)
	.then( (message) => {
		console.log(message);
		return libInstance.scan();
	})
	.then( (otherMessage) => {
		console.log(otherMessage);
		
		setTimeout(function(){
			// display the found files and their category
			libInstance
				.allFilesWithCategory
				.forEach(function(value,key){
					console.log(key + " : " + value);
				});
		}, 1000);
	})
	.catch( (err) => {
		console.log(err.message);
	});
```
![fileMappingDemo](https://raw.githubusercontent.com/jy95/torrent-files-library/master/demo/fileMapping.gif)

## Documentation
For more examples and API details, see [API documentation](https://jy95.github.io/torrent-files-library/)

## Test

```
npm test
```

To generate a test coverage report:

```
npm run coverage
```
## Contributing

* If you're unsure if a feature would make a good addition, you can always [create an issue](https://github.com/jy95/torrent-files-library/issues/new) first.
* We aim for 100% test coverage. Please write tests for any new functionality or changes.
* Any API changes should be fully documented.
* Make sure your code meets our linting standards. Run `npm run lint` to check your code.
* Be mindful of others when making suggestions and/or code reviewing.