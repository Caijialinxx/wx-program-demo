import { TodoModel } from '../../../utils/leancloud.js'
const app = getApp()

Page({
  data: {
    todo: null,
    reminder: null,
  },
  onLoad: function () {
    this.setData({
      todo: app.dataBetweenPage.editInfo,
      reminder: app.dataBetweenPage.reminder
    })
  },
  playAudio: function (successFn, errorFn) {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = '/pages/tones/cute_tone.wav'
    innerAudioContext.onPlay(() => {
      successFn.call(undefined)
    })
    innerAudioContext.onError((res) => {
      errorFn.call(undefined, res.errMsg)
    })
  },
  setReminder: function () {
    if (this.data.reminder) {
      this.setData({
        reminder: null
      })
    } else {
      let date = new Date().toISOString().substr(0, 10),
        time = new Date(Date.now() + 10800000).toTimeString().substr(0, 5)
      this.setData({
        reminder: {
          date: date,
          time: time
        }
      })
    }
  },
  changeData: function(e) {
    if (e.type === 'change') {
      let reminderCopy = JSON.parse(JSON.stringify(this.data.reminder))
      if (e.currentTarget.dataset.target === 'reminder-date') {
        reminderCopy.date = e.detail.value
        this.setData({
          reminder: reminderCopy
        })
      } else if (e.currentTarget.dataset.target === 'reminder-time') {
        reminderCopy.time = e.detail.value
        this.setData({
          reminder: reminderCopy
        })
      }
    } else {
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
    }
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
      app.dataBetweenPage.editInfo = this.data.todo
      app.dataBetweenPage.reminder = this.data.reminder
      wx.showToast({
        title: '保存成功',
      })
    }, (error) => {
      wx.showToast({
        title: error,
        icon: 'none'
      })
    })
    let [year, month, date] = this.data.reminder.date.split('-'), [hour, minute] = this.data.reminder.time.split(':')
    let duration = new Date(year, month - 1, date, hour, minute).getTime() - Date.now()
    let clockid = setTimeout(this.playAudio.bind(undefined, () => {
      wx.showModal({
        title: '勾勾TODO',
        content: todoCopy.content,
        showCancel: false,
        confirmText: '知道了',
        success: ({ confirm }) => {
          if (confirm)
            clearTimeout(clockid)
        }
      })
    }, (error) => {
      wx.showToast({
        title: error,
        icon: 'none'
      })
    }), duration)
  },
})