// pages/index/index.js
let ip = 'https://wkdday.com:8080/weekday/homework/homework';
let flagFirst = true;
var unfinished = []         //undone
var finished = []           //done
function sleep(numberMillis) {
  var now = new Date();
  var exitTime = now.getTime() + numberMillis;
  while (true) {
    now = new Date();
    if (now.getTime() > exitTime)
      return;
  }
}
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
      if (res.statusCode != 200) {
        wx.showToast({
          title: '网络连接失败',
          icon: 'none'
        })
        return
      }
      unfinished = []
      finished = []
      var count = 0
      for (let i = res.data.data.undone.length - 1; i >= 0; i--) {
        if(res.data.data.undone[i].list == null) {
          continue
        }
        for(let j = 0, k = res.data.data.undone[i].list.length; j < k; j++) {
          unfinished.push(res.data.data.undone[i].list[j]);
          count = count + 1
        }
        
      }
      count = 0
      for (let i = res.data.data.done.length - 1; i >= 0; i--) {
        if(res.data.data.done[i].list == null) {
          continue
        }
        for(let j = 0, k = res.data.data.done[i].list.length; j < k; j++) {
          finished.push(res.data.data.done[i].list[j]);
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
    var that = this;
    new Promise((resolve,reject) => {
      wx.showLoading({
        title: '数据在路上~',
        mask: true
      })
      // 登录
      wx.login({
       
        success(res) {
          console.log('登录', res.code)
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            //发起网络请求
            console.log('登录', res.code)
            wx.request({
              url: 'https://wkdday.com:8080/weekday/WeChatLogin/doPost',
              data: {
                code: res.code
              },
              header: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
              },
              method: 'POST',
              success: function (res) {
                wx.hideLoading();
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
                wx.setStorageSync('token', token)
                
                wx.showToast({
                  title: '登录成功',
                })
                resolve();
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
 
    }).then(() => {
      flagFirst = false;
      refresh(that);
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
    let that = this
    if(flagFirst == false) {
      refresh(that)
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
    if(flagFirst == true) {
      return
    }
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
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success:(sm)=>{
        //确定要删除
        if(sm.confirm){
          var that = this
          var id = e.currentTarget.dataset.id
          var token = wx.getStorageSync('token')
          console.log('待删除的id=' + id)
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
            success: function (res) {
              if (res.statusCode != 200) {
                wx.showToast({
                  title: '网络连接失败',
                  icon: 'none'
                })
                return
              }
              var msg = res.data.msg
              var code = res.data.code
              console.log(res.data)
              if (code != 0) {
                wx.showToast({
                  title: '删除失败',
                  icon: 'none'
                })
                return
              }
              wx.showToast({
                title: '删除成功',
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
        else if(sm.cancel){
          //用户点击取消
        }
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
    var doneTime = new Date().Format('yyyy-MM-dd')
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
        if (res.statusCode != 200) {
          wx.showToast({
            title: '网络连接失败',
            icon: 'none'
          })
          return
        }
        var code = res.data.code
        var message = res.data.msg
        if (code != 0) {
          wx.showToast({
            title: '作业完成失败'
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