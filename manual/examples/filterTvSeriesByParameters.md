# Filter tv series by parameters

```js
const TorrentLibrary = require("torrent-files-library");

let paths = [
    'D:/DDL/SERIES TV/Le juge et le pilote',
    'D:/DDL/ANIME',
];

// create an instance
let libInstance = new TorrentLibrary();

// add these paths inside this lib
libInstance
    .addNewPath(...paths)
    .then(() => libInstance.scan())
    .then(() => {
        console.log('Now time to search all episodes <=5 in season 1 of Hardcastle And McCormick / Assassination Classroom , in one of following container avi/mp4');
        let filteredMap = libInstance.filterTvSeries({
            title: ['Hardcastle And McCormick', 'Assassination Classroom'],
            season: 1,
            episode: '<=5',
            container: ['avi', 'mp4'],
        });
        for (let [foundTvShow, episodeSet] of filteredMap.entries()) {
            console.log(`\n${foundTvShow}`);
            console.log('\t Total found episodes : ', episodeSet.size);
            let foundSeasons = new Set([...episodeSet].map(episode => episode.season));
            console.log('\t Found season(s) count : ', foundSeasons.size);
            for (let seasonNumber of foundSeasons) {
                console.log('\t\t Season %d', seasonNumber);
                let seasonEpisodes = [...episodeSet].filter(episode => episode.season === seasonNumber);
                console.log(`\t\t\t Season count : ${seasonEpisodes.length}`);
                console.log('\t\t\t Files : ');
                seasonEpisodes.forEach(episode => console.log(`\t\t\t ${episode.filePath}`));
            }
        }
    })
    .catch((err) => {
        console.log(err.message);
    });
```

![filterTvSeries](asset/filterTvSeries.png)