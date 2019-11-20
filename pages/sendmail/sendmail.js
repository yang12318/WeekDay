// pages/sendemail/sendmail.js
var emailId = -1
let ip = 'https://wkdday.com:8080/weekday/mail/send'
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
    emailId = options.emailId
    console.log('emailId='+ emailId)
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
  sendmail: function(e) {
    if(e.detail.value.mailto == '') {
      wx.showToast({
        title: '请填写收件人',
        icon: 'none'
      })
      return
    }
    if(e.detail.value.subject == '') {
      wx.showToast({
        title: '请填写邮件主题',
        icon: 'none'
      })
      return
    }
    if(e.detail.value.text == '') {
      wx.showToast({
        title: '请填写邮件内容',
        icon: 'none'
      })
      return
    }
    if (!(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(e.detail.value.mailto))) {
      wx.showToast({
        title: '邮箱输入格式错误',
        icon: 'none'
      });
      return
    }
    var that = this
    var token = wx.getStorageSync('token')
    var text = e.detail.value.text
    console.log('邮件内容=' + text)
    wx.request({
      url: ip,
      header: {
        'token': token,
        'Content-Type': 'application/json'
      },
      method:'POST',
      data:{
        'mailboxId': emailId,
        'mailto': e.detail.value.mailto,
        'subject': e.detail.value.subject,
        'text': text,
        'cc': '',
        'bcc': '',
        'filesPath' : ''
      },
      success: function(res) {
        console.log(res.data)
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
          title: '邮件发送成功',
        })
        wx.navigateBack({
          
        })
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