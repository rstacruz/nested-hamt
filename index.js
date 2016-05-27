const hamt = require('mini-hamt')
const empty = hamt.empty
const normalize = require('./lib/normalize_keypath')

/*
 * Sets data into a hamt store.
 */

function set (data, keypath, val) {
  keypath = normalize(keypath)
  var key = keypath.join('.')
  if (keypath.length > 1) {
    for (var i = 0, len = keypath.length - 1; i < len; i++) {
      var nextKey = keypath[i + 1]
      var _keypath = keypath.slice(0, i + 1).join('.')
      var existing = hamt.get(data, _keypath)

      if (!existing || existing.v) {
        // Overwrite a leaf value
        data = hamt.set(data, _keypath, { k: { [nextKey]: 1 } })
      } else if (existing && existing.k && !(nextKey in existing.k)) {
        // Append to object
        data = hamt.set(data, _keypath, { k: Object.assign({}, existing.k, { [nextKey]: 1 }) })
      }
    }
  }

  if (val && typeof val === 'object') {
    data = hamt.set(data, key, { [Array.isArray(val) ? 'a' : 'k']: val })
    for (var k in val) {
      data = set(data, keypath.concat([k]), val[k])
    }
  } else {
    data = hamt.set(data, key, { v: val })
  }
  return data
}

/*
 * Gets data.
 */

function get (data, keypath) {
  keypath = normalize(keypath)
  var key = keypath ? keypath.join('.') : ''
  var res = hamt.get(data, key)
  if (typeof res === 'undefined') return

  // Value
  if ('v' in res) return res.v

  // Array
  if (res.a) {
    var result = []
    for (var _key in res.a) {
      result[_key] = get(data, (keypath || []).concat([_key]))
    }
    return result
  }

  // Object (key-value)
  if (res.k) {
    var result = {}
    for (var _key in res.k) {
      result[_key] = get(data, (keypath || []).concat([_key]))
    }
    return result
  }
}

/*
 * Deletes from a given keypath.
 */

function del (data, keypath) {
  // TODO: deepDel() to remove orphan references
  keypath = normalize(keypath)
  return hamt.del(data, keypath.join('.'))
}

/*
 * Returns keys.
 */

function keys (data, keypath) {
  keypath = normalize(keypath)
  var result = hamt.get(data, keypath.join('.'))
  if (result && result.k) { return Object.keys(k) }
  if (result && result.a) { return Object.keys(a) }
}

/*
 * Returns the type.
 */

function getType (data, keypath) {
  keypath = normalize(keypath)
  var result = hamt.get(data, keypath.join('.'))
  if (typeof result === 'undefined') return 'undefined'
  if (result.k) return 'object'
  if (result.a) return 'array'
  if ('v' in result) return typeof result.v
}

/*
 * Converts a JSON tree into hamt.
 */

function toHamt (data) {
  return set(hamt.empty, [], data)
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

module.exports = {
  set: set,
  toHamt: toHamt,
  isHamt: isHamt,
  get: get,
  empty: empty,
  del: del,
  keys: keys,
  getType: getType
}
