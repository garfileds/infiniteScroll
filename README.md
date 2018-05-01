# infiniteScroll
infinite scroll component with high performance

## Usage
```js
  import { InfiniteScroll } from 'InfiniteScroll'

  new InfiniteScroll(options)
```

## Options

| name | required | type | description | default |
|:----:|:--------:|:----:|:-----------:|:-------:|
|el    |✔|String|viewport showing content|
|fetch |✔|Function|fetch data|
|render|✔|Function|use fetched data to render an item|
|placeHolder| |Function|loading animation DOM when fetching data|
|perfetchData| |Array|data used in initial phase
|cacheItems| |Number|the number of items above and below the viewport area|50|
|initialitems| |Number|the number of items in the viewport, used when perfetchData is not provided|20|

## Options example

**fetch**

`(requestNum) -> (Promise)`

dd

```js
function fetchData(num){
  const res = []
  while (num--) {
    res.push({
      name: 'doug',
      no: 0
    })
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(res)
    }, 100)
  })
}
```

**render**

`(data[, div]) -> (domEl)`
