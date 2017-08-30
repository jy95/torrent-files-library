import TorrentLibrary from '../lib/TorrentLibrary';
import videosExtension from 'video-extensions';
import assert from 'assert';
import path from 'path';
import fs from 'fs';
import nameParser from 'torrent-name-parser';
import _ from 'lodash';

// just a cross plateform way to remove folder recursively
function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
      const curPath = `${path}/${file}`;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

describe('TorrentLibrary tests', () => {
  let libInstance;
  const folders = [path.join(__dirname, 'folder1'), path.join(__dirname, 'folder2')];
  const files = [
    path.join(__dirname, 'folder1', 'The.Blacklist.S04E21.FRENCH.WEBRip.XviD.avi'),
    path.join(__dirname, 'folder2', 'The.Blacklist.S04E14.FRENCH.WEBRip.XviD.avi'),
    path.join(__dirname, 'folder1', 'Bad.Ass.2012.LiMiTED.TRUEFRENCH.DVDRiP.XviD-www.zone-telechargement.ws.avi'),
  ];

    // initialization
  before(() => {
    libInstance = new TorrentLibrary();
  });

  describe('Static methods', () => {
    context('listVideosExtension()', () => {
      it('should provide the same list of videos extensions', () => {
        assert.deepEqual(JSON.stringify(videosExtension), JSON.stringify(TorrentLibrary.listVideosExtension()), 'Not the same JSON');
      });
    });

    context('Constants', () => {
      it('MOVIES_TYPE', () => {
        assert.equal(TorrentLibrary.MOVIES_TYPE, 'MOVIES', 'Someone changed this constant value !');
      });

      it('TV_SERIES_TYPE', () => {
        assert.equal(TorrentLibrary.TV_SERIES_TYPE, 'TV_SERIES', 'Someone changed this constant value !');
      });
    });
  });

  describe('Instance Methods', () => {
    context('addNewPath()', () => {
      it('missing parameter', (done) => {
        libInstance.addNewPath()
          .then(() => {
            done(new Error('Missing parameter'));
          })
          .catch(() => {
            done();
          });
      });

      it('inexistent Path', (done) => {
        libInstance.addNewPath(path.join(__dirname, 'wrongPath'))
          .then(() => {
            done(new Error('This path should not exist or be readable'));
          })
          .catch(() => {
            done();
          });
      });


      it('existent paths', (done) => {
        libInstance.addNewPath(...folders)
          .then(() => {
            done();
          }).catch((err) => {
            done(err);
          });
      });
    });

    context('scan() (and sub methos related)', function () {
      this.timeout(15000);

      it('Scan without user provided paths must work', (done) => {
        const tempInstance = new TorrentLibrary();
        tempInstance.scan().then(() => {
          done();
        }).catch((err) => {
          done(err);
        });
      });

      it('Scan with user provided paths must work', (done) => {
        libInstance.scan().then(() => {
          done();
        }).catch((err) => {
          done(err);
        });
      });

      it('allMovies()', () => {
        const expectedSet = new Set([
          Object.assign(nameParser(path.basename(files[2])), { filePath: files[2] }),
        ]);
        const resultedSet = libInstance.allMovies;
        assert.equal(_.isEqual(expectedSet, resultedSet), true, 'Not the same');
      });

      it('allTvSeries()', () => {
        const expectedMap = new Map([
          [nameParser(path.basename(files[0])).title, new Set([
            Object.assign(nameParser(path.basename(files[0])), { filePath: files[0] }),
            Object.assign(nameParser(path.basename(files[1])), { filePath: files[1] }),
          ])],
        ]);
        const resultedMap = libInstance.allTvSeries;
        assert.equal(_.isEqual(expectedMap, resultedMap), true, 'Not the same');
      });

      it('allFiles()', () => {
        const expectedMap = new Map([
          [files[0], TorrentLibrary.TV_SERIES_TYPE],
          [files[1], TorrentLibrary.TV_SERIES_TYPE],
          [files[2], TorrentLibrary.MOVIES_TYPE],
        ]);
        const resultedMap = libInstance.allFilesWithCategory;
        assert.equal(_.isEqual(expectedMap, resultedMap), true, 'Not the same');
      });
    });
  });
});
