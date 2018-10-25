import { TodoModel } from '../../utils/leancloud.js'
const app = getApp()

Page({
  data: {
    todos: [],
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
        order: todosCopy.length
      }
    TodoModel.create(newTodo,
      (id) => {
        newTodo.id = id
        todosCopy.push(newTodo)
        this.setData({
          todoDraft: '',
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
          todos: items.filter(item => item.status !== 'deleted')
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
      deletedTodosCopy = JSON.parse(JSON.stringify(this.data.deletedTodos)),
      target = todosCopy.filter(item => item.id === id)[0]
    wx.showModal({
      title: '删除待办事项',
      content: `确定要删除【${target.content}】吗？`,
      success: ({ confirm }) => {
        if (confirm) {
          TodoModel.destroy(target.id, () => {
            delete target.id
            delete target.order
            deletedTodosCopy.push(target)
            todosCopy = todosCopy.filter(item => item.id !== undefined)
            todosCopy.map((item, index) => { item.order = index })
            // 删除之后重新排序
            TodoModel.updateAll(['order'], todosCopy, () => {
              this.setData({
                todos: todosCopy,
                deletedTodos: deletedTodosCopy
              })
            }, (error) => {
              wx.showToast({
                title: error,
                icon: 'none'
              })
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