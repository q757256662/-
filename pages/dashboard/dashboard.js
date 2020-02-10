// pages/dashboard/dashboard.js
var app = getApp()
var http = require('../../utils/request.js')
Page({
  data: {
    userForm:{
      UserName: undefined,
      Phone: undefined,
      State: 1,
      Up: undefined,
      Down: 0,
      MAC: undefined,
      Remark: undefined,
      UserPwd: ''
    },
    userInfo:null,
    currentState : false,
    reg:true,
    url:"pages/dashboard/dashboard"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(){
    // this.page()
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
    // this.showMsg()
    this.page()
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
  onPullDownRefresh: function () {
    http.header.Authorization = 'Bearer ' + app.globalData.token
    http.getReq('personinfo', res => {
      this.setData({
        userForm: res.data.rows,
        userInfo: app.globalData.userInfo
      })
    })
    // this.showPoint()
    
    wx.stopPullDownRefresh()
  },
  page(){
    http.header.Authorization = 'Bearer ' + app.globalData.token
    http.getReq('personinfo',res=>{
      this.setData({ 
        userForm: res.data.rows,
        userInfo: app.globalData.userInfo
      })
      // this.showPoint()
    })
  },
  editMode(){
    this.setData({ currentState: !this.data.currentState})
  },
  handleSubmit(e){
    if(this.data.reg){
      let form = Object.assign(this.data.userForm, e.detail.value)
      form.State ? form.State = 1 : form.State = 0
      form.ReadSM ? form.ReadSM = 1 : form.ReadSM = 0
      if (form.State==0){
        form.Phone = ""
        form.MAC = ""
      }
      this.setData({
        userFrom:form
      })
      http.putReq('personinfo', form, res => {
        if (res.status == 200) {
          wx.showToast({
            title: '修改成功',
          })
          this.setData({ currentState: !this.data.currentState })
        } else {
          wx.showToast({
            title: '修改失败',
            image: '../../images/error.png',
          })
        }
        this.setData({
          userForm: form
        })
      })
    }else{
      wx.showToast({
        title: '信息有误',
        image: '../../images/error.png'
      })
    }
    // console.log(form)
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
        reg: false
      })
    }else{
      this.setData({
        reg: true
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
        reg: false
      })
    }else{
      this.setData({
        reg: true
      })
    }
  },
  showPoint(){
    if (this.data.userForm.MessageCount!==0){
      wx.setTabBarBadge({
        index: 3,
        text: String(this.data.userForm.MessageCount)
      })
    }else{
      wx.removeTabBarBadge({
        index: 3
      })
    }
    
  },
  onShareAppMessage: function () {
    wx.updateShareMenu({
      success(res) {
        console.log(res)
       }
    })
    }
  
})