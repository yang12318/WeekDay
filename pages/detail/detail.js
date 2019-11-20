// pages/detail/detail.js
var mailId = -1;
let ip = 'https://wkdday.com:8080/weekday/mail/mail'
var attachip = 'https://wkdday.com:8080/weekday/mail/attachment'
let downloadip = 'https://wkdday.com:8080/weekday/mail/attach'
let attachDetailip = 'https://wkdday.com:8080/weekday/mail/attachment'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasFile: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    mailId = options.mailId
    var token = wx.getStorageSync('token')
    var that = this
    console.log('待查看邮件的id为' + mailId)
    wx.request({
      url: ip,
      method: 'GET',
      header: {
        'token': token
      },
      data: {
        'id': mailId
      },
      success: function(res) {
        console.log(res.data)
        var code = res.data.code
        var msg = res.data.msg
        if(code != 0) {
          wx.showToast({
            title: msg,
            icon: 'none'
          })
          return
        }
        var mailto = res.data.data.mailto
        var mailFrom = res.data.data.mailFrom
        var subject = res.data.data.subject
        var sentTime = res.data.data.sentDate
        //特殊处理一些标签
        var text = res.data.data.text.replace("<body>", "").replace("</body>", "").replace("<html>", "").replace("</html>", "").replace(/<img/gi, '<img style="max-width:100%;height:auto;float:left;display:block" ').replace(/<section/g, '<div').replace(/\/section>/g, '\div>');
        console.log(text)
        let fileId = res.data.data.fileId
        //arr1和arr2都是如下情况：
        //如果有Nickname，数组中第一个元素就是Nickname，否则第一个元素为空
        //无论如何，数组中第二个元素一定是邮箱（尖括号已去除）
        //因此，这样操作之后都可以按照数组元素直接赋值，不必再做其他考虑
        //如果没有Nickname，按照@之前的内容赋值
        //当没有mailto或mailFrom的时候特殊处理一下
        let arr1 = []
        let arr2 = []
        if(mailto != '') {
          arr1 = mailto.split(">")[0].split("<")
          console.log(arr1)
          if (arr1[0] != '') {
            arr1[0] = arr1[1].split("@")[0]
          }
        } else {
          arr1.push('')
          arr1.push('')
        }
        if(mailFrom != '') {
          arr2 = mailFrom.split(">")[0].split("<")
          console.log(arr2)
          if (arr2[0] != '') {
            arr2[0] = arr2[1].split("@")[0]
          }
        } else {
          arr2.push('')
          arr2.push('')
        }
        
        if(fileId == 0 || fileId == '' || fileId == null) {
          that.setData({
            hasFile: false
          })
        } else {
          var arr3 = fileId.split(",")
          var fileNums = arr3.length
          console.log('附件数量为' + fileNums)
          let fileInfo = []
          for(let i = 0; i < fileNums; i++) {
            wx.request({
              url: attachDetailip + '?id=' + arr3[i],
              header: {
                'token': token,
                'Content-Type': 'charset=UTF-8'
              },
              success: function(res) {
                console.log('附件' + i + '信息：')
                console.log(res.data)
                let code = res.data.code
                let msg = res.data.msg
                if(code != 0) {
                  wx.showToast({
                    title: '获取附件失败',
                    icon: 'none'
                  })
                  return
                }
                fileInfo.push(res.data.data)
                console.log(fileInfo)
                that.setData({
                  hasFile: true,
                  fileNums: fileNums + '个',
                  fileInfo: fileInfo
                })
              }, 
              fail: function(res) {
                wx.showToast({
                  title: '网络连接失败',
                  icon: 'none'
                })
              }
            })  
          }
          
        }
        that.setData({
          subject: subject,
          mailto: arr1[1],
          //mailtoNick: arr1[0],
          mailFrom: arr2[1],
          //mailFromNick: arr2[0],
          text: text,
          sentTime: sentTime,

        })

      },
      fail: function(res) {
        wx.showToast({
          title: '网络连接失败',
          icon: 'none'
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
  downloadF: function (e) {
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
          // console.log(wx.env.USER_DATA_PATH + "/" + e.currentTarget.dataset.name)
          wx.getFileSystemManager().saveFile({
            tempFilePath: res.tempFilePath,
            filePath: wx.env.USER_DATA_PATH + "/" + e.currentTarget.dataset.name,
            // filePath: wx.env.USER_DATA_PATH + "/" + "test.md",
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