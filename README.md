# nested-hamt

> Nested structures in HAMT

## API

### set

> `set(data, keypath, value)`

Sets data into a HAMT store.

```js
import { set, get, empty } from 'nested-hamt'

var data = set(empty, 'user', { name: 'John' })
get(data, 'user.name') // => 'John'
```

The `keypath`s can be given as an array or a dot-separated string. This applies to [get()](#get) and [del()](#del) as well.

```js
// Both are equivalent
var data = set(empty, 'user.name', 'John')
var data = set(empty, ['user', 'name'], 'John')
```

### get

> `get(data, keypath)`

Returns data from a HAMT store. If `keypath` is not given, it returns the entire store as a JSON object.

### del

> `del(data, keypath)`

Deletes data from a keypath.

### keys

> `keys(data, keypath)`

Returns the available keys for the object/array in `keypath`.

### empty

> `empty`

Empty data.

```js
import { set, get, empty } from 'nested-hamt'

var data = set(empty, 'hello', 'world')
get(data, 'hello') // => 'world'
```

### getType

> `getType(data, keypath)`

Checks for the type of data. Can return `object`, `array`, or anything *typeof* can return (`string`, `number`, `boolean`, and so on).

## Thanks

**nested-hamt** © 2016+, Rico Sta. Cruz. Released under the [MIT] License.<br>
Authored and maintained by Rico Sta. Cruz with help from contributors ([list][contributors]).

> [ricostacruz.com](http://ricostacruz.com) &nbsp;&middot;&nbsp;
> GitHub [@rstacruz](https://github.com/rstacruz) &nbsp;&middot;&nbsp;
> Twitter [@rstacruz](https://twitter.com/rstacruz)

[MIT]: http://mit-license.org/
[contributors]: http://github.com/rstacruz/nested-hamt/contributors