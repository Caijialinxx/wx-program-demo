// pages/main/main.js
Page({
  data: {
    todos: [{
        id: 1,
        content: 'xxx',
        status: 'success'
    },
      {
        id: 2,
        content: 'yyy',
        status: 'undone'
      },
      {
        id: 3,
        content: 'zzz',
        status: 'success'
      },
      {
        id: 4,
        content: 'abc',
        status: 'undone'
      }
    ]
  },
  tapChangeState: function(e) {
    console.log(e)
    let todosCopy = JSON.parse(JSON.stringify(this.data.todos))
    let target = todosCopy.filter(item => item.id === e.currentTarget.dataset.id)[0]
    if (target.status === 'undone') {
      target.status = 'success'
    } else if (target.status === 'success') {
      target.status = 'undone'
    }
    this.setData({
      todos: todosCopy
    })
  }
})