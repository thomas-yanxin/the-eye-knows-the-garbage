













![line-diff](http://i.imgur.com/LBR41CC.png)




# line-diff

Compare strings line by line.




## Installation

```sh
$ npm i line-diff
```









## Example






```js
const LineDiff = require("line-diff")
    , fs = require("fs")

// Show differences between the two files
console.log(
    new LineDiff(
        fs.readFileSync(__dirname + "/1.txt", "utf-8")
      , fs.readFileSync(__dirname + "/2.txt", "utf-8")
    ).toString()
)
//   not modified
// - old
// - deleted
// -
// - 12345
// + new
// + 1234

console.log(
    new LineDiff(
        fs.readFileSync(__dirname + "/1.txt", "utf-8")
      , fs.readFileSync(__dirname + "/2.txt", "utf-8")
      , 3
    ).toString()
)
//   not modified
//   new
// - deleted
// -
// - 12345
// + 1234

```






## Documentation





### `Diff(oldLines, newLines, sensitivity)`
Compares strings line by line.

#### Params
- **String|Array** `oldLines`: The old lines.
- **String|Array** `newLines`: The new lines.
- **Number** `sensitivity`: A number representing how many changes should be there to consider that a line was changed (default: `0`).

#### Return
- **Diff** The `Diff` object containing:
 - `old_lines` (Array|String): The old lines.
 - `new_lines` (Array|String): The new lines.
 - `sensitivity` (Number): The diff sensitivity.
 - `changes` (Array): An array of `Change` objects.
 - `toString` (Function): A function to stringify the diff.

### `toString()`
Converts the lines comparison into a string.

#### Return
- **String** The stringified diff.






## How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].



## License
See the [LICENSE][license] file.


[license]: /LICENSE
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
