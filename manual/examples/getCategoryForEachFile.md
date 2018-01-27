# Get category for each file

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
![fileMappingDemo](asset/fileMapping.png)