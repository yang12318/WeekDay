// pages/files/files.js
var ip = "http://62.234.134.58:8080/weekday";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    path:'',
    filename:''
  },
  //选择文件
  chooseFile:function(e){
    wx.chooseMessageFile({
      count:1,//一次选择一个文件
      type:'file', //除掉图片和视频的文件
      success(res){
        var size = res.tempFiles[0].size;
        var filename = res.tempFiles[0].filename;
        var newfilename = filename + "";
        if(size > 41943404){
          wx.showToast({
            title:"文件大小不能超过4MB",
            icon:'none',
            duration:2000,
            mask:true
          })
        }
        else{
          that.setData({
            path:res.tempFiles[0].path,
            filename:filename
          })
        }
      }
    })
  },
  //上传文件 将文件上传到服务器
  uploadFile:function(e){
    var that = this
    wx.uploadFile({
      url: 'http://62.234.134.58:8080/weekday/file/upload',
      filePath: that.data.path,
      name: 'file',
      success:(res)=>{
        wx.showToast({
          title: '上传成功',
          icon:"none",
          duration:5000,
          mask:true,
        })
      }
    })
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let folderId = options.folderId;//获取文件夹id
    var that = this
    let token = wx.getStorageSync('token');
    console.log('详情页接收参数为' + folderId);
    wx.request({
      url: ip +'/file/files',
      header: {
        'token': token
      },
      success:(res)=>{
        console.log(res.data)
        that.setData({
          files:res.data.fileEntity
        })
      },
      fail:(res)=>{
        wx.showToast({
          title: '网络连接失败',
          icon:'none'
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

  }
})