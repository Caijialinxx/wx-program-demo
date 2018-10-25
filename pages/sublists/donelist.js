import { TodoModel } from '../../utils/leancloud.js'
const app = getApp()

Page({
  data: {
    todos: null,
  },
  onLoad: function (options) {
    this.showTodos()
  },
  showTodos: function () {
    TodoModel.fetch(items => {
      let doneTodos = items.filter(item => item.status === 'success')
      if (doneTodos.length > 0) {
        this.setData({
          todos: doneTodos,
        })
      }
    }, (error) => {
      wx.showToast({
        title: error,
        icon: 'none'
      })
    })
  },
  undoneAll: function () {
    let todosCopy = JSON.parse(JSON.stringify(this.data.todos))
    wx.showModal({
      title: '标记所有未完成',
      content: `确定要标记所有为未完成状态吗？`,
      success: ({ confirm }) => {
        if (confirm) {
          todosCopy.map(todo => {
            todo.status = 'undone'
          })
          TodoModel.updateAll(['status'], todosCopy, () => {
            this.setData({
              todos: null
            })
            setTimeout(wx.navigateBack, 300)
          }, (error) => {
            wx.showToast({
              title: error,
              icon: 'none'
            })
          })
        }
      }
    })
  },
  deleteAll: function () {
    let todosCopy = JSON.parse(JSON.stringify(this.data.todos))
    wx.showModal({
      title: '删除待办事项',
      content: `确定要删除所有已完成待办吗？`,
      success: ({ confirm }) => {
        if (confirm) {
          TodoModel.deleteAll(todosCopy, () => {
            this.setData({
              todos: null
            })
            setTimeout(wx.navigateBack, 300)
          }, (error) => {
            wx.showToast({
              title: error,
              icon: 'none'
            })
          })
        }
      }
    })
  }
})