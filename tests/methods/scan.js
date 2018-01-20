import test from 'ava';
import * as sinon from 'sinon';
import TorrentLibrary from '../../src/TorrentLibrary';
import { folders } from '../_constants';

// TESTS
test('Scan without user provided paths', async (t) => {
  let eventSpy = sinon.spy();
  let libInstance = new TorrentLibrary();
  libInstance.on('scan', eventSpy);
  await t.notThrows(libInstance.scan());
  t.truthy(eventSpy.called, 'Event did not fire.');
  t.truthy(eventSpy.calledOnce, 'Event fired more than once');
});

test('Scan with user provided paths', async (t) => {
  let eventSpy = sinon.spy();
  let libInstance = new TorrentLibrary();
  libInstance.on('scan', eventSpy);
  // whatever path that should exists
  await t.notThrows(libInstance.addNewPath(...folders));
  await t.notThrows(libInstance.scan());
  t.truthy(eventSpy.called, 'Event did not fire.');
  t.truthy(eventSpy.calledOnce, 'Event fired more than once');
});

