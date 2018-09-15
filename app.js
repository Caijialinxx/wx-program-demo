import { getCurrentUser } from './utils/leancloud.js'

App({
  onLaunch: function () {
    let user = getCurrentUser()
    if (user) {
      this.globalData.userInfo = user
    } else {
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                this.globalData.userInfo = res.usersInfo
              }
            })
          } else {
            wx.showToast({
              title: '未授权登录！',
              icon: 'none'
            })
          }
        }
      })
    }
  },
  globalData: {
    userInfo: null
  }
})