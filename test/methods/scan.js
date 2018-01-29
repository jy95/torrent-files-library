import test from 'ava';
import * as sinon from 'sinon';
import { parse as nameParser } from 'parse-torrent-title';
import TorrentLibrary from '../../index';
import { folders } from '../_constants';

// TESTS
/** @test {TorrentLibrary#scan} */
test('Scan without user provided paths', async (t) => {
  let eventSpy = sinon.spy();
  let libInstance = new TorrentLibrary();
  libInstance.on('scan', eventSpy);
  await t.notThrows(libInstance.scan());
  t.truthy(eventSpy.called, 'Event did not fire.');
  t.truthy(eventSpy.calledOnce, 'Event fired more than once');
});

/** @test {TorrentLibrary#scan} */
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

// test to handle default parameters
/** @test {TorrentLibrary#scan} */
test('Scan with user provided paths and custom parser', async (t) => {
  let eventSpy = sinon.spy();
  let libInstance = new TorrentLibrary({}, nameParser);
  libInstance.on('scan', eventSpy);
  // whatever path that should exists
  await t.notThrows(libInstance.addNewPath(...folders));
  await t.notThrows(libInstance.scan());
  t.truthy(eventSpy.called, 'Event did not fire.');
  t.truthy(eventSpy.calledOnce, 'Event fired more than once');
});

/** @test {TorrentLibrary#scan} */
test('Scan with user provided paths and wrong custom parser', async (t) => {
  let eventSpy = sinon.spy();
  let libInstance = new TorrentLibrary({}, {});
  libInstance.on('error_in_function', eventSpy);
  // whatever path that should exists
  await t.notThrows(libInstance.addNewPath(...folders));
  await t.throws(libInstance.scan());
  t.truthy(eventSpy.called, 'Event did not fire.');
  t.truthy(eventSpy.calledOnce, 'Event fired more than once');
});
