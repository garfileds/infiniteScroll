export class InfiniteScroll {
  /**
   * @param {Object} options
   * {el, fetch, render, placeHolder*, prefetchData*, cacheItems*, initialItems*}
   */
  constructor(options) {
    const CACHE_ITEMS = 50
    const INITIAL_ITEMS = 20

    this.fetch = options.fetch
    this.render = options.render
    this.viewPort = document.querySelector('#app')
    this.viewPortHeight = this.viewPort.offsetHeight
    this.placeHolder = options.placeHolder || placeHolder

    this.cacheItems = options.cacheItems || CACHE_ITEMS
    this.initialItems = options.initialItems || INITIAL_ITEMS

    this.loading = false
    this.items = [].concat(options.prefetchData || [])
    this.items = this.items.map(data => {
      return {
        data: data,
        node: null,
        top: 0,
        height: 0
      }
    })
    this.setSentinel()
    this.anchorItem = { index: 0, offset: 0 }
    this.anchroScrollTop = 0
    this.start = 0
    this.end = 0

    this.viewPort.style.position = 'relative'
    this.viewPort.addEventListener('scroll', () => {
      this.onScroll()
    })
    this.onScroll()

    function placeHolder() {
      console.log('placeHolder')
    }
  }

  setSentinel(top) {
    if (this.sentinel) {
      return this.sentinel.style.transform = `translateY(${top - 1}px)`
    }

    let sentinel = document.createElement('div')
    sentinel.style.width = '1px'
    sentinel.style.height = '1px'
    sentinel.style.postion = 'absolute'
    sentinel.style.willChange = 'transform'
    sentinel.style.transform = `translateY(0)`
    this.sentinel = sentinel
    this.viewPort.appendChild(sentinel)
  }

  onScroll() {
    const delta = this.viewPort.scrollTop - this.anchroScrollTop
    this.anchroScrollTop = this.viewPort.scrollTop

    let lastScreenItem
    if (delta !== 0) {
      this.anchorItem = this.calculateAnchoredItem(this.anchorItem, delta)
      lastScreenItem = this.calculateAnchoredItem(this.anchorItem, this.viewPortHeight)
    } else {
      lastScreenItem = { index: this.initialItems }
    }
    this.fill(this.anchorItem.index - this.cacheItems, lastScreenItem.index + this.cacheItems)
  }

  calculateAnchoredItem(anchor, delta) {
    let curIdx = anchor.index
    let anchorItem = this.items[curIdx]
    let curPos
    let index
    let offset

    let len = this.items.length - 1
    if (delta > 0) {
      curPos = delta - (anchorItem.height - anchor.offset)
      curIdx++

      while (curPos > 0 && curIdx < len) {
        curPos = curPos - this.items[curIdx++].height
      }

      index = curIdx - 1
      offset = this.items[curIdx - 1].height + curPos
    } else {
      delta = -1 * delta
      curPos = delta - anchor.offset
      curIdx--

      while (curPos > 0 && curIdx >= 0) {
        curPos = curPos - this.items[curIdx--].height
      }

      index = curIdx + 1
      offset = -1 * curPos
    }

    return { index, offset }
  }

  fill(start, end) {
    start = Math.max(0, start)

    if (this.viewContain(start, end)) return

    if (window.requestAnimationFrame) {
      requestAnimationFrame(() => {
        this.attachContent(start, end)
      })
    } else {
      // issue: may cause white screen when scrolling
      this.attachContent(start, end)
    }
  }

  viewContain(start, end) {
    return start >= this.start && end <= this.end
  }

  async attachContent(start, end) {
    let data = []
    let unusedNodes = []
    let requestNum = Math.max(this.cacheItems, end - this.end)

    if (end > this.end) {
      if (end > this.items.length) {
        if (this.loading) return

        this.loading = true
        this.showLoading()
        data = await this.fetch(requestNum)
        this.hideLoading()
        this.loading = false

        for (let d of data) {
          this.addItem(d)
        }
      }

      let node
      for (let i = this.start; i < start; i++) {
        node = this.items[i].node
        if (node) {
          unusedNodes.push(node)
          this.items[i].node = null
        }
      }

      this.start = start
      data.length ? this.end += data.length : this.end = end
    } else if (start < this.start) {
      let node
      for (let i = end; i < this.end; i++) {
        node = this.items[i].node
        if (node) {
          unusedNodes.push(node)
          this.items[i].node = null
        }
      }

      this.start = start
      this.end = end
    }

    let item
    let insertedNodes = []
    let fragment = document.createDocumentFragment()
    for (let i = this.start; i < this.end; i++) {
      item = this.items[i]
      if (!item.node) {
        item.node = this.render(item.data, unusedNodes.pop())
        item.node.style.willChange = 'transform'
        fragment.append(item.node)
        insertedNodes.push(i)
      }
    }
    this.viewPort.appendChild(fragment)

    while (unusedNodes.length) {
      this.viewPort.removeChild(unusedNodes.pop())
    }

    let theFirstItem = this.items[0]
    if (!theFirstItem.height) {
      theFirstItem.top = 0
      theFirstItem.height = item.node.offsetHeight
    }
    for (let i = Math.max(1, this.start); i < this.end; i++) {
      item = this.items[i]
      if (!item.top) {
        item.top = this.items[i - 1].top + this.items[i - 1].height
        item.height = item.node.offsetHeight
      }
    }

    let theLastItem = this.items[this.items.length - 1]
    this.setSentinel(theLastItem.top + theLastItem.height)

    for (let idx of insertedNodes) {
      item = this.items[idx]
      item.node.style.position = 'absolute'
      item.node.style.transform = `translateY(${item.top}px)`
    }
  }

  addItem(data) {
    this.items.push({
      data: data,
      node: null,
      top: 0,
      height: 0
    })
  }

  // TODO: loading animation with this.placeHolder
  showLoading() {
    console.log('loading start')
    this.placeHolder()
  }

  // TODO: hide loading animation
  hideLoading() {
    console.log('loading end')
  }
}

export default { InfiniteScroll }
