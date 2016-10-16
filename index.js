/**
 * A very generic functional trie implemention
 */
module.exports = class Vertex {

  /**
   * Create a new vertex
   * @param {*} value the value that the vertex holds
   * @param {Map} edges the edges that this vertex has stored a `Map` edge name => `Vertex`
   */
  constructor (value, edges = new Map()) {
    this._value = value
    this._edges = edges
  }

  /**
   * @property {*} value the value of the vertex
   */
  get value () {
    return this._value
  }

  set value (val) {
    this._value = val
  }

  /**
   * @property {*} the edges of the vertex
   */
  get edges () {
    return this._edges
  }

  /**
   * @property {Vertex} returns the root vertex
   */
  get root () {
    let vertex = this
    while (vertex._parent) {
      vertex = vertex._parent
    }
    return vertex
  }

  /**
   * @property {boolean} Returns truthy on whether the vertexs is empty
   */
  get isEmpty () {
    return this._edges.size === 0 && this._value === undefined
  }

  /**
   * Set an edge on a given path to the given the vertex
   * @param {Array} path
   * @param {Vertex} vertex
   */
  set (path, newVertex) {
    return this.update(path, vertex => {
      vertex._value = newVertex._value
      vertex._edges = newVertex._edges
      return vertex
    })
  }

  /**
   * Updates a path's vertex
   * @param {Array} path
   * @param {function} func the update function. Its is given a `Vertex` to update
   * and returns the updated `Vertex`
   */
  update (path, func) {
    let [nextVertex, vertex, top, edge] = this._updatePath(path)
    nextVertex = func(nextVertex)
    vertex._edges.set(edge, nextVertex)
    nextVertex._parent = vertex

    return top
  }

  updateAsync (path, updateCb) {
    const [nextVertex, vertex, top, edge] = this._updatePath(path)
    updateCb(nextVertex, updatedVertex => {
      vertex._edges.set(edge, updatedVertex)
      updatedVertex._parent = vertex
      return top
    })
  }

  _updatePath (path) {
    path = formatPath(path)
    let top, edge, nextVertex
    let vertex = top = this.copy()
    while (path.length > 1) {
      edge = path.shift()
      nextVertex = vertex._edges.get(edge)
      if (nextVertex) {
        nextVertex = nextVertex.copy()
      } else {
        nextVertex = new Vertex()
      }
      // set the parent refrence
      nextVertex._parent = vertex
      vertex._edges.set(edge, nextVertex)
      vertex = nextVertex
    }

    edge = path.shift()
    nextVertex = vertex._edges.get(edge)
    if (!nextVertex) {
      nextVertex = new Vertex()
    }

    return [nextVertex, vertex, top, edge]
  }

  /**
   * get a vertex given a path
   * @param {Array} path
   */
  get (path) {
    path = formatPath(path)
    let result = this
    while (path.length && result) {
      const edge = path.shift()
      result = result._edges.get(edge)
    }
    return result
  }

  /**
   * walks along a path. Implemented as an itorator that returns
   * `[edge name, vertex]` on each found edge.
   */
  * walkPath (path) {
    path = formatPath(path)
    let vertex = this
    let edge
    while (vertex) {
      vertex = vertex.copy()
      yield [edge, vertex]
      edge = path.shift()
      vertex = vertex._edges.get(edge)
    }
  }

  /**
   * deletes an Edge at a given path
   * @param {Array} path
   * @return {Vertex}
   */
  del (path) {
    let nodes = [...this.walkPath(path)].reverse()
    let [lastEdge] = nodes.shift()
    // check if the entire path was found. If not return the unmodified trie
    if (path.length !== nodes.length) {
      return this
    }

    nodes.forEach(([edge, vertex]) => {
      vertex._edges.delete(lastEdge)
      lastEdge = edge
    })
    // return the last node
    return nodes.pop()[1]
  }

  /**
   * Creates an copy of the current Vertex
   * @return {Vertex}
   */
  copy () {
    return new Vertex(this._value, new Map(this._edges))
  }

  /**
   * Does a depth first iteration of the trie
   */
  * [Symbol.iterator ] () {
    yield this
    for (let vertex of this._edges) {
      yield * vertex[1]
    }
  }
}

function formatPath (path) {
  if (Array.isArray(path)) {
    return path.slice()
  } else {
    return [path]
  }
}
