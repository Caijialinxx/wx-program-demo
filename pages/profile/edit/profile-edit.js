import { linkWeChat, UserModel, AV } from '../../../utils/leancloud.js'
const app = getApp()

Page({
  data: {
    userInfo: null,
  },
  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo,
    })
  },
  changeAvatar: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        let userCopy = JSON.parse(JSON.stringify(this.data.userInfo))
        new AV.File(userCopy.id, {
          blob: { uri: res.tempFilePaths[0], },
        }).save().then(file => {
          userCopy.avatarUrl = file.url()
          UserModel.update('avatarUrl', userCopy, () => {
            this.setData({
              userInfo: userCopy
            })
            app.globalData.userInfo = userCopy
          }, (error) => {
            wx.showToast({
              title: error,
              icon: 'none'
            })
          })
        }).catch(console.error)
      }
    })
  },
  changeData: function ({ detail: { value } }) {
    let userCopy = JSON.parse(JSON.stringify(this.data.userInfo))
    userCopy.username = value
    this.setData({
      userInfo: userCopy,
    })
  },
  changeName: function () {
    let userCopy = JSON.parse(JSON.stringify(this.data.userInfo))
    UserModel.update('username', userCopy, () => {
      app.globalData.userInfo = userCopy
    }, (error) => {
      wx.showToast({
        title: error,
        icon: 'none'
      })
    })
  },
  linkWeChat: function () {
    wx.showModal({
      title: '关联账号',
      content: '确定要将勾勾TODO与您的微信关联？关联之后可使用微信一键登录',
      showCancel: true,
      success: function ({ confirm }) {
        if (confirm) {
          linkWeChat()
        }
      }
    })
  }
})