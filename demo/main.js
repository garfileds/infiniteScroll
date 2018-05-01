document.addEventListener('DOMContentLoaded', function () {
  let no = 0
  new InfiniteScroll.InfiniteScroll({
    el: '#app',
    render(data, div) {
      let str
      if (!div) {
        str = `<p class="name">${data.name}</p><p class="no">${data.no}</p>`
        div = document.createElement('div')
        div.className = 'box'
        div.innerHTML = str
        return div
      }

      div.querySelector('.name').textContent = data.name
      div.querySelector('.no').textContent = data.no
      return div
    },

    fetch(num) {
      console.log('fetching data...')

      const res = []
      while (num--) {
        res.push({
          name: 'doug',
          no: no++
        })
      }

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(res)
        }, 100)
      })
    }
  })

  function numDomNodes(node) {
    if(!node.children || node.children.length === 0)
      return 0
    let childrenCount = Array.from(node.children).map(numDomNodes);
    return node.children.length + childrenCount.reduce(function(p, c){ return p + c; }, 0);
  }

  function numChildren(node) {
    return node.childElementCount
  }

  let stats = new Stats();
  let domPanel = new Stats.Panel('DOM Nodes', '#0ff', '#002');
  stats.addPanel(domPanel);
  stats.showPanel(3);
  document.body.appendChild(stats.dom);
  let TIMEOUT = 100;
  const app = document.body.querySelector('#app')
  setTimeout(function timeoutFunc() {
    // Only update DOM node graph when we have time to spare to call
    // numDomNodes(), which is a fairly expensive function.
    requestIdleCallback(function() {
      domPanel.update(numChildren(app), 1500);
      setTimeout(timeoutFunc, TIMEOUT);
    });
  }, TIMEOUT);
})