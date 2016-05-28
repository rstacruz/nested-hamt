const hamt = require('mini-hamt')
const empty = hamt.empty
const normalize = require('./lib/normalize_keypath')
const assign = require('fast.js/object/assign')
const forEach = require('fast.js/array/forEach')
const map = require('fast.js/array/map')
const forIn = require('fast.js/object/forEach')
const IS_ARRAY = '__isArray__'

/*
 * Sets data into a hamt store.
 */

function set (data, keypath_, val) {
  // Optimization: setting the root
  if (keypath_ === '' || keypath_.length === 0) {
    return fromJS(val)
  }

  // Optimization: only one step
  // eg: set(data, 'key', value)
  if ((typeof keypath_ === 'string' && keypath_.indexOf('.') === -1) || (keypath_.length === 1)) {
    return hamt.set(data, keypath_, fromJS(val))
  }

  var keypath = normalize.toArray(keypath_)
  var key = normalize.toString(keypath_)

  // Get steps
  var steps = getSteps(data, keypath)

  // Update steps
  steps[steps.length - 1] = fromJS(val)
  for (var i = steps.length - 2; i >= 0; i--) {
    steps[i] = hamt.set(steps[i] || hamt.empty, keypath[i + 1], steps[i + 1])
  }

  data = hamt.set(data, keypath[0], steps[0])
  return data
}

/*
 * Internal: gets the steps in the keypath
 */

function getSteps (data, keypath) {
  return map(keypath, function (key) {
    if (!data) return
    var result = hamt.get(data, key)
    data = result
    return result
  })
}

/*
 * Gets data as HAMT.
 */

function getRaw (data, keypath) {
  keypath = normalize.toArray(keypath)
  var result = data
  forEach(keypath, function (key) {
    if (result) result = hamt.get(result, key)
  })
  return result
}

/*
 * Gets original data; can return a HAMT.
 */

function get (data, keypath) {
  var result = getRaw(data, keypath)
  return toJS(result)
}

/*
 * Deletes from a given keypath.
 */

function del (data, keypath) {
  keypath = normalize.toString(keypath)
  return hamt.del(data, keypath)
}

/*
 * Returns keys.
 */

function keys (data, keypath) {
  keypath = normalize.toString(keypath)
  var result = hamt.get(data, keypath)

  return map(result, function (child) {
    return child.key
  })
}

/*
 * Returns the type.
 */

function getType (data, keypath) {
  keypath = normalize.toString(keypath)
  var result = getRaw(data, keypath)
  var js = toJS(result)
  return Array.isArray(js) ? 'array' : typeof js
}

/*
 * Converts a JSON tree into hamt.
 */

function fromJS (data) {
  if (typeof data !== 'object' || data === null) return data

  var out = hamt.empty
  forIn(data, function (val, key) {
    out = hamt.set(out, key, fromJS(val))
  })

  if (Array.isArray(data)) {
    out = hamt.set(out, IS_ARRAY, true)
  }

  return out
}

/*
 * Converts a HAMT tree to a JSON object.
 */

function toJS (data) {
  if (typeof data !== 'object' || data === null) return data
  var isArray = hamt.get(data, IS_ARRAY)
  var result = isArray ? [] : {}

  map(data.children, function (child) {
    if (child.key === IS_ARRAY) return
    result[child.key] = toJS(child.value)
  })
  return result
}

/*
 * Checks if a given data object is a HAMT object.
 */

function isHamt (data) {
  typeof data === 'object' &&
    typeof data.type === 'string' &&
    typeof data.mask === 'number' &&
    typeof data.children === 'object'
}

/*
 * Works like `{ [key]: value }`, but implemented this way for ES5 compatibility
 */

function objectPair (key, value) {
  var obj = {}
  obj[key] = value
  return obj
}

module.exports = {
  set: set,
  fromJS: fromJS,
  toJS: toJS,
  isHamt: isHamt,
  get: get,
  getRaw: getRaw,
  empty: empty,
  del: del,
  keys: keys,
  getType: getType
}
