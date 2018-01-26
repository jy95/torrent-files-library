/* eslint-disable max-len */
import { basename, join } from 'path';
import { parse as nameParser } from 'parse-torrent-title';

export const folders = [join(__dirname, 'fixtures', 'folder1'),
  join(__dirname, 'fixtures', 'folder2')];

export const files = [
  join(
    folders[0],
    'The.Blacklist.S04E21.FRENCH.WEBRip.XviD.avi',
  ),
  join(
    folders[1],
    'The.Blacklist.S04E14.FRENCH.WEBRip.XviD.avi',
  ),
  join(
    folders[0],
    'Bad.Ass.2012.REMASTERED.TRUEFRENCH.DVDRiP.XviD' +
        '-www.zone-telechargement.ws.avi',
  ),
];

// json for test
export const expectedJson = {
  paths: [
    ...folders,
  ],
  allFilesWithCategory: [
    [
      files[2],
      'MOVIES',
    ],
    [
      files[0],
      'TV_SERIES',
    ],
    [
      files[1],
      'TV_SERIES',
    ],
  ],
  movies: [
    Object.assign(nameParser(basename(files[2])), {
      filePath: files[2],
    }),
  ],
  'tv-series': [
    [
      'The Blacklist',
      [
        Object.assign(nameParser(basename(files[0])), {
          filePath: files[0],
        }),
        Object.assign(nameParser(basename(files[1])), {
          filePath: files[1],
        }),
      ],
    ],
  ],
};

