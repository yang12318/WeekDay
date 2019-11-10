// pages/login/login.js
let ip = 'http://62.234.134.58:8080/weekday/mail/mailbox'
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

  },
  save: function(e) {
    var that = this
    if(e.detail.value.account == "") {
      wx.showToast({
        title: '邮箱不能为空',
        icon: 'none'
      })
      return
    }
    if(e.detail.value.password == "") {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return
    }
    if(e.detail.value.account.length)

    //这里是否要对邮箱长度和密码长度做判定？


    var token = wx.getStorageSync('token')
    wx.request({
      url: ip,
      method: 'POST',
      header: {
        'token': token,
        'Content-Type': 'application/json'
      },
      data: {
        'type': 'Coremail',
        'mailFrom': e.detail.value.account,
        'password': e.detail.value.password
      },
      success: function(res) {
        console.log(res.data)
        if(res.data.code != 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          return
        }
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          iconflag_plan: true
        })
        var userId = res.data.data.userId
        var userName = res.data.data.username
        wx.navigateTo({
          url: '../email/email?userId='+userId,
        })
        console.log('username=' + userName)
      },
      fail: function(res) {
        wx.showToast({
          title: '网络连接错误',
          icon: 'none'
        })
      }
    })
  }
})