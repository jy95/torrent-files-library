# Filter movies by parameters

```js
const TorrentLibrary = require("torrent-files-library");

let paths = [
	"D:/",
];

// create an instance
let libInstance = new TorrentLibrary();

// add these paths inside this lib
libInstance
	.addNewPath(...paths)
	.then( () => {
		return libInstance.scan();
	})
	.then( () => {
        console.log('Now time to search all remastered movies with year >= 2012 in one of following container avi/mp4');
        let filteredSet = libInstance.filterMovies({
          year: '>=2012',
          remastered: true,
          container: ['avi', 'mp4'],
        });
        for (let movie of filteredSet) {
          console.log(`${movie.title + ((movie.year) ? ` - ${movie.year}` : '')} at ${movie.filePath}`);
        }
	})
	.catch( (err) => {
    		console.log(err.message);
    });
```

![foundTvSeries](asset/filterMovies.png)