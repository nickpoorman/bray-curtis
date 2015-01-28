var debug = require('debug')('bray-curtis');
var _ = require('lodash');
var simpleStats = require('simple-statistics');
var isArray = require('util').isArray;

module.exports = BrayCurtis;

function BrayCurtis(vectors, opts) {
  if (!(this instanceof BrayCurtis)) return new BrayCurtis(vectors, opts);
  if (!opts) opts = {};

  // lets assume that vectors is an object
  if (!vectors || !vectors.length) throw new Error('vectors cannot be empty');

  // check to make sure all the data has the same shape
  assertVectorShape(vectors);

  this.vectors = vectors;

  debug('summing vectors');
  // sum up each of the vectors
  this.vectorSums = _.map(vectors, simpleStats.sum);

  if (opts.preCompute) {
    // find the similarity between all the points, build it as a matrix
    // this will be an array of arrays
    // it will be in the same order as the vectors
    this.neighbors = [];

    debug('calculating neighbors for %d vectors', vectors.length);
    for (var vectorIndex = 0; vectorIndex < vectors.length; vectorIndex++) {
      this.neighbors.push(calculateSimilarities.call(this, vectors, vectorIndex));
    };
  }

  return this;
}

BrayCurtis.prototype.knn = function(subject, k) {
  if (typeof k !== 'number') k = 10; // if they didn't specify a k value

  // get k number of nearest neighbors given either the vector or an index to the vector
  var vectorIndex;
  if (typeof subject === 'number') {
    vectorIndex = subject;
  } else if (isArray(subject)) {
    vectorIndex = findIndex(this.vectors, subject);
  } else {
    throw new Error('subject must be either a vector or an index to a vector');
  }

  var vectorNeighbors;
  if (this.neighbors) {
    vectorNeighbors = this.neighbors[vectorIndex];
  } else {
    // calculate the neighbors on the fly for this vector
    vectorNeighbors = calculateSimilarities.call(this, this.vectors, vectorIndex);
  }

  // we only want to return k neighbors
  return vectorNeighbors.slice(0, k);
}

function findIndex(vectors, subject) {
  var i;
  for (i = vectors.length - 1; i >= 0; i--) {
    if (_.isEqual(vectors[i], subject)) break;
  };
  if (i < 0) {
    debug('subject not found in vectors: %j', subject);
    throw new Error('subject not found in vectors');
  }
  return i;
}


function assertVectorShape(vectors) {
  var firstVectorLength = vectors[0].length;
  for (var i = vectors.length - 1; i >= 0; i--) {
    if (vectors[i].length !== firstVectorLength) throw new Error('all vectors must have the same shape');
  };
}

/**
 * given an index, calculate the similarity of that vector to the other vectors
 * this should return an array of objects with a similarity score and the vector
 */
function calculateSimilarities(vectors, currentVectorIndex) {
  debug('calculateSimilarities for vector: %d', currentVectorIndex);

  var vectorNeighbors = [];
  var diss;
  for (var i = 0; i < vectors.length; i++) {
    // calculate the similarity between the two vectors
    vectorNeighbors.push({
      d: calculateSimilarityBetweenVectors.call(this, vectors, currentVectorIndex, i),
      vector: vectors[i]
    });
  }

  debug('sorting results for vector: %d', currentVectorIndex);
  // sort the vectorNeighbors by the d value, in desc order (higher numbers being more similar)
  vectorNeighbors = _.sortBy(vectorNeighbors, 'd').reverse();
  debug('sorted results for vector: %d', currentVectorIndex);

  return vectorNeighbors;
}

function calculateSimilarityBetweenVectors(vectors, vectorAIndex, vectorBIndex) {
  var vectorA = vectors[vectorAIndex];
  var vectorB = vectors[vectorBIndex];

  if (vectorA.length !== vectorB.length) throw new Error('cannot compare vectors of different length');

  var differences = [];
  for (var i = 0; i < vectorA.length; i++) {
    differences.push(Math.abs(vectorA[i] - vectorB[i]));
  }

  var differenceSum = simpleStats.sum(differences);

  var vectorASum;
  var vectorBSum;
  if (this.vectorSums) {
    vectorASum = this.vectorSums[vectorAIndex];
    vectorBSum = this.vectorSums[vectorBIndex];
  } else {
    // the sums were not precomputed. do it now
    vectorASum = simpleStats.sum(vectors[vectorAIndex]);
    vectorBSum = simpleStats.sum(vectors[vectorBIndex]);
  }

  var vectorABSums = vectorASum + vectorBSum;

  if (vectorABSums === 0) return 0; // can't divide by zero, so return zero since both vectors are entirely zero

  var dissimilarity = differenceSum / vectorABSums;
  dissimilarity = dissimilarity * 100; // interpret dissimilarity as a percentage
  var similarity = 100 - dissimilarity; // change dissimilarity to similarity (Bray-Curtis index)
  return similarity;
}
