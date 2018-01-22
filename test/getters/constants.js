import test from 'ava';
import videosExtension from 'video-extensions';
import TorrentLibrary from '../../index';

test('Constant MOVIES_TYPE', (t) => {
  t.is(
    TorrentLibrary.MOVIES_TYPE,
    'MOVIES',
    'Someone changed this constant value !',
  );
});

test('Constant TV_SERIES', (t) => {
  t.is(
    TorrentLibrary.TV_SERIES_TYPE,
    'TV_SERIES',
    'Someone changed this constant value !',
  );
});

test('List of videos extension', (t) => {
  t.is(
    TorrentLibrary.listVideosExtension(),
    videosExtension,
    'Someone changed this constant value !',
  );
});
