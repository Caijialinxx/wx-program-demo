import { TodoModel } from '../../../utils/leancloud.js'
const app = getApp()

Page({
  data: {
    todo: null
  },
  onLoad: function() {
    this.setData({
      todo: app.dataBetweenPage.editInfo
    })
  },
  changeData: function(e) {
    let todoCopy = JSON.parse(JSON.stringify(this.data.todo))
    if (e.currentTarget.dataset.target === 'status') {
      if (todoCopy.status === 'undone') {
        todoCopy.status = 'success'
      } else if (todoCopy.status === 'success') {
        todoCopy.status = 'undone'
      }
    } else {
      todoCopy[e.currentTarget.dataset.target] = e.detail.value
    }
    this.setData({
      todo: todoCopy
    })
  },
  save: function() {
    let todoCopy = JSON.parse(JSON.stringify(this.data.todo))
    if (todoCopy.content.trim() === '') {
      todoCopy.content = app.dataBetweenPage.editInfo.content
    }
    let keys = ['content', 'status', 'remark']
    TodoModel.update(keys, todoCopy, () => {
      this.setData({
        todo: todoCopy
      })
      app.dataBetweenPage.editInfo = todoCopy
    }, (error) => {
      wx.showToast({
        title: error,
        icon: 'none'
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {}
})