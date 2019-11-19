// pages/email/email.js
var emailId = -1
var ip = 'https://wkdday.com:8080/weekday/mail/mailPre'
let loginip = 'https://wkdday.com:8080/weekday/mail/mailbox'
//condition1是收件箱 condition2是已发送
function refreshInbox(that) {
  let token = wx.getStorageSync('token')
  try {
    emailId = wx.getStorageSync('emailId')
    console.log('refreshInbox读取到的emailId为' + emailId)
    if(emailId == -1 || emailId == '') {
      that.setData({
        'status1': false,
        'status2': true
      })
      return
    }
    wx.request({
      url: ip + '?mailboxId=' + emailId + '&folderName=INBOX',
      method: 'GET',
      header: {
        'token': token
      },
      success: function (res) {
        console.log(res.data)
        var code = res.data.code
        var msg = res.data.msg
        if (code != 0) {
          wx.showToast({
            title: msg + " 请重新登录",
            icon: 'none'
          })
          that.setData({
            'status1': false,
            'status2': true
          })
          return
        }
        var inboxTemp = []
        for(let i = 0, m = res.data.data.length; i < m; i++) {
          inboxTemp.push(res.data.data[i])
          var t = inboxTemp[i].mailFrom
          //如果mailFrom本身已经是空的了，不能再调用split方法，否则程序就崩溃了
          //另注：不确定是不是真的存在mailFrom是空的邮件
          //另另注：但是确定存在mailto是空的邮件
          if(t != '') {
            t = t.split(">")[0].split("<")[1]
            inboxTemp[i].mailFrom = t
          }
        }
        that.setData({
          inbox: inboxTemp,
          condition1: (Object.keys(res.data.data).length != 0)
        })

      },
      fail: function (res) {
        wx.showToast({
          title: '网络连接失败',
          icon: 'none'
        })
      }
    })
  } catch(e) {
    that.setData({
      'status1': false,
      'status2': true  
    })
  }
}

function refreshSent(that) {
  let token = wx.getStorageSync('token')
  try {
    emailId = wx.getStorageSync('emailId')
    console.log('refreshSent读取到的emailId为' + emailId)
    if(emailId == -1 || emailId == '') {
      that.setData({
        'status1': false,
        'status2': true
      })
    }
    wx.request({
      url: ip + '?mailboxId=' + emailId + '&folderName=Sent Items',
      method: 'GET',
      header: {
        'token': token
      },
      success: function (res) {
        console.log(res.data)
        var code = res.data.code
        var msg = res.data.msg
        if (code != 0) {
          wx.showToast({
            title: msg + " 请重新登录",
            icon: 'none'
          })
          that.setData({
            'status1': false,
            'status2': true
          })
          return
        }
        var sentTemp = []
        for (let i = 0, m = res.data.data.length; i < m; i++) {
          sentTemp.push(res.data.data[i])
          var t = sentTemp[i].mailto
          //如果mailto本身已经是空的了，不能再调用split方法，否则程序就崩溃了
          //另注：不确定是不是真的存在mailFrom是空的邮件
          //另另注：但是确定存在mailto是空的邮件
          if (t != '') {
            t = t.split(">")[0].split("<")[1]
            sentTemp[i].mailto = t
          }
        }
        that.setData({
          sent: sentTemp,
          condition2: (Object.keys(res.data.data).length != 0)
        })

      },
      fail: function (res) {
        wx.showToast({
          title: '网络连接失败',
          icon: 'none'
        })
      }
    })
  } catch (e) {
    that.setData({
      'status1': false,
      'status2': true
    })
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,
    account: '17020031025@stu.ouc.edu.cn',
    password: 'L1L2Y3123456',
    status1 : false,         //收件箱界面
    status2 : false         //登录界面
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    emailId = -1
    try {
      emailId = wx.getStorageSync('emailId')
      console.log('onLoad中读取到的emailId为' + emailId)
      if(emailId == -1 || emailId == '') {
        that.setData({
          'status1': false,
          'status2': true
        })
      } else {
        that.setData({
          'status1': true,
          'status2': false
        })
      }
    } catch(e) {
      that.setData({
        'status1': false,
        'status2': true
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    var that = this
    console.log('status1=' + that.data.status1)
    console.log('status2=' + that.data.status2)
    if(that.data.status1 == true) {
      //收件箱界面可用
      if (that.data.TabCur == 0) {
        refreshInbox(that);
      } else {
        refreshSent(that);
      }
    } else {
      //that.data.status2 == true
      //登录界面可用
    }
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
    var that = this
    if(that.data.status2 == true) {
      //登录界面没有下拉刷新功能
      return
    }
    if(that.data.TabCur == 0) {
      refreshInbox(that);
    } else {
      refreshSent(that);
    }
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
  add: function(e) {
    wx.navigateTo({
      url: '../sendmail/sendmail?emailId='+emailId,
    })
  },
  detailinfo: function(e) {
    wx.navigateTo({
      url: '../detail/detail?mailId=' + e.currentTarget.dataset.id,
    })
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    var that = this
    if(e.currentTarget.dataset.id == 0) {
      refreshInbox(that)
    } else {
      refreshSent(that)
    }
  },
  login: function (e) {
    var that = this
    if (e.detail.value.account == "") {
      wx.showToast({
        title: '邮箱不能为空',
        icon: 'none'
      })
      return
    }
    if (e.detail.value.password == "") {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return
    }
    if(e.detail.value.account.length <= 15) {
      wx.showToast({
        title: '仅支持ouc学生邮箱',
        icon: 'none'
      })
      return
    }
    if (!(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(e.detail.value.account))) {
      wx.showToast({
        title: '邮箱输入格式错误',
        icon: 'none'
      });
      return
    }
    //检测输入的邮箱账号是否以@stu.ouc.edu.cn结尾
    //@stu.ouc.edu.cn 这个字符串的长度为15
    //我们截取account的最后15个字符与我们规定的后缀进行比对
    var distance = e.detail.value.account.length - 15
    if (distance < 0 || e.detail.value.account.lastIndexOf("@stu.ouc.edu.cn") != distance) {
      wx.showToast({
        title: '仅支持ouc学生邮箱',
        icon: 'none'
      })
      return
    }

    var token = wx.getStorageSync('token')
    wx.request({
      url: loginip,
      method: 'POST',
      header: {
        'token': token,
        'Content-Type': 'application/json'
      },
      data: {
        'type': 'coremail',
        'mailFrom': e.detail.value.account,
        'password': e.detail.value.password
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.code != 0) {
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
        emailId = res.data.data.id
        wx.setStorageSync('emailId', emailId)
        that.setData({
          status1: true,
          status2: false,
          account: '',
          password: ''
        })
        if(that.data.TabCur == 0) {
          refreshInbox(that)
        } else {
          refreshSent(that)
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '网络连接错误',
          icon: 'none'
        })
      }
    })
  }
})