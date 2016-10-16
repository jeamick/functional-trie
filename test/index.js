'use strict'
const tape = require('tape')
const Vertex = require('../')

tape('basic', t => {
  let root = new Vertex()
  const path = ['one', 'two', 'three']
  const value = 'this is a leaf'
  const leaf = new Vertex(value)
  let v3 = new Vertex(value)
  root = root.set(path[0], v3)
  t.equals(root.edges.size, 1, 'the root should have one edge')
  root = root.set(path, leaf)

  const leaf2 = root.get(path)
  t.equals(leaf2.value, value, 'set and get should work')

  const leafRoot = leaf2.root
  t.equals(leafRoot, root, 'should return the root')

  v3 = root.get(path[0])

  t.equals(v3.value, value, 'set and get should work for single path')

  const nodes = [...root]
  t.equals(nodes.length, 4, 'should iterate through the nodesjs')

  let pathNodes = [...root.walkPath(path)]
  t.equals(pathNodes.length, 4, 'path length should be 4')

  root = root.del(path)
  pathNodes = [...root.walkPath(path)]
  t.equals(pathNodes.length, 1, 'delete should work')

  root = root.del(path[0])
  t.equals(root.isEmpty, true, 'delete should work')

  const sameRoot = root.del(path)
  t.equals(root, sameRoot, 'should not delete non-existant paths')

  root = root.set(path, leaf)
  root = root.set(path[0], leaf)
  pathNodes = [...root.walkPath(path)]
  t.equals(pathNodes.length, 2, 'it should overwrite the previous vertex')

  t.end()
})

tape('update async', t => {
  let root = new Vertex()
  const path = ['one', 'two', 'three']
  const value = 'this is a leaf'
  const newValue = 'this is a new value'
  const leaf = new Vertex(value)
  root = root.set(path, leaf)

  root.updateAsync(path, (vertex, update) => {
    t.equals(vertex.value, value, 'the value should be teh same')
    vertex.value = newValue
    const updatedTrie = update(vertex)
    vertex = updatedTrie.get(path)
    t.equals(vertex.value, newValue, 'should have the new value')
    t.end()
  })
})
