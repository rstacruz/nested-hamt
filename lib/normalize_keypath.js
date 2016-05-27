/**
 * Internal: normalizes a keypath, allowing dot syntax, and normalizing them
 * all to strings.
 *
 *     normalizeKeypath('user.12.name')  // => ['user', '12', 'name']
 *     normalizeKeypath(['user', 12])    // => ['user', 12]
 */

module.exports = function normalizeKeypath (keypath) {
  if (!keypath) {
    return []
  } else if (typeof keypath === 'string') {
    return keypath.split('.')
  } else {
    return keypath
  }
}
