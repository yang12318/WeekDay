// pages/detail/detail.js
var mailId = -1;
var fileId = 0;
let ip = 'http://62.234.134.58:8080/weekday/mail/mail'
var attachip = 'http://62.234.134.58:8080/weekday/mail/attachment'
let downloadip = 'http://62.234.134.58:8080/weekday/mail/attach'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasFile: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    mailId = options.mailId
    var token = wx.getStorageSync('token')
    var that = this
    console.log('待查看邮件的id为' + mailId)
    wx.request({
      url: ip,
      method: 'GET',
      header: {
        'token': token
      },
      data: {
        'id': mailId
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
        var mailto = res.data.data.mailto
        var mailFrom = res.data.data.mailFrom
        var subject = res.data.data.subject
        var sentTime = res.data.data.sentDate
        var text = res.data.data.text
        var arr1 = mailto.split(">")[0].split("<")
        fileId = res.data.data.fileId
        console.log(arr1)
        var arr2 = mailFrom.split(">")[0].split("<")
        console.log(arr2)
        //arr1和arr2都是如下情况：
        //如果有Nickname，数组中第一个元素就是Nickname，否则第一个元素为空
        //无论如何，数组中第二个元素一定是邮箱（尖括号已去除）
        //因此，这样操作之后都可以按照数组元素直接赋值，不必再做其他考虑

        //如果没有Nickname，按照@之前的内容赋值
        if(arr1[0] == '') {
          arr1[0] = arr1[1].split("@")[0]
        }
        if(arr2[0] == '') {
          arr2[0] = arr2[1].split("@")[0]
        }
        if(fileId == 0 || fileId == '') {
          that.setData({
            hasFile: false
          })
        } else {
          that.setData({
            hasFile: true
          })
          var arr3 = fileId.split(",")
          var fileNums = arr3.length


        }
        that.setData({
          subject: subject,
          mailto: arr1[1],
          mailtoNick: arr1[0],
          mailFrom: arr2[1],
          mailFromNick: arr2[0],
          text: text,
          sentTime: sentTime,
          
        })

      },
      fail: function(res) {
        wx.showToast({
          title: '网络连接失败',
          icon: 'none'
        })
      }
    })
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
  downloadF: function (e) {
    console.log('fileId='+fileId)
    var token = wx.getStorageSync('token')
    const downloadTask = wx.downloadFile({
      url: downloadip + '?id=' + fileId,
      header: {
        'token': token
      },
      success: function (res) {
        res.tempFilePath
        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: function (res) {
            wx.showToast({
              title: '下载成功，文件已保存到' + res.savedFilePath,
              icon: 'none',
              duration: 3000
            })
          },
          fail: function (res) {
            wx.showToast({
              title: '下载失败',
              icon: 'none'
            })
            return
          }
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '下载失败',
          icon: 'none'
        })
        return
      }
    })

    //显示下载进度
    downloadTask.onProgressUpdate((res) => {
      console.log(res.progress)
    })
  }
})