import test from 'ava';
import * as sinon from 'sinon';
import { parse as nameParser } from 'parse-torrent-title';
import path from 'path';
import TorrentLibrary from '../../index';
import { files, folders } from '../_constants';

/** @test {TorrentLibrary#filterTvSeries} */
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
    libInstance.filterTvSeries(),
    'Not the same',
  );
});

/** @test {TorrentLibrary#filterTvSeries} */
test('default boolean parameters search', async (t) => {
  let eventSpy = sinon.spy();
  let libInstance = new TorrentLibrary();
  libInstance.on('scan', eventSpy);
  // whatever path that should exists
  await t.notThrows(libInstance.addNewPath(...folders));
  await t.notThrows(libInstance.scan());
  t.truthy(eventSpy.called, 'Event did not fire.');
  t.truthy(eventSpy.calledOnce, 'Event fired more than once');


  // A complex filter that should returns nothing
  t.deepEqual(
    new Map(),
    libInstance.filterTvSeries({
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

/** @test {TorrentLibrary#filterTvSeries} */
test('default number parameters search', async (t) => {
  let eventSpy = sinon.spy();
  let libInstance = new TorrentLibrary();
  libInstance.on('scan', eventSpy);
  // whatever path that should exists
  await t.notThrows(libInstance.addNewPath(...folders));
  await t.notThrows(libInstance.scan());
  t.truthy(eventSpy.called, 'Event did not fire.');
  t.truthy(eventSpy.calledOnce, 'Event fired more than once');

  // A simple filter that should returns the two tv series that we have
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
    libInstance.filterTvSeries({
      season: 4,
    }),
    'Not the same',
  );

  // A complex filter that should returns nothing
  t.deepEqual(
    new Map(),
    libInstance.filterTvSeries({
      season: '>=4',
      additionalProperties: [
        { type: 'number', name: "whateverFieldThatDoesn'tExist", value: '<50' },
        { type: 'number', name: 'AnotherField', value: undefined },
        { type: 'number', name: 'AnotherField2', value: '<=25' },
        { type: 'number', name: 'AnotherField3', value: '>25' },
        { type: 'number', name: 'AnotherField4', value: '==25' },
      ],
    }),
    'Not the same',
  );
});

/** @test {TorrentLibrary#filterTvSeries} */
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
    libInstance.filterTvSeries({
      title: 'The Blacklist',
    }),
    'Not the same',
  );

  // A complex filter that should returns nothing
  t.deepEqual(
    new Map(),
    libInstance.filterTvSeries({
      title: 'The Blacklist',
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
