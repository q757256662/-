// pages/setUploadState/setUploadState.js
var app = getApp();
var http = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userState:{},
    userList:[],
    touser:""
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
    http.getReq("add?CompanyId=" + this.data.userState.CompanyId,res=>{
      if(res.status==200){
        
        this.setData({
          userList: res.data.rows
        })
        // console.log(this.data.userState)
      }else{
        // wx.showToast({
        //   title: '无员工绑定mac',
        //   icon:'error'
        // })
      }
      
    })
  },
  handleSubmit(e){
    // console.log(e.detail.value)
    let touser = ""
    for (let i = 2; i < Object.keys(e.detail.value).length;i++){
      let name = 'touser'+(i-2)
      if (e.detail.value[name]){
        // console.log(this.data.userList[i-2])
        touser += this.data.userList[i-2].Id+'|'
      }
    }
    if (touser == "") {
      touser = "|"
    }
    this.setData({
      touser: touser
    })
    let totalObj = this.data.userState
    let levelobj = {}
    levelobj.Id = this.data.userState.Id
    levelobj.Level = Number(e.detail.value.level)
    totalObj.Level = levelobj.Level

    http.putReq('level', levelobj,res=>{
      let relationobj = {}
      relationobj.Id = this.data.userState.Id
      relationobj.State = Number(e.detail.value.partner)
      totalObj.State = relationobj.State
      http.putReq('relation',relationobj,res=>{
        let obj = {}
        obj.CompanyId = this.data.userState.CompanyId
        obj.action = 'open'
        obj.touser = touser
        http.putReq('config',obj,res=>{
          wx.showToast({
            title: '修改成功',
          })
          this.setData({
            userState: totalObj
          })
          this.backToPrev()
        })
      })
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