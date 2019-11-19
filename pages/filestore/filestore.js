// pages/filestore/filestore.js
let ip = "https://wkdday.com:8080/weekday";
let folderId;
var fId;              //用来在对话框和函数之间传参
var that
function refresh(e) {
  let token = wx.getStorageSync('token');
  wx.request({
    url: ip + '/file/folder',
    header: {
      'token': token
    },
    success: function (res) {
      //展示文件夹数据
      console.log(res.data)
      let code = res.data.code
      let msg = res.data.msg
      if(code != 0) {
        wx.showToast({
          title: msg,
          icon: 'none'
        })
        return
      }
      //设置文件夹界面
      that.setData({
        folders: res.data.data
      })
    },
    fail: function (res) {
      wx.showToast({
        title: '网络连接失败',
        icon: "none"
      })
    }
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    folderName:null
  },
  showModal(e){
    fId = e.currentTarget.dataset.id
    this.setData({
      modalName:e.currentTarget.dataset.target
    })
  },
  hideModal(e){
    this.setData({
      modalName:null
    })
  },
  //获取文件id
  getId:(e)=>{
    id = e.currentTarget.id
  },
  //新建文件夹提交表单
  newFolder:function(e){
    console.log(e.detail.value.folderName);
    if(e.detail.value.folderName == ""){
      wx.showToast({
        title: '文件夹名不能为空',
        icon:'none'
      })
      return
    }
    let token = wx.getStorageSync('token');
    wx.request({
      url: ip + '/file/folder',
      data:{
        folderName:e.detail.value.folderName
      },
      header:{
        'content-type': 'application/x-www-form-urlencoded',
         'token': token
      },
      method: 'POST',
      success:(res)=>{
        let status = res.data.code;
        if(status == -3){
          wx.showToast({
            title: '身份校验错误',
            icon:'none'
          })
          return
        };
        if(status == -2){
          wx.showToast({
            title: '数据为空',
            icon:"none"
          })
          return
        }
        if(status == 0){
          wx.showToast({
            title: '创建成功',
            icon:'none'
          })
          refresh(that)
        }
      }
    })
    //清空文件夹内容
    console.log("test");
    console.log(that);
    that.setData({
      folderName:""
    })
    console.log("test2");
    
  },
  //重命名文件夹
  changeFolder:function(e){
    console.log(e.detail.value.folderName);
    console.log(e)
    if (e.detail.value.folderName == "") {
      wx.showToast({
        title: '文件夹名不能为空',
        icon: 'none'
      })
      return
    }
    let token = wx.getStorageSync('token');
    wx.request({
      url: ip + '/file/folder',
      data: {
        folderId: fId,
        newFolderName: e.detail.value.folderName
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      method: 'PUT',
      success: (res) => {
        let status = res.data.code;
        if (status == -3) {
          wx.showToast({
            title: '身份校验错误',
            icon: 'none'
          })
        };
        if (status == -7) {
          wx.showToast({
            title: '文件夹不存在',
            icon: "none"
          })
        }
        if (status == 0) {
          wx.showToast({
            title: '修改成功',
            icon: 'none'
          })
          refresh(that)
        }
      }
    })
  },
  //删除文件夹
  deleteFolder: (e)=>{
    let flag = false
    wx.showModal({
      title: '提示',
      content: '确定要删除吗',
      success:(sm)=>{
        //用户点击确定，调用删除方法
        if(sm.confirm){
          let token = wx.getStorageSync('token');
          wx.request({
            url: ip + '/file/folder?folderId=' + e.currentTarget.dataset.id,
            header: {
              'token': token
            },
            method: 'DELETE',
            success:(res)=>{
              console.log("删除成功",res.data)
              let status = res.data.code;
              let msg = res.data.msg;
              if(status == -3){
                wx.showToast({
                  title: msg,
                  icon: 'none'
                })
                return
              }
              if(status == 0){
                wx.showToast({
                  title: '删除成功',
                })
                refresh(that)
              }
            }
          })
        }
        else if(sm.cancel){
          console.log("用户点击取消")
        }
      }
    })
  },
  //跳转到具体的文件夹页面
  skipToFile:(e)=>{
    folderId = e.currentTarget.dataset.id;
    console.log(folderId);
    wx.navigateTo({
      url: '../files/files?folderId='+folderId,
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
    that = this
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
  //点击出现更多选项
  
})