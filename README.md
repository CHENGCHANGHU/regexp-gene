# @golden-tiger/regexp-gene

Generate random string from a JS regular expression.

> [Github Repository](https://github.com/CHENGCHANGHU/regexp-gene)

## Candidate Character Pool (ASCII)

|ASCII Code|characters|
|:--|--:|
|[32, 47], [58, 64], [91, 96], [123, 126]|special character|
|[48, 57]|0-9|
|[65, 90]|A-Z|
|[97, 122]|a-z|

## How To Use `gene(regExp, option)`

- `regExp`: gene of random string

- `option.max`: max length of random string, the default max length equal 10

## Examples

- Plain String

```js
gene(/foo/);
// foo
```

- Character Set (any candidate character in the set)

```js
gene(/[abc]/);
// a, b, c
```

- Negate Set (any candidate character that is not in the set)

```js
gene(/[^abc]/);
// any candidate character that is not in the set
```

- Dot (any candidate character)

```js
gene(/./);
// any candidate character
```

- Word (any word character: alphanumeric & underscore)

```js
gene(/\w/);
// a-z, A-Z, 0-9, _
```

- Digit (any digit character: 0-9)

```js
gene(/\d/);
// 0-9
```

- Escaped Character

```js
gene(/\\/);
// \
```

- Group

```js
gene(/(foo(bar)foo)/);
// foobarfoo
```

- Plus (1 or more of the preceding token)

```js
gene(/a+/);
// aaaaaa...
```

- Star (0 or more of the preceding token)

```js
gene(/a*/);
// aaaaaa... or none
```

- Quantifier (the specified quantity of the previous token. `{1,3}` will match 1 to 3. `{3}` will match exactly 3. `{3,}` will match 3 or more.)

```js
gene(/a{1,3}/);
// a or aa or aaa
```

- Optional (0 or 1 of the preceding token)

```js
gene(/ab?/);
// a or ab
```

- Alternation (or)

```js
gene(/a(b|c)d/);
// abd or acd
```
