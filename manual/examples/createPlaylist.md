# Create custom playlist(s)

```js
const TorrentLibrary = require("torrent-files-library");
const m3u = require('m3u'); // a basic playlist writer (in m3u format)

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
        var writer = m3u.writer();
        for (let [foundTvShow, episodeSet] of filteredMap.entries()) {
            let foundSeasons = new Set([...episodeSet].map(episode => episode.season));
            for (let seasonNumber of foundSeasons) {
                writer.comment(`${foundTvShow} - Season ${seasonNumber}`);
                let seasonEpisodes = [...episodeSet].filter(episode => episode.season === seasonNumber);
                seasonEpisodes.forEach(episode => writer.file(`${episode.filePath}`));
            }
        }
        let m3uAsString = writer.toString();
        // save this result into a *.m3u file , using fs.writeFile or whatever you want to do that
        // ...
    })
    .catch((err) => {
        console.log(err.message);
    });
```

```m3u
# Assassination Classroom - Season 1
D:\DDL\ANIME\Assassination.Classroom.S01.FRENCH.720p.WEB-DL.x264-GODSPACE\Assassination.Classroom.S01E01.FRENCH.720p.WEB-DL.x264-GODSPACE.mp4
D:\DDL\ANIME\Assassination.Classroom.S01.FRENCH.720p.WEB-DL.x264-GODSPACE\Assassination.Classroom.S01E02.FRENCH.720p.WEB-DL.x264-GODSPACE.mp4
D:\DDL\ANIME\Assassination.Classroom.S01.FRENCH.720p.WEB-DL.x264-GODSPACE\Assassination.Classroom.S01E03.FRENCH.720p.WEB-DL.x264-GODSPACE.mp4
D:\DDL\ANIME\Assassination.Classroom.S01.FRENCH.720p.WEB-DL.x264-GODSPACE\Assassination.Classroom.S01E04.FRENCH.720p.WEB-DL.x264-GODSPACE.mp4
D:\DDL\ANIME\Assassination.Classroom.S01.FRENCH.720p.WEB-DL.x264-GODSPACE\Assassination.Classroom.S01E05.FRENCH.720p.WEB-DL.x264-GODSPACE.mp4
# Hardcastle And McCormick - Season 1
D:\DDL\SERIES TV\Le juge et le pilote\Saison 1\Hardcastle.And.McCormick.1x01.Le.Monstre.D_acier.avi
D:\DDL\SERIES TV\Le juge et le pilote\Saison 1\Hardcastle.And.McCormick.1x03.Le.Canard.De.Cristal.avi
D:\DDL\SERIES TV\Le juge et le pilote\Saison 1\Hardcastle.And.McCormick.1x04.Je.Ne.Sais.Pas.Ou.Je.Vais.Mais.J.y.Vais..avi
D:\DDL\SERIES TV\Le juge et le pilote\Saison 1\Hardcastle.And.McCormick.1x05.La.Veuve.Noire..avi
```