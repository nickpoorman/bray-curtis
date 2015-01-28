# bray-curtis

Nearest neighbor using bray curtis dissimilarity.

[![wercker status](https://app.wercker.com/status/f0435d8b2ad48a6efb7c5e094c31d641/s "wercker status")](https://app.wercker.com/project/bykey/f0435d8b2ad48a6efb7c5e094c31d641)

This is a Bray Curtis implementation for nearest neighbor. More information can be found [here](https://en.wikipedia.org/wiki/Bray%E2%80%93Curtis_dissimilarity).

*"The Bray–Curtis dissimilarity is bound between 0 and 1, where 0 means the two sites have the same composition (that is they share all the species), and 1 means the two sites do not share any species."*

**Note**: This implementation actually uses the **Bray-Curtis index**. This means the values are bound between 0 and 100, and 0 means the two sites do not share any species. This is implemented like so:

```javascript
dissimilarity = dissimilarity * 100; // interpret dissimilarity as a percentage
var similarity = 100 - dissimilarity; // change dissimilarity to similarity (Bray-Curtis index)
```

# methods
```javascript
var BrayCurtis = require('bray-curtis');
```

## var nn = BrayCurtis(vectors)

Create a new Bray Curtis nearest neighbor instance. `vector` is an an array (neighbors) of arrays (neighbor features).

### var neighbors = nn.knn(subject, k);

Returns the `k` most nearest neighbors to `subject` (the target neighbor). `k` default is `10`.

Resulting `neighbors` is an array where each object has the following properties:
  * `vector` - the neighbor vector
  * `d` - the "Bray-Curtis index" score. ie. similarity score.

# example

```javascript
var BrayCurtis = require('bray-curtis');
var vectors = [
  [26, 4, 13, 11, 0],
  [0, 10, 9, 8, 0],
  [0, 0, 15, 3, 0],
  [13, 5, 3, 10, 7],
  [31, 21, 13, 16, 5],
  [9, 6, 0, 11, 2],
  [32, 26, 0, 23, 0],
  [32, 21, 0, 10, 2],
  [24, 17, 0, 25, 6],
  [16, 3, 12, 20, 2],
  [11, 0, 7, 8, 0],
  [24, 37, 5, 18, 1]
  ];
var nn = new BrayCurtis(vectors);

var subject = [32, 26, 0, 23, 0];
var mostSimilar = [32, 21, 0, 10, 2];

var neighbors = nn.knn(subject, 2);
var neighbor = neighbors[1]; // the subject itself should always be returned as the first element because the item will be most similar to itself, so we get the second element
neighbors[0].d.should.eql(100);
neighbor.vector.should.eql(mostSimilar);
```


# License

(The MIT License)

Copyright (c) 2014 Nick Poorman <mail@nickpoorman.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
