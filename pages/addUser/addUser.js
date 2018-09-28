// pages/addUser/addUser.js
var app = getApp()
var http = require('../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userMsg: {},
    formData: {
      Down: "",
      MAC: "",
      Phone: "",
      Remark: "",
      State: "",
      Up: "",
      UserName: "",
    },
    autoFocus:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  handleAdd(e) {
    let obj = { ...this.data.formData,
      ...e.detail.value
    }
    // console.log(obj)
    if (obj.Phone.length != 11 || obj.UserName == "" ) {
      if (obj.Phone.length != 11){
        wx.showModal({
          content: '手机号必须为11位',
          showCancel: false
        })
      }else{
        wx.showModal({
          content: '请输入用户名或者手机号',
          showCancel: false
        })
      }
      
    } else {
      http.header.Authorization = 'Bearer ' + app.globalData.token
      http.postReq('staffmanager', obj, res => {
        if (res.status == 200) {
          wx.showModal({
            content: res.rel,
          })
        } else {
          wx.showToast({
            title: '添加失败',
            image: '../../images/error.png',
          })
        }
      })
    }

  }
})