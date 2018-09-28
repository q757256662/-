// pages/test/test.js

var http = require('../../utils/request.js')

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "18824641572",
    pwd: "1111",
    showModel: true,
    userInfo: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    token: "",
    msg: "",
    Wx_token: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.get_Token()
    var that = this
    wx.getSetting({
      success: (res) => {
        //判断用户已经授权。不需要弹框
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          app.getUserInfoAuto((userInfo) => {
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
            console.log(token)

          })
        }

      },
      fail: function() {
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

  }, //获取用户信息新接口
  agreeGetUser: function(e) {
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
  bindGetUserInfo: function(e) {
    var that = this
    //console.log(e.detail)
    //调用应用实例的方法获取全局数据
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
      console.log(token)

    }, e.detail, that.data.phone, that.data.pwd)

    //app.getUserInfo()
    //console.log(token)
    //console.log(123)
  },
  get_Token() {
    http.getReq('WeiXinOpen/HttpGetAccess_token', res => {
      let Wx_token = res.WxToken.access_token
      this.setData({
        Wx_token
      })

    })
  },
  handleSendMsg(e) {
    // let wx_token = this.get_Token()
    let formId = e.detail.formId
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + this.data.Wx_token,
      method: "post",
      data:{
        touser: "oCBvzt-SyyVchrpeTyxZYoY1OEeg",
        template_id: 'JIBYhrkWWqzRcIwzvKSSF-2TTaQoxGKOAQ8OjK0gWx4',
        miniprogram: {
          appid: "wx80bfb39017d69db7",
          path: "pages/login/login"
        }, 
            data: {
              "keyword1": {
                "value": "339208499"
              },
              "keyword2": {
                "value": "2015年01月05日 12:30"
              },
              "keyword3": {
                "value": "粤海喜来登酒店"
              },
              "keyword4": {
                "value": "广州市天河区天河路208号"
              },
              "keyword5": {
                "value": "广州市天河区天河路208号"
              }
            }
      },
      success(res) {
        console.log(res)
      }
    })


  },
  handleTo(){
    wx.navigateTo({
      url: '../out/out',
    })
  }

})