# List found movies

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
![foundMovies](asset/foundMovies.png)