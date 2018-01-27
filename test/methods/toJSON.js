import test from 'ava';
import TorrentLibrary from '../../index';
import { expectedJson, folders } from '../_constants';

/** @test {TorrentLibrary#toJSON} */
test('return a valid stringified JSON', async (t) => {
  const expectedJsonString = JSON.stringify(expectedJson);
  let libInstance = new TorrentLibrary();
  await t.notThrows(libInstance.addNewPath(...folders));
  await t.notThrows(libInstance.scan());
  const dataFromInstance = libInstance.toJSON();
  t.deepEqual(
    JSON.stringify(JSON.parse(dataFromInstance)),
    expectedJsonString,
    'Not the same JSON',
  );
});
