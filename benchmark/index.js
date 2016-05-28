var bm = require('./bm')
var immutable = require('immutable')
var hamt = require('../index')

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

bm('fromJS', {
  'nested-hamt': () => {
    hamt.fromJS(data)
  },
  'immutable': () => {
    immutable.fromJS(data)
  }
})

var hData = hamt.fromJS(data)
var iData = immutable.fromJS(data)

bm('set', {
  'nested-hamt': () => {
    hamt.set(hData, 'hello', 'world')
  },
  'immutable': () => {
    iData.set('hello', 'world')
  }
})

bm('setIn', {
  'nested-hamt': () => {
    hamt.set(hData, ['artists', '5'], 'hello')
  },
  'immutable': () => {
    iData.setIn(['artists', '5'], 'hello')
  }
})