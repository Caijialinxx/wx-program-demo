import { linkWeChat } from '../../../utils/leancloud.js'
const app = getApp()

Page({
  data: {
    userInfo: app.globalData.userInfo,
  },
  linkWeChat: function() {
    wx.showModal({
      title: '关联账号',
      content: '确定要将勾勾TODO与您的微信关联？关联之后可使用微信一键登录',
      showCancel: true,
      success: function ({ confirm }) {
        if(confirm){
          linkWeChat()
        }
      }
    })
  }
})