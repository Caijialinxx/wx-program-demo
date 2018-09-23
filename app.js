import { getCurrentUser } from './utils/leancloud.js'

App({
  onLaunch: function () {
    let user = getCurrentUser()
    this.globalData.userInfo = user ? user : wx.getStorageSync('login')
  },
  dataBetweenPage: {},
  globalData: {
    userInfo: null
  }
})