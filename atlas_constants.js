'use strict';
function AtlasViewerConstants() {
  this.IS_DEV_ENVIRONMENT = true;
  this.latitudeMarkers = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'ZA',
    'ZB',
    'ZC',
    'ZD',
    'ZE',
    'ZF',
    'ZG',
    'ZH',
    'ZI',
    'ZJ',
    'ZK',
    'ZL',
    'ZM',
    'ZN',
    'ZO',
    'ZP',
    'ZQ',
    'ZR',
    'ZS',
    'ZT',
    'ZU',
    'ZV',
    'ZW',
    'ZX',
    'ZY',
    'ZZ'
  ];
  this.longitudeMarkers = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
    '32',
    '33',
    '34',
    '35',
    '36',
    '37',
    '38',
    '39',
    '40',
    '41',
    '42',
    '43',
    '44',
    '45',
    '46',
    '47',
    '48',
    '49',
    '50',
    '51',
    '52'
  ];
  this.THRESHOLD_IMMEDIATE = 0;
  this.THRESHOLD_STATIC = 1;
  this.THRESHOLD_ADAPTIVE = 2;
  this.THRESHOLD_DYNAMIC = 3;
  this.LOGGING_NONE = 0;
  this.LOGGING_ALL = 1048575;
  this.LOGGING_DEBUG = 1;
  this.LOGGING_INFO = 16;
  this.LOGGING_ERROR = 256;
  this.LOGGING_TOUCH = 4096;
  this.LOGGING_MOUSE = 8192;
  this.LOGGING_LOAD = 16384;
  this.LOGGING_PROGRESS = 32768;
  this.LOGGING_RENDER = 65536;
  this.LOGGING_PROJECTOR = 131072;
  this.LOGGING_RENDER1 = 262144;
  this.LOGGING_CAMERA = 524288;
  this.logging = this.LOGGING_NONE;
  this._logCallback = null;
  this.ANIMATION_FRAMES_PER_SECOND = 20;
  this.USE_BISECT_LONGITUDES = true;
  this.SUPPORT_RETINA_DISPLAYS = true;
  this.MAX_LONGITUDE_SPAN_FOR_ANIMATION = 2;
  this.LOADING_FORCE_CANVAS_REFRESH_DURATION = 2000;
  this.FORCE_CANVAS_REFRESH_UNTIL_MOVED = -1;
  this.LOADING_ANALYSIS_WINDOW = 32;
  this.BATCH_SIZE = 16;
}
AtlasViewerConstants.prototype.setLogRedirect = function (callback) {
  this._logCallback = callback;
};

exports.AtlasViewerConstants = AtlasViewerConstants;
