## <a id='module:nested-hamt'></a>nested-hamt



### <a id='module:nested-hamt~set'></a>set()

<details>
<summary><code>set(<b title='Tree'>tree</b>, <b title='string[]'>keypath</b>, <b title='*'>val</b>)</code> → <em><a href='tree'>Tree</a></em></summary>

| Param | Type | Description |
| --- | --- | --- |
| `tree` | Tree | The HAMT tree to operate on |
| `keypath` | string[] | List of keys |
| `val` | * | Value to be set |
</details>

Sets data into a HAMT tree.

The `keypath`s can be given as an array or a dot-separated string. This
applies to [get()](#get) and [del()](#del) as well. 

```js
import { set, get, empty } from 'nested-hamt'

var tree = set(empty, 'user', { name: 'John' })
get(tree, 'user.name') // => 'John'
```

```js
// Keypaths example
// Both are equivalent
var tree = set(empty, 'user.name', 'John')
var  = set(empty, ['user', 'name'], 'John')
```

### <a id='module:nested-hamt~get'></a>get()

<details>
<summary><code>get(<b title='Tree'>tree</b>, <b title='string[]'>keypath</b><sub title="Optional">?</sub>)</code> → <em>*</em></summary>

| Param | Type | Description |
| --- | --- | --- |
| `tree` | Tree | The HAMT tree to operate on |
| `keypath` | string[], _optional_ | List of keys |
</details>

Returns data from a HAMT store. If `keypath` is not given, it returns the
entire store as a JSON object. Returns the value in the given keypath.

### <a id='module:nested-hamt~del'></a>del()

<details>
<summary><code>del(<b title='Tree'>tree</b>)</code> → <em><a href='tree'>Tree</a></em></summary>

| Param | Type | Description |
| --- | --- | --- |
| `tree` | Tree | The HAMT tree to operate on |
</details>

Deletes from a given keypath. Returns the resulting HAMT tree.

### <a id='module:nested-hamt~keys'></a>keys()

<details>
<summary><code>keys(<b title='Tree'>tree</b>)</code> → <em>string[]</em></summary>

| Param | Type | Description |
| --- | --- | --- |
| `tree` | Tree | The HAMT tree to operate on |
</details>

Returns keys in a given HAMT tree. Returns a list of keys.

### <a id='module:nested-hamt~fromJS'></a>fromJS()

<details>
<summary><code>fromJS(<b title='object | *'>data</b>)</code> → <em><a href='tree'>Tree</a> | *</em></summary>

| Param | Type | Description |
| --- | --- | --- |
| `data` | object | * | The JSON data to be set |
</details>

Converts a JSON tree into a HAMT tree.
If the given `data` isn't an object, it'll be returned as is.
Inverse of [toJS()](#tojs). Returns the resulting HAMT tree.

### <a id='module:nested-hamt~toJS'></a>toJS()

<details>
<summary><code>toJS(<b title='Tree | *'>tree</b>)</code> → <em>object | *</em></summary>

| Param | Type | Description |
| --- | --- | --- |
| `tree` | Tree | * | The HAMT tree |
</details>

Converts a HAMT tree to a JSON object.
If the given `tree` is not a HAMT tree, it'll be returned as is.
Inverse of [fromJS()](#fromjs). Returns the resulting object.

### <a id='module:nested-hamt~extend'></a>extend()

<details>
<summary><code>extend(<b title='Tree'>tree</b>)</code> → <em><a href='tree'>Tree</a></em></summary>

| Param | Type | Description |
| --- | --- | --- |
| `tree` | Tree | The HAMT tree to operate on |
| `...sources` | object | Objects to extend the tree with |
</details>

Extends a HAMT tree with data from objects. Returns the resulting HAMT tree.

### <a id='module:nested-hamt~isHamt'></a>isHamt()

<details>
<summary><code>isHamt(<b title='Tree | *'>tree</b>)</code> → <em>boolean</em></summary>

| Param | Type | Description |
| --- | --- | --- |
| `tree` | Tree | * | A HAMT tree or anything |
</details>

Checks if a given data object is a HAMT object. 

### <a id='module:nested-hamt~len'></a>len()

<details>
<summary><code>len(<b title='Tree'>tree</b>)</code> → <em>number</em></summary>

| Param | Type | Description |
| --- | --- | --- |
| `tree` | Tree | The HAMT tree to operate on |
</details>

Returns the number of keys in a HAMT tree. 

### <a id='module:nested-hamt~empty'></a>empty

<details>
<summary>empty</summary>
</details>

An empty HAMT tree.

```js
import { set, get, empty } from 'nested-hamt'

var tree = set(empty, 'hello', 'world')
get(tree, 'hello') // => 'world'
```
