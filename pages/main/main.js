import { TodoModel } from '../../utils/leancloud.js'
const app = getApp()

Page({
  data: {
    todos: []
  },
  onLoad: function () {
    this.showTodos()
  },
  onShow: function () {
    this.showTodos()
  },
  showTodos: function () {
    if (app.globalData.userInfo) {
      TodoModel.fetch(items => {
        this.setData({
          todos: items
        })
      }, (error) => {
        wx.showToast({
          title: error,
          icon: 'none'
        })
      })
    } else {
      this.setData({ todos: [] })
    }
  },
  updateTodo: function(e) {
    let todosCopy = JSON.parse(JSON.stringify(this.data.todos))
    let target = todosCopy.filter(item => item.id === e.currentTarget.dataset.id)[0]
    if (e.target.dataset.editable) {
      // 编辑内容
      app.dataBetweenPage.editInfo = target
    } else {
      // 标记完成状态
      if (target.status === 'undone') {
        target.status = 'success'
      } else if (target.status === 'success') {
        target.status = 'undone'
      }
      TodoModel.update(['status'], target, () => {
        this.setData({
          todos: todosCopy
        })
      }, (error) => {
        wx.showToast({
          title: error,
          icon: 'none'
        })
      })
    }
  }
})