/* eslint-disable max-len */
import path from 'path';

export const folders = [path.join(__dirname, 'fixtures', 'folder1'),
  path.join(__dirname, 'fixtures', 'folder2')];

export const files = [
  path.join(
    folders[0],
    'The.Blacklist.S04E21.FRENCH.WEBRip.XviD.avi',
  ),
  path.join(
    folders[1],
    'The.Blacklist.S04E14.FRENCH.WEBRip.XviD.avi',
  ),
  path.join(
    folders[0],
    'Bad.Ass.2012.LiMiTED.TRUEFRENCH.DVDRiP.XviD' +
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
      path.join(folders[0], 'Bad.Ass.2012.LiMiTED.TRUEFRENCH.DVDRiP.XviD-www.zone-telechargement.ws.avi'),
      'MOVIES',
    ],
    [
      path.join(folders[0], 'The.Blacklist.S04E21.FRENCH.WEBRip.XviD.avi'),
      'TV_SERIES',
    ],
    [
      path.join(folders[1], 'The.Blacklist.S04E14.FRENCH.WEBRip.XviD.avi'),
      'TV_SERIES',
    ],
  ],
  movies: [
    {
      year: 2012,
      container: 'avi',
      source: 'dvdrip',
      codec: 'xvid',
      language: 'truefrench',
      title: 'Bad Ass',
      filePath: path.join(folders[0], 'Bad.Ass.2012.LiMiTED.TRUEFRENCH.DVDRiP.XviD-www.zone-telechargement.ws.avi'),
    },
  ],
  'tv-series': [
    [
      'The Blacklist',
      [
        {
          container: 'avi',
          source: 'webrip',
          codec: 'xvid',
          season: 4,
          episode: 21,
          language: 'french',
          title: 'The Blacklist',
          filePath: path.join(folders[0], 'The.Blacklist.S04E21.FRENCH.WEBRip.XviD.avi'),
        },
        {
          container: 'avi',
          source: 'webrip',
          codec: 'xvid',
          season: 4,
          episode: 14,
          language: 'french',
          title: 'The Blacklist',
          filePath: path.join(folders[1], 'The.Blacklist.S04E14.FRENCH.WEBRip.XviD.avi'),
        },
      ],
    ],
  ],
};

