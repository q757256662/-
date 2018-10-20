// pages/acceptUploadState/acceptUploadState.js

var app = getApp();
var http = require('../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userState: {},
    userList:[],
    companyId:'',
    touser:'',
    index:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let query = JSON.parse(options.query)
    let index = JSON.parse(options.index)
    this.setData({
      userState: query,
      index
    })
    this.page()
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
  page(){
    http.header.Authorization = 'Bearer ' + app.globalData.token
    http.getReq("addme?CompanyId=" + this.data.userState.CompanyId, res => {
      if (res.status == 200) {
        this.setData({
          userList: res.data.rows
        })
      } else {
        wx.showToast({
          title: '无员工绑定mac',
          image: '../../images/error.png',
        })
        setTimeout(()=>{
          wx.navigateBack({})
        },1000)
        
      }

    })
  },
  handleSubmit(e) {
    let touser = ""
    let canReceiver = ""
    for (let i = 0; i < Object.keys(e.detail.value).length; i++) {
      let name = 'touser' + (i)
      if (e.detail.value[name]) {
        touser += this.data.userList[i].Id + '|'
        canReceiver += this.data.userList[i].UserName +','
      }
    }
    if (touser==""){
      touser = "|"
    }
    this.setData({
      touser: touser
    })

    let obj = {}
    obj.CompanyId = this.data.userState.CompanyId
    obj.action = 'Receive'
    obj.touser = touser
    let totalObj = this.data.userState
    if (canReceiver == "") {
      canReceiver = "所有员工,"
    }
    canReceiver = canReceiver.slice(0, -1)
    // console.log("能打开文件的员工"+canReceiver)
    totalObj.Receiver = canReceiver
    http.putReq('config', obj, res => {
      if(res.status==200){
        wx.showToast({
          title: '修改成功',
        })
        this.setData({
          userState: totalObj
        })
        this.backToPrev()
      }else{
        wx.showToast({
          title: '修改失败',
          image: '../../images/error.png',
        })
      }
    })
  },
  backToPrev() {
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    let obj = prevPage.data.userList
    obj[this.data.index] = this.data.userState
    prevPage.setData({
      SeletuserList: obj
    })
    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      })
    })
  }
})