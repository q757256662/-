// pages/putUserMsg/putUserMsg.js

var app = getApp();
var http = require('../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userMsg:{},
    reg:true,
    index:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options){
    // console.log(options)
    this.page(options)

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
  page(options){
    let query = JSON.parse(options.query)
    let index = JSON.parse(options.index)
    this.setData({
      userMsg: query,
      index
    })
    // console.log(query)
  },
  handleEdit(e){
    if(this.data.reg){
      var obj = {
        ...this.data.userMsg,
        ...e.detail.value
      }
      if (obj.Up) {
        obj.Up = 1
      } else {
        obj.Up = 0
      }
      if (obj.Down) {
        obj.Down = 1
      } else {
        obj.Down = 0
      }
      if (obj.State) {
        obj.State = 1
      } else {
        obj.State = 0
      }
      obj.Permission = '' + obj.Up + '' + obj.Down
      if(obj.State==0){
        obj.MAC = ""
        obj.Phone = ""
      }
      this.setData({
        userMsg: obj
      })
      http.putReq('checkuser', obj, res => {
        if (res.rel) {
          http.putReq('staffmanager', obj, res => {
            if (res.rel) {
              wx.showToast({
                title: '修改成功',
              })
              this.backToPrev()
            } else {
              wx.showToast({
                title: res.error,
              })
            }
          })
        } else {
          wx.showToast({
            title: res.error,
          })
        }
      })
    }else{
      wx.showToast({
        title: '信息有误',
        image:'../../images/error.png'
      })
    }
    
  },
  handleBack(){
    wx.navigateBack({})
  },
  checkPhone(e){
    let Phone = e.detail.value
    let reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
    if(!reg.test(Phone)){
      wx.showToast({
        title: '手机号有误',
        image: '../../images/error.png'
      })
      this.setData({
        reg: false
      })
    }else{
      this.setData({
        reg: true
      })
    }
  },
  CheckUserName(e){
    let userName = e.detail.value
    if (userName==""){
      wx.showToast({
        title: '请输入用户名',
        image: '../../images/error.png'
      })
      this.setData({
        reg:false
      })
    }else{
      this.setData({
        reg: true
      })
    }
  },
  CheckMac(e) {
    let Mac = e.detail.value
    if (Mac.length == 12 || Mac.length == "") {
      this.setData({
        reg: true
      })
    } else {
      wx.showToast({
        title: '请输入正确的MAC',
        icon:'none'
      })
      this.setData({
        reg: false
      })
    }
  },

  backToPrev(){
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    let obj = prevPage.data.userList
    obj[this.data.index] = this.data.userMsg
    prevPage.setData({
      SeletuserList:obj
    })
    setTimeout(()=>{
      wx.navigateBack({
        delta:1
      })
    })
  }
})