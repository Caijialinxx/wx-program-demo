import { getCurrentUser } from './utils/leancloud.js'

App({
  onLaunch: function () {
    let user = getCurrentUser()
    this.globalData.userInfo = user ? user : wx.getStorageSync('login')
  },
  dataBetweenPage: {},
  globalData: {
    todos: null,
    options: {
      notShowSuccess: true,
      notShowOverdue: true
    },
    userInfo: null
  }
})