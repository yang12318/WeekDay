//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    let that = this;
    // 登录
    wx.login({

      success(res) {
        console.log('登录', res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          //发起网络请求
          //console.log('登录', res.code)
          wx.request({
            url: 'http://62.234.134.58:8080/weekday/WeChatLogin/doPost',
            data: {
              code: res.code
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            method: 'POST', 
            success: function (res) {
              console.log(res.data)
              var code = res.data.code
              var msg = res.data.msg
              if (code == -2) {
                wx.showToast({
                  title: 'code格式错误',
                  icon: 'none'
                })
                return
              }
              if (code == -10) {
                wx.showToast({
                  title: '登录失败',
                  icon: 'none'
                })
                return
              }
              var token = res.data.token
              console.log(token)
              wx.setStorage({
                key: 'token',
                data: token,
              })
              wx.showToast({
                title: '登录成功',
              })
              that.globalData.token = encodeURIComponent(wx.getStorageSync('token'));

            },
            fail: function (res) {
              wx.showToast({
                title: '登录失败',
                icon: 'none'
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
          wx.showToast({
            title: '登录失败',
            icon: 'none'
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
  },
  globalData: {
    userInfo: null,
    token: ''
  }
})