// pages/email/email.js
var ip = 'http://62.234.134.58:8080/weekday/mail/mailPre'
function refreshInbox(that) {
  let token = wx.getStorageSync('token')
  wx.request({
    url: ip,
    method: 'GET',
    header: {
      'token': token
    },
    data: {
      'mailboxId': '???',
      'folderName': 'INBOX'
    },
    success: function(res) {
      var code = res.data.code
      var msg = res.data.msg
      if(code != 0) {
        wx.showToast({
          title: msg,
          icon: 'none'
        })
        return
      }
      wx.showToast({
        title: msg,
      })
      
    },
    fail: function(res) {
      wx.showToast({
        title: '网络连接失败',
        icon: 'none'
      })
    }
  })
}

function refreshSent(that) {
  

}

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})