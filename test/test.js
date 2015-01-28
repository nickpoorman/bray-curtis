var should = require('should');
var BrayCurtis = require('../');

var vectors = [
  // [0, 2, 9, 14, 2],
  [26, 4, 13, 11, 0],
  [0, 10, 9, 8, 0],
  [0, 0, 15, 3, 0],
  [13, 5, 3, 10, 7],
  [31, 21, 13, 16, 5],
  [9, 6, 0, 11, 2],
  // [2, 0, 0, 0, 1],
  // [17, 7, 10, 14, 6],
  // [0, 5, 26, 9, 0],
  // [0, 8, 8, 6, 7],
  // [14, 11, 13, 15, 0],
  // [0, 0, 19, 0, 6],
  // [13, 0, 0, 9, 0],
  // [4, 0, 10, 12, 0],
  // [42, 20, 0, 3, 6],
  // [4, 0, 0, 0, 0],
  // [21, 15, 33, 20, 0],
  // [2, 5, 12, 16, 3],
  // [0, 10, 14, 9, 0],
  // [8, 0, 0, 4, 6],
  // [35, 10, 0, 9, 17],
  // [6, 7, 1, 17, 10],
  // [18, 12, 20, 7, 0],
  [32, 26, 0, 23, 0],
  [32, 21, 0, 10, 2],
  [24, 17, 0, 25, 6],
  [16, 3, 12, 20, 2],
  [11, 0, 7, 8, 0],
  [24, 37, 5, 18, 1]
];

describe('bray-curtis', function() {

  var nn;

  before(function() {
    nn = new BrayCurtis(vectors);
  });

  it('should give always give the subject as the first neighbor result', function() {

    vectors.forEach(function(subject) {
      var neighbors = nn.knn(subject, 1);
      var neighbor = neighbors[0];
      neighbor.d.should.eql(100);
      neighbor.vector.should.eql(subject);
    });

  });

  it('should give the correct most similar', function() {

    var subject = [32, 26, 0, 23, 0];
    var mostSimilar = [32, 21, 0, 10, 2];

    // [32, 26, 0, 23, 0], [32, 21, 0, 10, 2] // these should be the most similar

    var neighbors = nn.knn(subject, 2);
    var neighbor = neighbors[1];
    neighbor.vector.should.eql(mostSimilar);
  });

  it('should give the correct least similar', function() {

    var subject = [32, 26, 0, 23, 0];
    var leastSimilar = [0, 0, 15, 3, 0];

    // [32, 26, 0, 23, 0], [0, 0, 15, 3, 0] // these should be the least similar

    var neighbors = nn.knn(subject, vectors.length);
    var neighbor = neighbors[vectors.length - 1];
    neighbor.vector.should.eql(leastSimilar);
  });

});

/**
Data set from: http://www.econ.upf.edu/~michael/stanford/Stanford_Week1.pdf

s1 0 2 9 14 2
s2 26 4 13 11 0
s3 0 10 9 8 0
s4 0 0 15 3 0
s5 13 5 3 10 7
s6 31 21 13 16 5
s7 9 6 0 11 2
s8 2 0 0 0 1
s9 17 7 10 14 6
s10 0 5 26 9 0
s11 0 8 8 6 7
s12 14 11 13 15 0
s13 0 0 19 0 6
s14 13 0 0 9 0
s15 4 0 10 12 0
s16 42 20 0 3 6
s17 4 0 0 0 0
s18 21 15 33 20 0
s19 2 5 12 16 3
s20 0 10 14 9 0
s21 8 0 0 4 6
s22 35 10 0 9 17
s23 6 7 1 17 10
s24 18 12 20 7 0
s25 32 26 0 23 0
s26 32 21 0 10 2
s27 24 17 0 25 6
s28 16 3 12 20 2
s29 11 0 7 8 0
s30 24 37 5 18 1
 */
