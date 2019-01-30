// pages/openMessage/openMessage.js
var app = getApp()
let wxparse = require("../../wxParse/wxParse.js");
var http = require('../../utils/request.js')

Page({
  data: {
    dkheight: 300,
    dkcontent: "",
    delId:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    http.header.Authorization = 'Bearer ' + app.globalData.token
    http.getReq('MessageContents?id=' + options.id, res1 => {
      this.setData({
        delId: Number(options.IMID)
      })
      this.setData({
        dkcontent: res1.Contents
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
    })
  },
  onUnload(){
    this.handleDelete()
  },
  
  handleDelete() {
    http.putReq('UpdateReadFromList', [this.data.delId], res => {
    })
  },
  soonSee(){
    wx.navigateBack({})
  }
})