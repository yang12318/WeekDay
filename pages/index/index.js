// pages/manage/manage.js
let ip = 'http://62.234.134.58:8080/weekday/homework/homework';
var selectedFlag = []         //undone
var selectedFlag2 = []        //done
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
      for (let i = 0, m = res.data.data.undone.length; i < m; i++) {
        selectedFlag.push(false)
      }
      for (let i = 0, m = res.data.data.done.length; i < m; i++) {
        selectedFlag2.push(false)
      }
      that.setData({
        finished: res.data.data.done,
        unfinished: res.data.data.undone,
        condition11: (Object.keys(res.data.data.done).length != 0),
        condition22: (Object.keys(res.data.data.undone).length != 0),
        selectedFlag: selectedFlag,
        selectedFlag2: selectedFlag2
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
    // 展开折叠
    selectedFlag: [true, true, true, true],
    selectedFlag2: [true, true, true, true],
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
  // 展开折叠选择  
  changeToggle: function (e) {
    var index = e.currentTarget.dataset.index;
    if (this.data.selectedFlag[index]) {
      this.data.selectedFlag[index] = false;
    } else {
      this.data.selectedFlag[index] = true;
    }
    this.setData({
      selectedFlag: this.data.selectedFlag
    })
  },
  changeToggle2: function (e) {
    var index = e.currentTarget.dataset.index;
    if (this.data.selectedFlag2[index]) {
      this.data.selectedFlag2[index] = false;
    } else {
      this.data.selectedFlag2[index] = true;
    }
    this.setData({
      selectedFlag2: this.data.selectedFlag2
    })
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
    var id = e.currentTarget.dataset.id
    var title = e.currentTarget.dataset.title
    var desp = e.currentTarget.dataset.desp
    var date = e.currentTarget.dataset.date
    wx.navigateTo({
      //kind=1代表是要修改

      //这个等晓洋去问

      url: '../editwork/editwork?kind=1&id=' + id + '&title=' + title + '&desp=' + desp + '&date=' + date,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  add: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      //kind=0代表是要添加
      url: '../editwork/editwork?kind=0',
    })
  }
})