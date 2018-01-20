import test from 'ava';
import path from 'path';
import { parse as nameParser } from 'parse-torrent-title';
import TorrentLibrary from '../../src/TorrentLibrary';
import { files, folders } from '../_constants';

// TESTS
test('result after scan()', async (t) => {
  let libInstance = new TorrentLibrary();
  await t.notThrows(libInstance.addNewPath(...folders));
  await t.notThrows(libInstance.scan());
  t.deepEqual(
    new Set([
      Object.assign(
        nameParser(path.basename(files[2])),
        { filePath: files[2] },
      ),
    ]),
    libInstance.allMovies,
    'Not the same',
  );
});

