# List each tv serie

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

![foundTvSeries](asset/foundTvSeries.png)