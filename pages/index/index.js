//index.js
//获取应用实例
//index.js
var finished, unfinished
const app = getApp()
/*let ip = 'http://129.28.156.141:8080/dailyLife';
function refreshHabit(that) {
  let token = getApp().globalData.token;
  console.log(token)
  wx.request({
    url: ip + '/api/habit/gethabit?kind=1&token=' + token,
    success: function (res) {
      that.setData({
        allTime: res.data.allTime,
        morning: res.data.morning,
        noon: res.data.noon,
        evening: res.data.evening,
        condition0: (Object.keys(res.data.allTime).length != 0),
        condition1: (Object.keys(res.data.morning).length != 0),
        condition2: (Object.keys(res.data.noon).length != 0),
        condition3: (Object.keys(res.data.evening).length != 0)
      })
    },
    fail: function (res) {
      wx.showToast({
        title: '网络连接失败',
        icon: 'none'
      })
    }
  })
}

function refreshPlan(that) {
  let token = getApp().globalData.token;
  wx.request({
    url: ip + '/api/plan/getplan?kind=1&token=' + token,
    success: function (res) {
      console.log(res.data.unfinished)
      console.log(res.data.finished)
      finished = res.data.finished
      unfinished = res.data.unfinished
      that.setData({
        finished: res.data.finished,
        unfinished: res.data.unfinished,
        condition11: (Object.keys(res.data.finished).length != 0),
        condition22: (Object.keys(res.data.unfinished).length != 0)
      })
    },
    fail: function (res) {
      wx.showToast({
        title: '网络连接失败',
        icon: 'none'
      })
    }
  })
}*/

Page({
  data: {
    TabCur: 0,
    scrollLeft: 0,
  },
  tabSelect(e) {
    console.log(e.currentTarget.dataset.id)
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    if (e.currentTarget.dataset.id == 0) {
      //习惯
      var that = this
      //refreshHabit(that)
    } else {
      //计划
      var that = this
      //refreshPlan(that)
    }
  },
  onShow: function (options) {
    var that = this
    //refreshHabit(that)
    //refreshPlan(that)
  },

  /*click: function (e) {
    var that = this
    console.log(e.currentTarget.dataset.flag)
    if (e.currentTarget.dataset.flag) {
      //今日已经打卡了
      let token = getApp().globalData.token;
      wx.request({
        url: ip + '/api/habit/clockin?kind=0&token=' + token + '&habitId=' + e.currentTarget.dataset.id,
        success: function (res) {
          var status = res.data.status
          if (status == 1) {
            wx.showToast({
              title: res.data.desp,
            })
            refreshHabit(that)
          } else {
            wx.showToast({
              title: res.data.desp,
              icon: 'none'
            })
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '网络连接失败',
            icon: 'none'
          })
        }
      })
    } else {
      //今日还没有打卡
      let token = getApp().globalData.token;
      wx.request({
        url: ip + '/api/habit/clockin?kind=1&token=' + token + '&habitId=' + e.currentTarget.dataset.id,
        success: function (res) {
          var status = res.data.status
          if (status == 1) {
            wx.showToast({
              title: res.data.desp
            })
            refreshHabit(that)
          } else {
            wx.showToast({
              title: res.data.desp,
              icon: 'none'
            })
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '网络连接失败',
            icon: 'none'
          })
        }
      })

    }
    console.log(e.currentTarget.dataset.id)
  },
  finish: function (e) {
    var that = this
    //现在属于未完成这个列表中，要完成它，并把它加入完成列表中
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    console.log("id=" + id)
    let token = getApp().globalData.token;
    wx.request({
      url: ip + '/api/plan/finish?kind=1&token=' + token + '&planId=' + id,
      success: function (res) {
        var status = res.data.status
        var desp = res.data.desp
        if (status == 1) {
          wx.showToast({
            title: desp,
          })
          refreshPlan(that)
        } else {
          wx.showToast({
            title: desp,
            icon: 'none'
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '网络连接失败',
          icon: 'none'
        })
      }
    })
  },
  cancelFinish: function (e) {
    var that = this
    //现在属于完成这个列表中，要取消完成它，并把它加入完成列表中
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    let token = getApp().globalData.token;
    wx.request({
      url: ip + '/api/plan/finish?kind=0&token=' + token + '&planId=' + id,
      success: function (res) {
        var status = res.data.status
        var desp = res.data.desp
        if (status == 1) {
          wx.showToast({
            title: desp,
          })
          refreshPlan(that)
        } else {
          wx.showToast({
            title: desp,
            icon: 'none'
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '网络连接失败',
          icon: 'none'
        })
      }
    })
  },
  revise: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    console.log("index.js" + id)
    wx.navigateTo({
      //kind=2代表是从index页跳转过去的
      url: '../edplan/edplan?kind=2&id=' + id,
      complete: function (e) {
        console.log(e)
      }
    })
  },
  onPullDownRefresh: function () {
    var that = this
    refreshHabit(that)
    refreshPlan(that)
  }*/
})

