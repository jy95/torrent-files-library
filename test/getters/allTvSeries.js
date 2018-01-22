import test from 'ava';
import path from 'path';
import { parse as nameParser } from 'parse-torrent-title';
import TorrentLibrary from '../../index';
import { files, folders } from '../_constants';

// TESTS
test('result after scan()', async (t) => {
  let libInstance = new TorrentLibrary();
  await t.notThrows(libInstance.addNewPath(...folders));
  await t.notThrows(libInstance.scan());
  t.deepEqual(
    new Map([
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
    ]),
    libInstance.allTvSeries,
    'Not the same',
  );
});

