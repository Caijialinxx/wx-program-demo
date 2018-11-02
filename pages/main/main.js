import { TodoModel } from '../../utils/leancloud.js'
const app = getApp()

Page({
  data: {
    todos: [],
    maxOrder: undefined,
    todoDraft: '',
    deletedTodos: [],
  },
  onLoad: function () {
    this.showTodos()
  },
  onShow: function () {
    this.showTodos()
  },
  changeData: function ({ detail: { value } }) {
    this.setData({
      todoDraft: value
    })
  },
  addTodo: function () {
    let todosCopy = JSON.parse(JSON.stringify(this.data.todos)),
      newTodo = {
        content: this.data.todoDraft,
        status: 'undone',
        remark: '',
        order: this.data.maxOrder + 1,
        reminder: null,
        overdue: null
      }
    TodoModel.create(newTodo,
      (id) => {
        newTodo.id = id
        todosCopy.push(newTodo)
        this.setData({
          todoDraft: '',
          maxOrder: newTodo.order,
          todos: todosCopy
        })
      },
      (error) => {
        wx.showToast({
          title: error,
          icon: 'none'
        })
      })
  },
  showTodos: function () {
    if (app.globalData.userInfo) {
      TodoModel.fetch(items => {
        this.setData({
          todos: items.filter(item => {
            return Boolean(item.overdue) === false || item.overdue.value > Date.now()
          })
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
  updateTodo: function (e) {
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
  },
  deleteTodo: function ({ currentTarget: { dataset: { id } } }) {
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
              todos: todosCopy,
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
  }
})