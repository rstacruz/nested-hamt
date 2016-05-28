var bm = require('./bm')
var immutable = require('immutable')
var hamt = require('../index')
var mhamt = require('mini-hamt')
var scour = require('scourjs')

const data =
  { artists:
    { 1: { id: 1, name: 'Ella Fitzgerald' },
      2: { id: 2, name: 'Frank Sinatra' },
      3: { id: 3, name: 'Miles Davis' },
      4: { id: 4, name: 'Taylor Swift' } },
    albums:
    { 1: { id: 1, name: 'Kind of Blue', genre: 'Jazz', artist_id: 3 },
      2: { id: 2, name: 'Come Fly With Me', genre: 'Jazz', artist_id: 2 },
      3: { id: 3, name: '1984', genre: 'Pop', artist_id: 4 } } }

bm('fromJS()', {
  'nested-hamt': () => {
    hamt.fromJS(data)
  },
  'immutable': () => {
    immutable.fromJS(data)
  }
})

var hData = hamt.fromJS(data)
var iData = immutable.fromJS(data)

bm('set()', {
  'nested-hamt': () => {
    hamt.set(hData, 'hello', 'world')
  },
  'immutable': () => {
    iData.set('hello', 'world')
  },
  'scour': () => {
    scour.set(data, ['hello'], 'world')
  }
})

bm('setIn()', {
  'nested-hamt': () => {
    hamt.set(hData, ['artists', '5'], 'hello')
  },
  'immutable': () => {
    iData.setIn(['artists', '5'], 'hello')
  },
  'scour': () => {
    scour.set(data, ['artists', '5'], 'hello')
  }
})

bm('getIn() value', {
  'nested-hamt': () => {
    hamt.get(hData, ['artists', '1', 'name'])
  },
  'immutable': () => {
    iData.getIn(['artists', '1', 'name'])
  },
  'scour': () => {
    scour.get(data, ['artists', '1', 'name'])
  }
})

bm('getIn() object', {
  'nested-hamt': () => {
    hamt.getRaw(hData, ['artists', '1'])
  },
  'immutable': () => {
    iData.getIn(['artists', '1'])
  },
  'scour': () => {
    scour.get(data, ['artists', '1'])
  }
})
