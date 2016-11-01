# SYNOPSIS 
[![NPM Package](https://img.shields.io/npm/v/functional-trie.svg?style=flat-square)](https://www.npmjs.org/package/functional-trie)
[![Build Status](https://img.shields.io/travis/wanderer/functional-trie.svg?branch=master&style=flat-square)](https://travis-ci.org/wanderer/functional-trie)
[![Coverage Status](https://img.shields.io/coveralls/wanderer/functional-trie.svg?style=flat-square)](https://coveralls.io/r/wanderer/functional-trie)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)  

This is a Functional Trie implementation. [imerative-trie](https://github.com/wanderer/imperative-trie) is the imperative version. 

# USAGE

```javascript
const Vertex = require('functional-trie')

// to start with the graph is just a single vertex
var vertex = new Vertex()

// now lets add an edge to the vertex named "bob" that points to another vertex with the value "alice"
vertex = vertex.set('friend', new Vertex('alice'))

// if paths have more than one name in them they can arrays
vertex = vertex.set(['friend', 'brother'], new Vertex('bob'))
// now the graph looks like:
// [vertex]---friend--->[alice]---brother-->[bob]

// path names and vertex values can be anything
vertex = vertex.set([new Buffer('friend'), 5, true, {}, new Date()], new Vertex(['an array of some stuff']))

// edges are stored in a Map
vertex.edges // Map{}

// you can also iterate a path
vertices = [...vertex.walkPath(['friend', 'brother'])]

// delete an edge
vertex = vertex.delete('friend')
// now the vertex is empty
vertex.isEmpty // true
```

# API
[./docs/](./docs/index.md)


# LICENSE
[MPL-2.0](https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2))
