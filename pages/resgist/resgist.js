// pages/resgist.js
var app = getApp();
var http = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userMsg: { //用户信息
      comanyName: "",
      email: "",
      tel: "",
      userName: "",
      pwd: "",
      code: ""
    },
    reg: { //正则规则校验
      comanyName: false,
      email: false,
      tel: false,
      userName: false,
      pwd: false,
      code: false
    },
    lockReg: false, //手机验证码是否锁定
    lockContent: "接收验证码", //手机验证码文字显示内容
    regImg: "", //验证码图片
    modalShow: false, //模态框是否显示
    modalReg: ""//验证码输入框
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
    // this.GetImageReg();
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
  handleEdit(form) { //提交表单
    // console.log(form.detail.value)
    if (this.data.reg.comanyName && this.data.reg.email && this.data.reg.tel && this.data.reg.userName && this.data.reg.userName && this.data.reg.pwd && this.data.reg.code) {
      http.postReq('customer/addCus', form.detail.value, res => {
        if (res.rel) {
          wx.showToast({
            title: '注册成功',
          })
          // this.backToPrev()
        } else {
          wx.showToast({
            title: res.error,
          })
        }
      })
    } else {
      wx.showToast({
        title: '请完善资料',
        image: "../../images/error.png"
      })
    }

  },
  checkPhone(e) {
    let Phone = e.detail.value
    let reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
    if (!reg.test(Phone)) {
      wx.showToast({
        title: '手机号有误',
        image: '../../images/error.png'
      })
      this.setData({
        ['reg.comanyName']: false
      })
    } else {
      this.setData({
        ['reg.comanyName']: true
      })
      this.setData({
        ['userMsg.tel']: Phone
      })
    }
  },
  CheckUserName(e) {
    let userName = e.detail.value
    if (userName == "") {
      wx.showToast({
        title: '请输入用户名',
        image: '../../images/error.png'
      })
      this.setData({
        ['reg.userName']: false
      })
    } else {
      this.setData({
        ['reg.userName']: true
      })
    }
  },
  checkEmail(e) {
    let Email = e.detail.value
    let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    console.log(e.detail.value)
    console.log(reg.test(Email))
    if (reg.test(Email)) {
      this.setData({
        ['reg.email']: true
      })
    } else {
      wx.showToast({
        title: '请输入正确的邮箱',
        image: '../../images/error.png'
      })
      this.setData({
        ['reg.email']: false
      })
    }
  },
  checkCompany(e) {
    let checkCompany = e.detail.value
    if (checkCompany == "") {
      wx.showToast({
        title: '请输入用户名',
        image: '../../images/error.png'
      })
      this.setData({
        ['reg.userName']: false
      })
    } else {
      this.setData({
        ['reg.userName']: true
      })
    }
  },
  CheckPWD(e) {
    let pwd = e.detail.value
    if (pwd == "") {
      wx.showToast({
        title: '请输入用户密码',
        image: '../../images/error.png'
      })
      this.setData({
        ['reg.pwd']: false
      })
    } else if (pwd.length < 4) {
      wx.showToast({
        title: '用户密码不能小于4位',
        image: '../../images/error.png'
      })
      this.setData({
        ['reg.pwd']: false
      })
    } else {
      this.setData({
        ['reg.pwd']: true
      })
    }
  },
  handleAcceptReg() {


    if (this.data.userMsg.tel == "") {
      wx.showToast({
        title: '请输入手机号码',
        image: '../../images/error.png'
      })
    } else {
      this.setData({
        modalShow: true
      })
      this.GetImageReg();

    }
  },
  GetImageReg() {
    http.getReqHeader("customer/VerifyCode", res => {
      if (res && res.header && res.header['Set-Cookie']) {
        wx.setStorageSync('cookieKey', res.header['Set-Cookie']);//保存Cookie到Storage
      }
      this.setData({
        regImg: "data:image/png;base64," + res.data.Data.ImgCode
      })
    })
  },
  //模态框确认
  modalConfirm() {
    http.getReq('customer/CheckImageCode?ImgCode=' + this.data.modalReg, res => {
      if (res.Success) {
        this.setData({
          modalShow:false
        })
        http.getReq('customer/getCheckcode?phone=' + this.data.userMsg.tel, res => {
          if (res.Success) {
            this.setData({
              lockReg: true,
              lockContent: "已发送"
            })
            var min = 60;
            var time = setInterval(() => {
              if (min != 0) {
                min--;
                this.setData({
                  lockContent: min + "秒后重新获取"
                })
              } else {
                clearTimeout(time);
                this.setData({
                  lockReg: false,
                  lockContent: "接收验证码"
                })
              }
            }, 1000)
          }
        })

      }else{
        wx.showToast({
          title: res.ErrMes,
          image: "../../images/error.png"
        })
      }
    })
  },
  //模态框取消
  modalCancel() {
    this.setData({
      modalShow: false
    })
  },
  //模态框输入
  handleModalChange(e) {
    var modalReg = e.detail.value;
    this.setData({
      modalReg
    })
  },
  handleUpdateReg(){
    this.GetImageReg();
    this.setData({
      modalReg:""
    })
  }
})