/**
 * @module nested-hamt
 */

const hamt = require('mini-hamt')
const normalize = require('./lib/normalize_keypath')
const assign = require('fast.js/object/assign')
const forEach = require('fast.js/array/forEach')
const map = require('fast.js/array/map')
const forIn = require('fast.js/object/forEach')
const IS_ARRAY = '__isArray__'

/**
 * Sets data into a HAMT tree.
 *
 * The `keypath`s can be given as an array or a dot-separated string. This
 * applies to [get()](#get) and [del()](#del) as well.
 *
 * @param {Tree} data The HAMT tree to operate on
 * @param {string[]} keypath List of keys
 * @param {*} val Value to be set
 * @return {Tree}
 *
 * @example
 * import { set, get, empty } from 'nested-hamt'
 *
 * var data = set(empty, 'user', { name: 'John' })
 * get(data, 'user.name') // => 'John'
 *
 * @example // Keypaths example
 * // Both are equivalent
 * var data = set(empty, 'user.name', 'John')
 * var data = set(empty, ['user', 'name'], 'John')
 */

function set (data, keypath, val) {
  return setRaw(data, keypath, fromJS(val))
}

/**
 * Set raw data.
 *
 * @param {Tree} data The HAMT tree to operate on
 * @param {string[]} keypath List of keys
 * @param {*} val Value to be set
 * @return {Tree}
 * @private
 */

function setRaw (data, keypath_, val) {
  // Optimization: setting the root
  if (keypath_ === '' || keypath_.length === 0) {
    return val
  }

  // Optimization: only one step
  // eg: set(data, 'key', value)
  if ((typeof keypath_ === 'string' && keypath_.indexOf('.') === -1)) {
    return hamt.set(data, keypath_, val)
  }

  if (keypath_.length === 1 && keypath_[0] === keypath_) {
    return hamt.set(data, keypath_[0], val)
  }

  var keypath = normalize.toArray(keypath_)
  var key = normalize.toString(keypath_)

  // Get steps
  var steps = getSteps(data, keypath)

  // Update steps
  steps[steps.length - 1] = val
  for (var i = steps.length - 2; i >= 0; i--) {
    steps[i] = hamt.set(steps[i] || hamt.empty, keypath[i + 1], steps[i + 1])
  }

  data = hamt.set(data, keypath[0], steps[0])
  return data
}

/**
 * Gets the steps in the keypath.
 *
 * @param {Tree} data The HAMT tree to operate on
 * @param {string[]} keypath List of keys
 * @return {Array.<*>} a list of values for every keypath step
 * @private
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
 *
 * @param {Tree} data The HAMT tree to operate on
 * @param {?string[]} keypath List of keys
 * @returns {*} the value in the given keypath
 * @private
 */

function getRaw (data, keypath) {
  keypath = normalize.toArray(keypath)
  var result = data
  forEach(keypath, function (key) {
    if (result) result = hamt.get(result, key.toString())
  })
  return result
}

/**
 * Returns data from a HAMT store. If `keypath` is not given, it returns the entire store as a JSON object.
 *
 * @param {Tree} data The HAMT tree to operate on
 * @param {?string[]} keypath List of keys
 * @returns {*} the value in the given keypath
 */

function get (data, keypath) {
  var result = getRaw(data, keypath)
  return toJS(result)
}

/**
 * Deletes from a given keypath.
 *
 * @param {Tree} data The HAMT tree to operate on
 * @returns {Tree} the resulting HAMT tree
 */

function del (data, keypath) {
  keypath = normalize.toString(keypath)
  return hamt.del(data, keypath)
}

/**
 * Returns keys in a given HAMT tree.
 *
 * @param {Tree} data The HAMT tree to operate on
 * @returns {string[]} a list of keys
 */

function keys (data) {
  if (!data || !data.children) return
  var keys = map(data.children, function (child) {
    return child.key
  })
  if (hamt.get(data, IS_ARRAY)) {
    return keys.slice(1)
  }
  return keys
}

/*
 * Returns the type in a given keypath.
 * Can return `object`, `array`, or anything *typeof* can return (`string`,
 * `number`, `boolean`, and so on).
 *
 * @param {Tree} data The HAMT tree to operate on
 * @param {string[]} keypath List of keys
 * @returns {string}
 */

function getType (data, keypath) {
  keypath = normalize.toString(keypath)
  var result = getRaw(data, keypath)
  var js = toJS(result)
  return Array.isArray(js) ? 'array' : typeof js
}

/**
 * Converts a JSON tree into a HAMT tree.
 * If the given `data` isn't an object, it'll be returned as is.
 * Inverse of [toJS()](#tojs).
 *
 * @param {object|*} data The JSON data to be set
 * @return {Tree|*} the resulting HAMT tree
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

/**
 * Converts a HAMT tree to a JSON object.
 * If the given `data` is not a HAMT tree, it'll be returned as is.
 * Inverse of [fromJS()](#fromjs).
 *
 * @param {Tree|*} data The HAMT tree
 * @returns {object|*} the resulting object
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

/**
 * Extends a HAMT tree with data from objects.
 *
 * @param {Tree} data The HAMT tree to operate on
 * @param {object} ...sources Objects to extend the tree with
 * @returns {Tree} the resulting HAMT tree
 */

function extend (data) {
  var totalArgs = arguments.length
  var source, totalKeys, i, j, key

  for (i = 1; i < totalArgs; i++) {
    source = arguments[i]
    keys = Object.keys(source)
    totalKeys = keys.length
    for (j = 0; j < totalKeys; j++) {
      key = keys[j]
      data = hamt.set(data, key, fromJS(source[key]))
    }
  }

  return data
}

/**
 * Checks if a given data object is a HAMT object.
 *
 * @param {Tree|*} data A HAMT tree or anythin
 * @return {boolean}
 */

function isHamt (data) {
  return typeof data === 'object' &&
    typeof data.type === 'string' &&
    typeof data.mask === 'number' &&
    typeof data.children === 'object'
}

/**
 * Returns the number of keys in a HAMT tree.
 *
 * @param {Tree} data
 * @return {number}
 */

function len (data) {
  if (!data || !data.children) return
  if (hamt.get(data, IS_ARRAY)) return data.children.length - 1
  return data.children.length
}

/**
 * An empty HAMT tree.
 *
 * @example
 * import { set, get, empty } from 'nested-hamt'
 *
 * var tree = set(empty, 'hello', 'world')
 * get(tree, 'hello') // => 'world'
 */

const empty = hamt.empty

/**
 * Works like `{ [key]: value }`, but implemented this way for ES5 compatibility
 *
 * @private
 */

function objectPair (key, value) {
  var obj = {}
  obj[key] = value
  return obj
}

/*
 * Exports
 */

module.exports = {
  del: del,
  empty: empty,
  extend: extend,
  fromJS: fromJS,
  get: get,
  getRaw: getRaw,
  getType: getType,
  isHamt: isHamt,
  keys: keys,
  len: len,
  set: set,
  setRaw: setRaw,
  toJS: toJS
}
