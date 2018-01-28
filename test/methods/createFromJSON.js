import test from 'ava';
import TorrentLibrary from '../../index';
import { folders } from '../_constants';

/** @test {TorrentLibrary.createFromJSON} */
test('create a perfect copy of instance', async (t) => {
  let libInstance = new TorrentLibrary();
  await t.notThrows(libInstance.addNewPath(...folders));
  await t.notThrows(libInstance.scan());
  const jsonFromLib = JSON.parse(libInstance.toJSON());
  const createdInstance = TorrentLibrary.createFromJSON(jsonFromLib);
  t.deepEqual(
    createdInstance.allFilesWithCategory,
    libInstance.allFilesWithCategory,
    'allFilesWithCategory different',
  );
  t.deepEqual(
    createdInstance.allMovies,
    libInstance.allMovies, 'allMovies different',
  );
  t.deepEqual(
    createdInstance.allTvSeries,
    libInstance.allTvSeries, 'allTvSeries different',
  );
});

// dummy test for ES6 code coverage
test('empty instance(s)', async (t) => {
  TorrentLibrary.createFromJSON({});
  t.pass();
});
