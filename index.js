const hamt = require('mini-hamt')
const empty = hamt.empty

/*
 * Sets data into a hamt store.
 *
 *     var data = set(hamt.empty, 'user', { name: 'John' })
 *     get(data, 'user.name') // => 'John'
 */

function set (data, keypath, val) {
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

function get (data, keypath) {
  var key = keypath ? keypath.join('.') : ''
  var res = hamt.get(data, key)
  if (!res) return
  if (res.v) return res.v

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
 * Converts a JSON tree into hamt.
 */

function toHamt (data) {
  return set(hamt.empty, [], data)
}

function isHamt (data) {
  typeof data === 'object' &&
    typeof data.type === 'string' &&
    typeof data.mask === 'number' &&
    typeof data.children === 'object'
}

module.exports = { set: set, toHamt, isHamt, get: get, empty }
