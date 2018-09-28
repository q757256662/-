// pages/login/login.js
var app = getApp()
var http = require('../../utils/request.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    pwd: "",
    showModel: true,
    userInfo: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    token: "",
    msg: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSetting({
      success: (res) => {
        //判断用户已经授权。不需要弹框
        if (res.authSetting['scope.userInfo']) {
          
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          app.getUserInfoAuto((userInfo) => {
            //加载框
            wx.showLoading({
              title: '加载中',
            })
            //更新数据
            that.setData({
              userInfo
            })
          }, (token, msg) => {
            //更新数据
            that.setData({
              token,
              msg
            })
            if (app.globalData.token != "") {
              wx.switchTab({
                url: '../dashboard/dashboard',
              })
            }
            wx.hideLoading()
          })
        }

      },
      fail: function () {
        wx.showToast({
          title: '系统提示:网络错误',
          image: '../../images/error.png',
          duration: 1500,
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
  agreeGetUser: function (e) {
    //设置用户信息本地存储
    try {
      wx.setStorageSync('userInfo', e.detail.userInfo)
    } catch (e) {
      wx.showToast({
        title: '系统提示:网络错误',
        image: '../../images/error.png',
        duration: 1500,
      })
    }
    wx.showLoading({
      title: '加载中...'
    })
    let that = this
    that.setData({
      showModel: false
    })
    that.getOP(e.detail.userInfo)
  },
  bindGetUserInfo: function (e) {
    var that = this
    if ( !this.data.pwd && this.data.phone.length!==11){
      if (this.data.phone !== 11){
        wx.showModal({
          content: '手机号必须为11位',
          showCancel: false
        })
      }else{
        wx.showModal({
          content: '账号密码不能为空',
          showCancel: false
        })
      }
      
    }else{
      // console.log(e.detail)
      // 调用应用实例的方法获取全局数据
      app.getUserInfo((userInfo) => {
        //更新数据
        that.setData({
          userInfo
        })
        // console.log(token)

      }, (token, msg) => {
        //更新数据
        that.setData({
          token,
          msg
        })
        // console.log(app.globalData.token)

        if (app.globalData.token != "") {
          wx.switchTab({
            url: '../dashboard/dashboard',
          })
        }else{
          wx.showModal({
            content: msg,
            showCancel: false
          })
        }
      }, e.detail, that.data.phone, that.data.pwd)
    }
    
  },
  handleInputUser(e){
    let phone = e.detail.value
    this.setData({
      phone
    })
  },
  handleInputUpwd(e) {
    let pwd = e.detail.value
    this.setData({
      pwd
    })
  }
})