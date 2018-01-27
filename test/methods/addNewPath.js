import test from 'ava';
import path from 'path';
import * as sinon from 'sinon';
import TorrentLibrary from '../../index';
import { folders } from '../_constants';

// TESTS
/** @test {TorrentLibrary#addNewPath} */
test('missing parameter', async (t) => {
  let eventSpy = sinon.spy();
  let libInstance = new TorrentLibrary();
  libInstance.on('missing_parameter', eventSpy);
  await t.throws(libInstance.addNewPath());
  t.truthy(eventSpy.called, 'Event did not fire.');
  t.truthy(eventSpy.calledOnce, 'Event fired more than once');
  t.is(
    libInstance.hasPathsProvidedByUser(),
    false, 'No paths by user should be added',
  );
});

/** @test {TorrentLibrary#addNewPath} */
test('inexistent Path', async (t) => {
  let eventSpy = sinon.spy();
  let libInstance = new TorrentLibrary();

  libInstance.on('error_in_function', eventSpy);
  await t.throws(libInstance.addNewPath(path.join(__dirname, 'wrongPath')));
  t.truthy(eventSpy.called, 'Event did not fire.');
  t.truthy(eventSpy.calledOnce, 'Event fired more than once');
  t.is(
    libInstance.hasPathsProvidedByUser(),
    false, 'No paths by user should be added',
  );
});

/** @test {TorrentLibrary#addNewPath} */
test('existent paths', async (t) => {
  let eventSpy = sinon.spy();
  let libInstance = new TorrentLibrary();
  libInstance.on('addNewPath', eventSpy);
  await t.notThrows(libInstance.addNewPath(...folders));
  t.truthy(eventSpy.called, 'Event did not fire.');
  t.truthy(eventSpy.calledOnce, 'Event fired more than once');
  t.is(
    libInstance.hasPathsProvidedByUser(),
    true, 'The path should be added',
  );
});

