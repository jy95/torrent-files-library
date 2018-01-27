import test from 'ava';
import * as sinon from 'sinon';
import { parse as nameParser } from 'parse-torrent-title';
import path from 'path';
import TorrentLibrary from '../../index';
import { files, folders } from '../_constants';

/** @test {TorrentLibrary#filterMovies} */
test('Should work without parameters', async (t) => {
  let eventSpy = sinon.spy();
  let libInstance = new TorrentLibrary();
  libInstance.on('scan', eventSpy);
  // whatever path that should exists
  await t.notThrows(libInstance.addNewPath(...folders));
  await t.notThrows(libInstance.scan());
  t.truthy(eventSpy.called, 'Event did not fire.');
  t.truthy(eventSpy.calledOnce, 'Event fired more than once');
  t.deepEqual(
    new Set([
      Object.assign(
        nameParser(path.basename(files[2])),
        { filePath: files[2] },
      ),
    ]),
    libInstance.filterMovies(),
    'Not the same',
  );
});

/** @test {TorrentLibrary#filterMovies} */
test('default boolean parameters search', async (t) => {
  let eventSpy = sinon.spy();
  let libInstance = new TorrentLibrary();
  libInstance.on('scan', eventSpy);
  // whatever path that should exists
  await t.notThrows(libInstance.addNewPath(...folders));
  await t.notThrows(libInstance.scan());
  t.truthy(eventSpy.called, 'Event did not fire.');
  t.truthy(eventSpy.calledOnce, 'Event fired more than once');

  // A simple filter that should returns the only movie that we have
  t.deepEqual(
    new Set([
      Object.assign(
        nameParser(path.basename(files[2])),
        { filePath: files[2] },
      ),
    ]),
    libInstance.filterMovies({
      remastered: true,
    }),
    'Not the same',
  );

  // A complex filter that should returns nothing
  t.deepEqual(
    new Set(),
    libInstance.filterMovies({
      extended: true,
      unrated: true,
      proper: true,
      repack: true,
      convert: true,
      hardcoded: true,
      retail: true,
      remastered: true,
      additionalProperties: [
        { type: 'boolean', name: 'AnotherField', value: true },
      ],
    }),
    'Not the same',
  );
});

/** @test {TorrentLibrary#filterMovies} */
test('default number parameters search', async (t) => {
  let eventSpy = sinon.spy();
  let libInstance = new TorrentLibrary();
  libInstance.on('scan', eventSpy);
  // whatever path that should exists
  await t.notThrows(libInstance.addNewPath(...folders));
  await t.notThrows(libInstance.scan());
  t.truthy(eventSpy.called, 'Event did not fire.');
  t.truthy(eventSpy.calledOnce, 'Event fired more than once');

  // A simple filter that should returns the only movie that we have
  t.deepEqual(
    new Set([
      Object.assign(
        nameParser(path.basename(files[2])),
        { filePath: files[2] },
      ),
    ]),
    libInstance.filterMovies({
      year: 2012,
    }),
    'Not the same',
  );

  // A complex filter that should returns nothing
  t.deepEqual(
    new Set(),
    libInstance.filterMovies({
      year: '>=2012',
      additionalProperties: [
        { type: 'number', name: "whateverFieldThatDoesn'tExist", value: '<50' },
        { type: 'number', name: 'AnotherField', value: undefined },
        { type: 'number', name: 'AnotherField2', value: '<=25' },
        { type: 'number', name: 'AnotherField3', value: '>25' },
        { type: 'number', name: 'AnotherField4', value: '=25' },
      ],
    }),
    'Not the same',
  );
});

/** @test {TorrentLibrary#filterMovies} */
test('default string parameters search', async (t) => {
  let eventSpy = sinon.spy();
  let libInstance = new TorrentLibrary();
  libInstance.on('scan', eventSpy);
  // whatever path that should exists
  await t.notThrows(libInstance.addNewPath(...folders));
  await t.notThrows(libInstance.scan());
  t.truthy(eventSpy.called, 'Event did not fire.');
  t.truthy(eventSpy.calledOnce, 'Event fired more than once');

  // A simple filter that should returns the only movie that we have
  t.deepEqual(
    new Set([
      Object.assign(
        nameParser(path.basename(files[2])),
        { filePath: files[2] },
      ),
    ]),
    libInstance.filterMovies({
      title: 'Bad Ass',
    }),
    'Not the same',
  );

  // A complex filter that should returns nothing
  t.deepEqual(
    new Set(),
    libInstance.filterMovies({
      title: 'Bad Ass',
      additionalProperties: [
        {
          type: 'string',
          name: 'whateverField',
          value: ['NothingExists'],
        },
        {
          type: 'string',
          name: 'AnotherField',
          value: ['NothingExists', 'NothingExists'],
        },
        { type: 'string', name: 'AnotherField2', value: '<=25' },
        { type: 'string', name: 'AnotherField3', value: '>25' },
      ],
    }),
    'Not the same',
  );
});
