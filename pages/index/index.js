// pages/index/index.js
let ip = 'http://62.234.134.58:8080/weekday/homework/homework';
var unfinished = []         //undone
var finished = []           //done
function refresh(that) {
  let token = wx.getStorageSync('token');
  console.log('这里token是' + token)
  wx.request({
    url: ip,
    method: 'GET',
    header: {
      'token': token
    },
    success: function (res) {
      console.log(res.data)
      unfinished = []
      finished = []
      var count = 0
      for (let i = 0, m = res.data.data.undone.length; i < m; i++) {
        for(let j = 0, k = res.data.data.undone[i].list.length; j < k; j++) {
          unfinished.push(res.data.data.undone[i].list[j]);
          var temp = unfinished[count].deadline
          unfinished[count].deadline = temp.substring(0, 4) + '-' + temp.substring(4, 6) + '-' + temp.substring(6, 8)
          count = count + 1
        }
        
      }
      count = 0
      for (let i = 0, m = res.data.data.done.length; i < m; i++) {
        for(let j = 0, k = res.data.data.done[i].list.length; j < k; j++) {
          finished.push(res.data.data.done[i].list[j]);
          var temp = finished[count].doneTime
          finished[count].doneTime = temp.substring(0, 4) + '-' + temp.substring(4, 6) + '-' + temp.substring(6, 8)
          count = count + 1
        }
      }
      that.setData({
        finished: finished,
        unfinished: unfinished,
        condition1: (Object.keys(finished).length != 0),
        condition2: (Object.keys(unfinished).length != 0),
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
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    var that = this
    refresh(that)
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
    var that = this
    refresh(that)
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
    refresh(that)
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
  revise: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var userId = e.currentTarget.dataset.userId
    var title = e.currentTarget.dataset.title
    var content = e.currentTarget.dataset.content
    var done = e.currentTarget.dataset.done
    var createTime = e.currentTarget.dataset.createTime
    var deadline = e.currentTarget.dataset.deadline
    var doneTime = e.currentTarget.dataset.doneTime
    wx.navigateTo({
      //kind=1代表是要修改
      url: '../editwork/editwork?kind=1&id=' + id + '&userId=' + userId + '&title=' + title + '&content=' + content + '&done=' + done + '&createTime' + createTime + '&deadline=' + deadline + '&doneTime=' + doneTime,
      success: function (res) {
        refresh(that)
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  add: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      //kind=0代表是要添加
      url: '../editwork/editwork?kind=0'
    })
  },
  delete: function(e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var token = wx.getStorageSync('token')
    console.log('待删除的id='+ id)
    wx.request({
      url: ip,
      method: 'DELETE',
      header: {
        'token': token,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        'id': parseInt(id)
      },
      success: function(res) {
        var msg = res.data.msg
        var code = res.data.code
        console.log(res.data)
        if(code != 0) {
          wx.showToast({
            title: msg,
            icon: 'none'
          })
          return
        }
        wx.showToast({
          title: '删除成功',
        })
        refresh(that)
      },
      fail: function(res) {
        wx.showToast({
          title: '网络连接失败',
          icon: 'none'
        })
      }
    })
  },
  finishHomework: function(e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var userId = e.currentTarget.dataset.userId
    var title = e.currentTarget.dataset.title
    var content = e.currentTarget.dataset.content
    var done = e.currentTarget.dataset.done
    var createTime = e.currentTarget.dataset.createTime
    var deadline = e.currentTarget.dataset.deadline
    var doneTime = new Date().Format('yyyyMMdd')
    var token = wx.getStorageSync('token')
    wx.request({
      url: ip,
      method: 'PUT',
      data: {
        id: id,
        userId: userId,
        title: title,
        content: content,
        done: 1,
        createTime: createTime,
        deadline: deadline,
        doneTime: doneTime
      },
      header: {
        'Content-Type': 'application/json',
        'token': token
      },
      success: function (res) {
        var code = res.data.code
        var message = res.data.msg
        if (code != 0) {
          wx.showToast({
            title: message
          })
          return
        }
        wx.showToast({
          title: '作业已完成',
          iconflag_plan: true
        })
        refresh(that)
      },
      fail: function (res) {
        wx.showToast({
          title: '网络连接失败',
          icon: 'none'
        })
      }

    })
  }
})