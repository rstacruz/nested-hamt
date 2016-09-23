### <a id='set'></a>set()

<details>
<summary><code>set(<b title='Tree'>data</b>, <b title='string[]'>keypath</b>, <b title='*'>val</b>)</code> → <em><a href='tree'>Tree</a></em></summary>

| Param | Type | Description |
| --- | --- | --- |
| `data` | Tree | The HAMT tree to operate on |
| `keypath` | string[] | List of keys |
| `val` | * | Value to be set |
</details>

Sets data into a HAMT tree. 

### <a id='get'></a>get()

<details>
<summary><code>get(<b title='Tree'>data</b>, <b title='string[]'>keypath</b>)</code> → <em>*</em></summary>

| Param | Type | Description |
| --- | --- | --- |
| `data` | Tree | The HAMT tree to operate on |
| `keypath` | string[] | List of keys |
</details>

Gets original data; can return a HAMT. Returns the value in the given keypath.

### <a id='del'></a>del()

<details>
<summary><code>del(<b title='Tree'>data</b>)</code> → <em><a href='tree'>Tree</a></em></summary>

| Param | Type | Description |
| --- | --- | --- |
| `data` | Tree | The HAMT tree to operate on |
</details>

Deletes from a given keypath. Returns the resulting HAMT tree.

### <a id='keys'></a>keys()

<details>
<summary><code>keys(<b title='Tree'>data</b>)</code> → <em>string[]</em></summary>

| Param | Type | Description |
| --- | --- | --- |
| `data` | Tree | The HAMT tree to operate on |
</details>

Returns keys in a given HAMT tree. Returns a list of keys.

### <a id='fromJS'></a>fromJS()

<details>
<summary><code>fromJS(<b title='object | *'>data</b>)</code> → <em><a href='tree'>Tree</a> | *</em></summary>

| Param | Type | Description |
| --- | --- | --- |
| `data` | object | * | The JSON data to be set |
</details>

Converts a JSON tree into a HAMT tree.
If the given `data` isn't an object, it'll be returned as is. Returns the resulting HAMT tree.

### <a id='toJS'></a>toJS()

<details>
<summary><code>toJS(<b title='Tree | *'>data</b>)</code> → <em>object | *</em></summary>

| Param | Type | Description |
| --- | --- | --- |
| `data` | Tree | * | The HAMT tree |
</details>

Converts a HAMT tree to a JSON object.
If the given `data` is not a HAMT tree, it'll be returned as is. Returns the resulting object.

### <a id='extend'></a>extend()

<details>
<summary><code>extend(<b title='Tree'>data</b>)</code> → <em><a href='tree'>Tree</a></em></summary>

| Param | Type | Description |
| --- | --- | --- |
| `data` | Tree | The HAMT tree to operate on |
| `...sources` | object | Objects to extend the tree with |
</details>

Extends a HAMT tree with data from objects. Returns the resulting HAMT tree.

### <a id='isHamt'></a>isHamt()

<details>
<summary><code>isHamt(<b title='Tree | *'>data</b>)</code> → <em>boolean</em></summary>

| Param | Type | Description |
| --- | --- | --- |
| `data` | Tree | * | A HAMT tree or anythin |
</details>

Checks if a given data object is a HAMT object. 

### <a id='len'></a>len()

<details>
<summary><code>len(<b title='Tree'>data</b>)</code> → <em>number</em></summary>

| Param | Type | Description |
| --- | --- | --- |
| `data` | Tree |  |
</details>

Returns the number of keys in a HAMT tree. 
