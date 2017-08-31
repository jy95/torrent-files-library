# torrent-files-library [![Build Status](https://img.shields.io/travis/jy95/torrent-files-library.svg)](https://travis-ci.org/jy95/torrent-files-library)  [![Coveralls branch](https://img.shields.io/coveralls/jy95/torrent-files-library/master.svg)](https://coveralls.io/github/jy95/torrent-files-library?branch=master) [![Dependency Status](https://img.shields.io/david/jy95/torrent-files-library.svg)](https://david-dm.org/jy95/torrent-files-library)  [![Dev Dependency Status](https://img.shields.io/david/dev/jy95/torrent-files-library.svg)](https://david-dm.org/jy95/torrent-files-library?type=dev) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
> Enables to get a library of downloaded torrent files (movie or tv show) from directories


Table of Contents
=================
* [Get category for each file](#get-category-for-each-file)
* [List found movies](#list-found-movies)
* [List each tv serie](#list-each-tv-serie)

<h3 id="get-category-for-each-file">
    Get category for each file
</h3>

```js
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

<h3 id="list-found-movies">
    List found movies
</h3>

```js
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
		console.log("I found these movie(s) : ");
		setTimeout(function(){
			// display the found movie(s)
			for (let movie of libInstance.allMovies) {
				console.log(movie.title + ((movie.year) ? " - " + movie.year : "") + " at " + movie.filePath );
			}
		}, 1000);
	})
	.catch( (err) => {
		console.log(err.message);
	});
```
![foundMovies](https://raw.githubusercontent.com/jy95/torrent-files-library/master/demo/foundMovies.gif)

<h3 id="list-each-tv-serie">
    List each tv serie
</h3>

```js
const TorrentLibrary = require("torrent-files-library");

let paths = [
	"D:/DDL/FILMS", // a path where I can find both movies and tv-series
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
		console.log("I found these tv-series :");
		let mapSeries = libInstance.allTvSeries;
		
		for (let [foundTvShow,episodeSet] of mapSeries.entries() ) {
			console.log("\n"+foundTvShow);
			console.log("\t Total found episodes : ", episodeSet.size);
			let foundSeasons = new Set([...episodeSet].map( episode => episode.season));
			console.log("\t Found season(s) count : ", foundSeasons.size);
			for (let seasonNumber of foundSeasons){
				console.log("\t\t Season %d", seasonNumber);
				let seasonEpisodes = [...episodeSet].filter(episode => episode.season === seasonNumber);
				console.log("\t\t\t Season count : " + seasonEpisodes.length);
				console.log("\t\t\t Files : ");
				seasonEpisodes.forEach( episode => console.log("\t\t\t " + episode.filePath));
			}
		}

	})
	.catch( (err) => {
		console.log(err.message);
	});
```

![foundTvSeries](https://raw.githubusercontent.com/jy95/torrent-files-library/master/demo/foundTvSeries.gif)

More example are coming ...