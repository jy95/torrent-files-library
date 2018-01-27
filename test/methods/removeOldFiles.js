import test from 'ava';
import path from 'path';
import * as sinon from 'sinon';
import { parse as nameParser } from 'parse-torrent-title';
import TorrentLibrary from '../../index';
import { files, folders } from '../_constants';

/** @test {TorrentLibrary#removeOldFiles} */
test('Should not be able to remove not present files', async (t) => {
  let libInstance = new TorrentLibrary();
  await t.notThrows(libInstance.addNewPath(...folders));
  await t.notThrows(libInstance.scan());
  const wrongFile = path.join(
    __dirname, 'folder1',
    'The.Blacklist.S04E22.FRENCH.WEBRip.XviD.avi',
  );
  const allFiles = libInstance.allFilesWithCategory;
  const expectedTvSeriesMap = libInstance.allTvSeries;
  await t.notThrows(libInstance.removeOldFiles(wrongFile));
  t.deepEqual(
    libInstance.allFilesWithCategory,
    allFiles,
    'Nothing should have changed!',
  );
  t.deepEqual(
    libInstance.allTvSeries,
    expectedTvSeriesMap,
    'Nothing should have changed!',
  );
});

/** @test {TorrentLibrary#removeOldFiles} */
test('Should be able to remove a movie', async (t) => {
  let libInstance = new TorrentLibrary();
  let eventSpy = sinon.spy();
  await t.notThrows(libInstance.addNewPath(...folders));
  await t.notThrows(libInstance.scan());
  const allFilesWithoutMovie = libInstance.allFilesWithCategory;
  // files[2] ; Bad Ass
  allFilesWithoutMovie.delete(files[2]);

  libInstance.on('removeOldFiles', eventSpy);
  // files[2] ; Bad Ass
  await t.notThrows(libInstance.removeOldFiles(files[2]));
  t.deepEqual(
    libInstance.allMovies,
    new Set(),
    'The movie should have been removed!',
  );

  t.deepEqual(
    libInstance.allFilesWithCategory,
    allFilesWithoutMovie,
    'The movie should have been removed!',
  );
  t.truthy(eventSpy.called, 'Event did not fire.');
  t.truthy(eventSpy.calledOnce, 'Event fired more than once');
});

/** @test {TorrentLibrary#removeOldFiles} */
test('Should be able to remove an tv-serie episode', async (t) => {
  let libInstance = new TorrentLibrary();
  let eventSpy = sinon.spy();
  await t.notThrows(libInstance.addNewPath(...folders));
  await t.notThrows(libInstance.scan());
  const allFilesWithoutIt = libInstance.allFilesWithCategory;
  // files[1] ; The.Blacklist.S04E21
  allFilesWithoutIt.delete(files[1]);

  libInstance.on('removeOldFiles', eventSpy);
  // files[1] ; The.Blacklist.S04E21
  await t.notThrows(libInstance.removeOldFiles(files[1]));
  t.deepEqual(
    libInstance.allTvSeries,
    new Map([
      [nameParser(path.basename(files[0])).title, new Set([
        Object.assign(
          nameParser(path.basename(files[0])),
          { filePath: files[0] },
        ),
      ])],
    ]),
    'The tv-series should still exist!',
  );

  t.deepEqual(
    libInstance.allFilesWithCategory,
    allFilesWithoutIt,
    'The tv-series episode should have been removed!',
  );
  t.truthy(eventSpy.called, 'Event did not fire.');
  t.truthy(eventSpy.calledOnce, 'Event fired more than once');
});

/** @test {TorrentLibrary#removeOldFiles} */
test('Should be able to remove multiples files : Tv-serie', async (t) => {
  let libInstance = new TorrentLibrary();
  let eventSpy = sinon.spy();
  await t.notThrows(libInstance.addNewPath(...folders));
  await t.notThrows(libInstance.scan());
  const allFilesWithoutIt = libInstance.allFilesWithCategory;

  allFilesWithoutIt.delete(files[1]);
  allFilesWithoutIt.delete(files[0]);

  libInstance.on('removeOldFiles', eventSpy);
  await t.notThrows(libInstance.removeOldFiles(...files.slice(0, 2)));
  t.deepEqual(
    libInstance.allTvSeries,
    new Map(),
    'The tv-series episodes should have all been removed!',
  );

  t.deepEqual(
    libInstance.allFilesWithCategory,
    allFilesWithoutIt,
    'The tv-series episodes should have all been removed!',
  );
  t.truthy(eventSpy.called, 'Event did not fire.');
  t.truthy(eventSpy.calledOnce, 'Event fired more than once');
});
