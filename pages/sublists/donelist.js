import { TodoModel } from '../../utils/leancloud.js'
const app = getApp()

Page({
  data: {
    todos: null,
  },
  onShow: function () {
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
  updateTodo: function (e) {
    let todosCopy = JSON.parse(JSON.stringify(this.data.todos))
    let target = todosCopy.filter(item => item.id === e.currentTarget.id)[0]
    console.log(e.target.dataset.actiontype)
    if (e.target.dataset.actiontype === 'edit') {
      app.dataBetweenPage.editInfo = target
    } else if (e.target.dataset.actiontype === 'changeStatus') {
      target.status = target.status === 'undone' ? 'success' : 'undone'
      TodoModel.update(['status'], target, () => {
        todosCopy = todosCopy.filter(item => item.id !== target.id)
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
  deleteTodo: function ({ currentTarget: { id } }) {
    let todosCopy = JSON.parse(JSON.stringify(this.data.todos)),
      target = todosCopy.filter(item => item.id === id)[0]
    wx.showModal({
      title: '删除待办事项',
      content: `确定要删除【${target.content}】吗？`,
      success: ({ confirm }) => {
        if (confirm) {
          TodoModel.destroy(target.id, () => {
            todosCopy = todosCopy.filter(item => item.id !== target.id)
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