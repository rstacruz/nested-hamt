var test = require('tape')
var fromJS = require('./index').fromJS
var toJS = require('./index').toJS
var set = require('./index').set
var get = require('./index').get
var extend = require('./index').extend
var getType = require('./index').getType
var h = require('mini-hamt')
var assign = Object.assign

test('fromJS()', (t) => {
  var src = { user: { name: { first: 'john', last: 'doe' } } }
  var data = fromJS(src)
  t.deepEqual(get(data), src)
  t.deepEqual(get(data, []), src)
  t.deepEqual(get(data, ['user']), src.user)
  t.deepEqual(get(data, ['user', 'name']), src.user.name)
  t.deepEqual(get(data, ['user', 'name', 'first']), src.user.name.first)
  t.end()
})

test('fromJS() array', (t) => {
  var src = [1, 2, 3]
  var data = fromJS(src)
  t.equal(Array.isArray(get(data)), true)
  t.deepEqual(get(data), src)
  t.deepEqual(get(data)[0], src[0])
  t.deepEqual(get(data)[1], src[1])
  t.end()
})

test('fromJS() primitives', (t) => {
  var data = fromJS('hello')
  t.deepEqual(get(data), 'hello')
  t.deepEqual(getType(data), 'string')

  data = fromJS(1)
  t.deepEqual(get(data), 1)
  t.deepEqual(getType(data), 'number')

  data = fromJS(true)
  t.deepEqual(get(data), true)
  t.deepEqual(getType(data), 'boolean')

  data = fromJS(null)
  t.deepEqual(get(data), null)
  t.deepEqual(getType(data), 'object')
  t.end()
})


test('set()', (t) => {
  var src = { user: { name: { first: 'john', last: 'doe' } } }
  var data = fromJS(src)
  data = set(data, ['user', 'name', 'last'], 'snow')
  t.deepEqual(get(data, ['user', 'name', 'last']), 'snow')
  t.deepEqual(get(data, ['user', 'name']), { first: 'john', last: 'snow' })
  t.end()
})

test('set() append', (t) => {
  var src = { user: { name: { first: 'john', last: 'doe' } } }
  var data = fromJS(src)
  data = set(data, ['user', 'age'], 30)
  t.deepEqual(get(data, ['user']), { name: src.user.name, age: 30 })
  t.end()
})

test('extend()', (t) => {
  var src = { user: { name: { first: 'john', last: 'doe' } } }
  var data = fromJS(src)
  t.deepEqual(
    toJS(extend(data, { a: 1 })),
    assign({}, src, { a: 1 }))
  t.deepEqual(
    toJS(extend(data, { a: { b: 1 } })),
    assign({}, src, { a: { b: 1 } }))
  t.end()
})

