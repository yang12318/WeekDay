// pages/files/files.js
var ip = "https://wkdday.com:8080/weekday";
var downloadip = 'https://wkdday.com:8080/weekday/file/download'
var fId;              //用来在对话框和函数之间传参
var that;
//刷新
function refresh(that) {
  let token = wx.getStorageSync('token');
  let folderId = that.data.folderId;
  console.log("刷新获取的forlderId+"+folderId);
  wx.request({
    url: ip + '/file/files?folderId='+folderId,
    header: {
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
      //展示文件夹数据
      console.log(res.data)
      let code = res.data.code
      let msg = res.data.msg
      if (code != 0) {
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        })
        return
      }
      //设置文件数据
      that.setData({
        files: res.data.data,
        filename:''
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
    path:'',
    filename:'',
    folderId:null
  },
  showModal(e) {
    fId = e.currentTarget.dataset.id
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null,
      filename:''
    })
  },
  //删除文件
  deletFile:function(e){
    let flag = false
    wx.showModal({
      title: '提示',
      content: '确定要删除吗',
      success: (sm) => {
        //用户点击确定，调用删除方法
        if (sm.confirm) {
          let token = wx.getStorageSync('token');
          console.log("id"+e.currentTarget.dataset.id);
          wx.request({
            url: ip + '/file/file?id=' + e.currentTarget.dataset.id,
            header: {
              'token': token
            },
            method: 'DELETE',
            success: (res) => {
              if (res.statusCode != 200) {
                wx.showToast({
                  title: '网络连接失败',
                  icon: 'none'
                })
                return
              }
              console.log("删除成功", res.data)
              var that = this;
              let status = res.data.code;
              let msg = res.data.msg;
              if (status == -3) {
                wx.showToast({
                  title: 'msg',
                  icon: 'none'
                  
                })
                return
              }
              else if (status == -2) {
                wx.showToast({
                  title: msg,
                  icon: 'none'
                })
              }
              else if(status == -1){
                wx.showToast({
                  title: msg,
                  icon: 'none'
                })
              }
              else if(status==0){
                wx.showToast({
                  title: '删除成功',
                })
                refresh(that);
              }
            }
          })
        }
        else if (sm.cancel) {
          console.log("用户点击取消")
        }
      }
    })
  },
  //选择文件
  chooseFile:function(e){
    var that = this;
    wx.chooseMessageFile({
      count:1,//一次选择一个文件
      type:'file', //除掉图片和视频的文件
      success:(res)=>{
        let josnStr = JSON.stringify(res);
        let file = JSON.parse(josnStr);
        console.log(file);
        var size = file.tempFiles[0].size;
        var filename = file.tempFiles[0].name;
        console.log(file.tempFiles[0].path);
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
    let token = wx.getStorageSync('token');
    let folderId = that.data.folderId;
    let filename = that.data.filename;
    //选择为空
    if(filename == ''){
      wx.showToast({
        title: '文件为空',
        icon:'none'
      })
    }
    else{
      wx.uploadFile({
        url: 'https://wkdday.com:8080/weekday/file/upload?folderId=' + folderId + '&fileName=' + filename,
        filePath: that.data.path,
        name: 'file',
        header: {
          'Content-Type': 'multipart/form-data',
          'chartset': 'utf-8',
          'token': token
        },
        formData: {
          filename: that.data.filename,
          folderId: that.data.folderId
        },
        method: 'POST',  //请求方式
        success: (res) => {
          if (res.statusCode != 200) {
            wx.showToast({
              title: '网络连接失败',
              icon: 'none'
            })
            return
          }
          var that = this;
          let status ;
          let josnRes = JSON.parse(res.data);
          //console.log(josnRes);
          let msg ;
          msg = res.data.msg;
          status = josnRes.code;
          if (status == -3) {
            wx.showToast({
              title: '身份校验错误',
              icon: 'none'
            })
            that.setData({
              filename:''
            })
          }
          else if (status == -2) {
            wx.showToast({
              title: '数据为空',
              icon: 'none'
            })
            that.setData({
              filename: ''
            })
          }
          else if (status == -1) {
            wx.showToast({
              title: '文件名为空',
              icon: 'none'
            })
            that.setData({
              filename: ''
            })
          }
          else if (status == -4) {
            console.log("file test");
            wx.showToast({
              title: '文件已经存在',
              icon: 'none'
            })
            that.setData({
              filename: ''
            })
          }
          else if (status == -7) {
            wx.showToast({
              title: '文件夹不存在',
              icon: 'none'
            })
            that.setData({
              filename: ''
            })
          }
          else {
            wx.showToast({
              title: '上传成功',
              icon: "none",
              duration: 5000,
              mask: true,
            })
            refresh(that);
          }
        }
      })
    }
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
      url: ip +'/file/files?folderId='+folderId,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': token
      },
      success:(res)=>{
        if (res.statusCode != 200) {
          wx.showToast({
            title: '网络连接失败',
            icon: 'none'
          })
          return
        }
        console.log("res.data:"+res.data)
        console.log(JSON.stringify(res.data));
        that.setData({
          files:res.data.data,
          folderId:folderId
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

  },
  download: function(e) {
    let fileId = e.currentTarget.dataset.id
    console.log('fileId=' + fileId)
    let token = wx.getStorageSync('token')
    const downloadTask = wx.downloadFile({
      url: downloadip + '?id=' + fileId,
      header: {
        'token': token
      },
      success: function (res) {
        console.log(res)
        console.log(res.tempFilePath)
        if (res.statusCode == 200) {
          //用200做一次判断
          wx.getFileSystemManager().saveFile({
            tempFilePath: res.tempFilePath,
            filePath: wx.env.USER_DATA_PATH + "/" + e.currentTarget.dataset.name,
            success: function (res) {
              // 打开文档
              wx.showToast({
                title: '文件已保存到：' + res.savedFilePath,
                icon: 'none',
                duration: 5000
              })
              wx.openDocument({
                filePath: res.savedFilePath,
                success: function (res) {
                  console.log('打开文档成功')
                },
                fail: function () {
                  console.log('打开失败');
                }
              })
            }
          })
        }
        else {
          wx.showToast({
            title: '下载失败',
            icon: 'none'
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '下载失败',
          icon: 'none'
        })
        return
      }
    })
  }
})