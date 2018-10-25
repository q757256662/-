// pages/openMessage/openMessage.js
var app = getApp()
let wxparse = require("../../wxParse/wxParse.js");
var http = require('../../utils/request.js')

Page({
  data: {
    dkheight: 300,
    dkcontent: "<p>123</p>",
    delId:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    http.header.Authorization = 'Bearer ' + app.globalData.token
    http.getReq('Messages?page=' + options.index + '&limit=1', res1 => {
      this.setData({
        delId: res1.MessagesList[0].IMID
      })
      res1.MessagesList[0].Contents = res1.MessagesList[0].Contents.replace(/src="/g, 'src="' + app.globalData.imgAddress)
      // console.log(img)
      this.setData({
        dkcontent: res1.MessagesList[0].Contents
      })


      wx.getSystemInfo({
        success: (res) => {
          let winHeight = res.windowHeight;
          this.setData({
            dkheight: winHeight - winHeight * 0.05 - 80
          })
          wxparse.wxParse('dkcontent', 'html', this.data.dkcontent, this, 5);
        }
      })
      this.handleDelete()
    })
    // console.log(options)
    // 获得高度
    

  },
  onHide:function(){
    console.log(123)
    this.handleDelete()
  },
  handleDelete() {
    // console.log(e.currentTarget.dataset)
    http.delReq('deleteMessageList', [this.data.delId], res => {
      // console.log(res)
    })
  },

})