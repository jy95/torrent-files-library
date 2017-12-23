/* eslint-disable prefer-destructuring */
import videosExtension from 'video-extensions';
import assert from 'assert';
import path from 'path';
import * as fs from 'fs';
import { parse as nameParser } from 'parse-torrent-title';
import _ from 'lodash';
import * as sinon from 'sinon';
import TorrentLibrary from '../lib/TorrentLibrary';

describe('TorrentLibrary tests', () => {
  let libInstance;
  let tempInstance;
  const folders = [path.join(__dirname, 'folder1'),
    path.join(__dirname, 'folder2')];
  const files = [
    path.join(
      __dirname, 'folder1',
      'The.Blacklist.S04E21.FRENCH.WEBRip.XviD.avi',
    ),
    path.join(
      __dirname, 'folder2',
      'The.Blacklist.S04E14.FRENCH.WEBRip.XviD.avi',
    ),
    path.join(
      __dirname, 'folder1',
      'Bad.Ass.2012.LiMiTED.TRUEFRENCH.DVDRiP.XviD' +
        '-www.zone-telechargement.ws.avi',
    ),
  ];

  // eslint-disable-next-line max-len
  let expectedJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'example.json'), 'utf8'));

  // initialization
  before(() => {
    libInstance = new TorrentLibrary();
    tempInstance = new TorrentLibrary();
    // edit the json so that it is cross platform
    expectedJson.paths = folders;
    const filesIndex = [2, 0, 1];
    expectedJson.allFilesWithCategory.forEach((file, index) => {
      expectedJson.allFilesWithCategory[index][0] = files[filesIndex[index]];
    });
    expectedJson.movies[0].filePath = files[2];
    expectedJson['tv-series'][0][1][0].filePath = files[0];
    expectedJson['tv-series'][0][1][1].filePath = files[1];
  });

  describe('Static methods', () => {
    context('listVideosExtension()', () => {
      it('should provide the same list of videos extensions', () => {
        assert.deepEqual(
          JSON.stringify(videosExtension),
          JSON.stringify(TorrentLibrary.listVideosExtension()),
          'Not the same JSON',
        );
      });
    });

    context('Constants', () => {
      it('MOVIES_TYPE', () => {
        assert.equal(
          TorrentLibrary.MOVIES_TYPE,
          'MOVIES', 'Someone changed this constant value !',
        );
      });

      it('TV_SERIES_TYPE', () => {
        assert.equal(
          TorrentLibrary.TV_SERIES_TYPE,
          'TV_SERIES', 'Someone changed this constant value !',
        );
      });
    });
  });

  describe('Instance Methods', () => {
    context('addNewPath()', () => {
      it('missing parameter', (done) => {
        let eventSpy = sinon.spy();
        libInstance.on('missing_parameter', eventSpy);
        libInstance.addNewPath()
          .then(() => {
            done(new Error('Missing parameter'));
          })
          .catch(() => {
            assert(eventSpy.called, 'Event did not fire.');
            assert(eventSpy.calledOnce, 'Event fired more than once');
            assert.equal(
              libInstance.hasPathsProvidedByUser(), false,
              'No paths by user should be added',
            );
            done();
          });
      });

      it('inexistent Path', (done) => {
        let eventSpy = sinon.spy();
        libInstance.on('error_in_function', eventSpy);
        libInstance.addNewPath(path.join(__dirname, 'wrongPath'))
          .then(() => {
            done(new Error('This path should not exist or be readable'));
          })
          .catch(() => {
            assert(eventSpy.called, 'Event did not fire.');
            assert(eventSpy.calledOnce, 'Event fired more than once');
            assert.equal(
              libInstance.hasPathsProvidedByUser(), false,
              'No paths by user should be added',
            );
            done();
          });
      });


      it('existent paths', (done) => {
        let eventSpy = sinon.spy();
        libInstance.on('addNewPath', eventSpy);
        libInstance.addNewPath(...folders)
          .then(() => {
            assert(eventSpy.called, 'Event did not fire.');
            assert(eventSpy.calledOnce, 'Event fired more than once');
            assert.equal(
              libInstance.hasPathsProvidedByUser(), true,
              'The path should be added',
            );
            done();
          }).catch((err) => {
            done(err);
          });
      });
    });

    context('scan()', function test() {
      this.timeout(15000);

      it('Scan without user provided paths must work', (done) => {
        let eventSpy = sinon.spy();
        tempInstance.on('scan', eventSpy);
        tempInstance.scan().then(() => {
          assert(eventSpy.called, 'Event did not fire.');
          assert(eventSpy.calledOnce, 'Event fired more than once');
          done();
        }).catch((err) => {
          done(err);
        });
      });

      it('Scan with user provided paths must work', (done) => {
        let eventSpy = sinon.spy();
        libInstance.on('scan', eventSpy);
        libInstance.scan().then(() => {
          assert(eventSpy.called, 'Event did not fire.');
          assert(eventSpy.calledOnce, 'Event fired more than once');
          done();
        }).catch((err) => {
          done(err);
        });
      });
    });

    context('Getters', () => {
      it('allMovies', () => {
        const expectedSet = new Set([
          Object.assign(
            nameParser(path.basename(files[2])),
            { filePath: files[2] },
          ),
        ]);
        const resultedSet = libInstance.allMovies;
        assert.equal(
          _.isEqual(expectedSet, resultedSet),
          true,
          'Not the same',
        );
      });

      it('allTvSeries', () => {
        const expectedMap = new Map([
          [nameParser(path.basename(files[0])).title, new Set([
            Object.assign(
              nameParser(path.basename(files[0])),
              { filePath: files[0] },
            ),
            Object.assign(
              nameParser(path.basename(files[1])),
              { filePath: files[1] },
            ),
          ])],
        ]);
        const resultedMap = libInstance.allTvSeries;
        assert.equal(_.isEqual(expectedMap, resultedMap), true, 'Not the same');
      });

      it('allFiles', () => {
        const expectedMap = new Map([
          [files[0], TorrentLibrary.TV_SERIES_TYPE],
          [files[1], TorrentLibrary.TV_SERIES_TYPE],
          [files[2], TorrentLibrary.MOVIES_TYPE],
        ]);
        const resultedMap = libInstance.allFilesWithCategory;
        assert.equal(_.isEqual(expectedMap, resultedMap), true, 'Not the same');
      });
    });

    context('toJSON()', () => {
      it('Should return a valid JSON', () => {
        const expectedJsonString = JSON.stringify(expectedJson);
        const dataFromInstance = libInstance.toJSON();
        assert.deepEqual(
          expectedJsonString,
          JSON.stringify(JSON.parse(dataFromInstance)),
          'not the same JSON',
        );
      });
    });

    context('createFromJSON()', () => {
      it('It should create a perfect copy of instance', () => {
        const jsonFromLib = JSON.parse(libInstance.toJSON());
        const createdInstance = TorrentLibrary.createFromJSON(jsonFromLib);
        assert.equal(_.isEqual(
          createdInstance.allFilesWithCategory,
          createdInstance.allFilesWithCategory,
        ), true);
        assert.equal(_.isEqual(
          createdInstance.allMovies,
          libInstance.allMovies,
        ), true);
        assert.equal(_.isEqual(
          createdInstance.allTvSeries,
          libInstance.allTvSeries,
        ), true);
      });
    });

    context('Remove Old files', () => {
      it('Should not be able to remove not present files', () => {
        const wrongFile = path.join(
          __dirname, 'folder1',
          'The.Blacklist.S04E22.FRENCH.WEBRip.XviD.avi',
        );
        const allFiles = libInstance.allFilesWithCategory;
        const expectedTvSeriesMap = libInstance.allTvSeries;
        libInstance.removeOldFiles(wrongFile);
        assert.equal(
          _.isEqual(allFiles, libInstance.allFilesWithCategory),
          true, 'nothing should have changed!',
        );
        assert.equal(_.isEqual(
          expectedTvSeriesMap,
          libInstance.allTvSeries,
        ), true, 'nothing should have changed!');
      });

      it('Should be able to remove a movie', () => {
        // files[2] ; Bad Ass
        const allFilesWithoutMovie = libInstance.allFilesWithCategory;
        allFilesWithoutMovie.delete(files[2]);
        const expectedMovieSet = new Set();
        let eventSpy = sinon.spy();
        libInstance.on('removeOldFiles', eventSpy);
        libInstance.removeOldFiles(files[2]);
        assert.equal(
          _.isEqual(
            allFilesWithoutMovie,
            libInstance.allFilesWithCategory,
          ), true,
          'The movie should have been removed!',
        );
        assert.equal(_.isEqual(
          expectedMovieSet,
          libInstance.allMovies,
        ), true, 'The movie should have been removed!');
        assert(eventSpy.called, 'Event did not fire.');
        assert(eventSpy.calledOnce, 'Event fired more than once');
      });

      it('Should be able to remove an tv-serie episode', () => {
        let eventSpy = sinon.spy();
        tempInstance.on('removeOldFiles', eventSpy);
        const allFiles = tempInstance.allFilesWithCategory;
        allFiles.delete(files[1]);
        const expectedSeriesMap = new Map([
          [nameParser(path.basename(files[0])).title, new Set([
            Object.assign(
              nameParser(path.basename(files[0])),
              { filePath: files[0] },
            ),
          ])],
        ]);
        tempInstance.removeOldFiles(files[1]);

        assert.equal(
          _.isEqual(
            allFiles,
            tempInstance.allFilesWithCategory,
          ), true,
          'The tv-series episode should have been removed!',
        );
        // Fix ici
        assert.equal(
          _.isEqual(
            expectedSeriesMap,
            tempInstance.allTvSeries,
          ), true,
          'The tv-series should still exist',
        );
        assert(eventSpy.called, 'Event did not fire.');
        assert(eventSpy.calledOnce, 'Event fired more than once');
      });

      it('Should be able to remove multiples files : Tv-serie', () => {
        const allFiles = new Map();
        const expectedSeriesMap = new Map();
        let eventSpy = sinon.spy();
        libInstance.on('removeOldFiles', eventSpy);
        libInstance.removeOldFiles(...files.slice(0, 2));
        assert.equal(
          _.isEqual(
            allFiles,
            libInstance.allFilesWithCategory,
          ), true,
          'The tv-series episodes should have all been removed!',
        );
        assert.equal(
          _.isEqual(
            expectedSeriesMap,
            libInstance.allTvSeries,
          ), true,
          'The tv-series episodes should have all been removed!',
        );
        assert(eventSpy.called, 'Event did not fire.');
        assert(eventSpy.calledOnce, 'Event fired more than once');
      });
    });
  });
});
