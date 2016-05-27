var test = require('tape')
var toHamt = require('./index').toHamt
var set = require('./index').set
var get = require('./index').get
var getType = require('./index').getType
var h = require('mini-hamt')

test('toHamt()', (t) => {
  var src = { user: { name: { first: 'john', last: 'doe' } } }
  var data = toHamt(src)
  t.deepEqual(get(data), src)
  t.deepEqual(get(data, []), src)
  t.deepEqual(get(data, ['user']), src.user)
  t.deepEqual(get(data, ['user', 'name']), src.user.name)
  t.deepEqual(get(data, ['user', 'name', 'first']), src.user.name.first)
  t.end()
})

test('toHamt() array', (t) => {
  var src = [1, 2, 3]
  var data = toHamt(src)
  t.deepEqual(get(data), src)
  t.deepEqual(get(data)[0], src[0])
  t.deepEqual(get(data)[1], src[1])
  t.end()
})

test('toHamt() primitives', (t) => {
  var data = toHamt('hello')
  t.deepEqual(get(data), 'hello')
  t.deepEqual(getType(data), 'string')

  data = toHamt(1)
  t.deepEqual(get(data), 1)
  t.deepEqual(getType(data), 'number')

  data = toHamt(true)
  t.deepEqual(get(data), true)
  t.deepEqual(getType(data), 'boolean')

  data = toHamt(null)
  t.deepEqual(get(data), null)
  t.deepEqual(getType(data), 'object')
  t.end()
})


test('set()', (t) => {
  var src = { user: { name: { first: 'john', last: 'doe' } } }
  var data = toHamt(src)
  data = set(data, ['user', 'name', 'last'], 'snow')
  t.deepEqual(get(data, ['user', 'name', 'last']), 'snow')
  t.deepEqual(get(data, ['user', 'name']), { first: 'john', last: 'snow' })
  t.end()
})

test('set() append', (t) => {
  var src = { user: { name: { first: 'john', last: 'doe' } } }
  var data = toHamt(src)
  data = set(data, ['user', 'age'], 30)
  t.deepEqual(get(data, ['user']), { name: src.user.name, age: 30 })
  t.end()
})
