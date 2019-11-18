// pages/add/add.js
let ip = 'http://62.234.134.58:8080/weekday/homework/homework';
var id = 0;
var userId = 0;
var title = '';
var content = '';
var done = 0;
var createTime = '';
var deadline = '';
var doneTime = '';
var kind = -1;
Date.prototype.Format = function (fmt) { //author: meizz 
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: new Date().Format('yyyy-MM-dd'),
    skin: false,
    startdate: new Date().Format('yyyy-MM-dd')
  },
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    kind = options.kind
    console.log("kind=" + kind)
    if (kind == 1) {
      id = options.id
      userId = options.userId
      title = options.title
      content = options.content
      done = options.done
      createTime = options.createTime
      deadline = options.deadline
      doneTime = options.doneTime
      that.setData({
        title: title,
        desp: content,
        date: deadline
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
  savePlan: function (e) {
    var that = this
    console.log(e.detail.value.title)
    console.log(e.detail.value.desp)
    console.log(e.detail.value.date)
    if (e.detail.value.title == "") {
      wx.showToast({
        title: '科目名不能为空',
        icon: 'none'
      })
      return
    }
    if (e.detail.value.desp == "") {
      wx.showToast({
        title: '具体内容不能为空',
        icon: 'none'
      })
      return
    }
    if (e.detail.value.title.length < 1 || e.detail.value.title.length > 5) {
      wx.showToast({
        title: '科目名的长度必须在1-5字之间',
        icon: 'none'
      })
      return
    }
    if (e.detail.value.desp.length < 1 || e.detail.value.desp.length > 17) {
      wx.showToast({
        title: '具体内容的长度必须在1-17字之间',
        icon: 'none'
      })
      return
    }
    if (e.detail.value.date < (new Date().Format('yyyy-MM-dd'))) {
      wx.showToast({
        title: '日期选择错误',
        icon: 'none'
      })
      return
    }
    //console.log(new Date().Format('yyyyMMdd'));
    var temp = e.detail.value.date
    temp = temp.substr(0, 4) + temp.substr(5, 2) + temp.substr(8, 2)
    //console.log(temp)
    let token = wx.getStorageSync('token')
    console.log(kind)
    if (kind == 0) {
      console.log("here")
      wx.request({
        url: ip,
        data: {
          userId: 'test',
          title: e.detail.value.title,
          content: e.detail.value.desp,
          done: 0,
          createTime: new Date().Format('yyyyMMdd'),
          deadline: temp,
          doneTime: '',
        },
        header: {
          'content-type': 'application/json',
          'token': token
        },
        method: 'POST',
        success: function (res) {
          console.log(res.data)
          var code = res.data.code
          var message = res.data.msg
          if (code == -3) {
            wx.showToast({
              title: message,
            })
            that.setData({
              title: "",
              desp: "",
              date: new Date().Format('yyyy-MM-dd')
            })
          } else {
            wx.showToast({
              title: message,
              icon: 'none',
              iconflag_plan: true
            })
            wx.navigateBack({
              
            })
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '网络连接错误',
            icon: 'none'
          })
        }
      })
    } else if (kind == 1) {
      //此处应该为修改
      wx.request({
        url: ip,
        method: 'PUT',
        data: {
          id: id,
          userId: userId,
          title: e.detail.value.title,
          content: e.detail.value.desp,
          done: done,
          createTime: createTime,
          deadline: temp,
          doneTime: doneTime
        },
        header: {
          'Content-Type': 'application/json',
          'token': token
        },
        success: function (res) {
          console.log('修改成功')
          console.log(res.data)
          var code = res.data.code
          var message = res.data.msg
          if (code != 0) {
            wx.showToast({
              title: message
            })
            return
          }
          wx.showToast({
            title: message,
            iconflag_plan: true
          })
          wx.navigateBack({
            
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
  }
})