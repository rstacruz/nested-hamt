/**
 * Internal: normalizes a keypath, allowing dot syntax, and normalizing them
 * all to strings.
 *
 *     normalizeKeypath('user.12.name')  // => ['user', '12', 'name']
 *     normalizeKeypath(['user', 12])    // => ['user', 12]
 */

exports.toArray = function toArray (keypath) {
  if (!keypath) {
    return []
  } else if (typeof keypath === 'string') {
    return keypath.split('.')
  } else {
    return keypath
  }
}

exports.toString = function toString (keypath) {
  if (!keypath) {
    return ''
  } else if (typeof keypath === 'string') {
    return keypath
  } else {
    return keypath.join('.')
  }
}
