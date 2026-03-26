export function reducePromise(promises) {
  // 创建一个promise 对象
  let sequence = Promise.resolve()
  // 用来接收异步返回结果
  const resData = []
  for (let i = 0; i < promises.length; i++) {
    // 循环执行异步函数，并且将结果保存到resData中
    sequence = sequence.then(promises[i]).then((v) => {
      resData.push(v)
    })
  }
  // 方便后续能够继续通过链式调用的方式 获取上面所有异步方法的返回值
  return new Promise((resolve) => {
    // 最后再次添加一个 异步函数等待前面所有异步函数执行完毕，将我们的返回值
    // resolve 出去
    sequence.then(() => {
      resolve(resData)
    })
  })
}
