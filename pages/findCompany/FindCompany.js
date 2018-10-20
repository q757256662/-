// pages/FindCompany/FindCompany.js

var app = getApp();
var http = require('../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList: [],
    listQuery: '',
    hasCompany:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  handleFilter() {
    let KeyWord = this.data.listQuery
    if (KeyWord.trim().length >= 2) {
      this.page();
    } else {
      wx.showToast({
        title: '有效关键词不足',
        image: '../../images/error.png',
      })
      this.setData({
        userList:[],
        hasCompany:false
      })
    }
    // this.page()
  },
  page() {
    wx.showLoading({
      title: '加载中',
    })
    http.header.Authorization = 'Bearer ' + app.globalData.token
    http.getReq('partner?query='+this.data.listQuery.trim(), res => {
      wx.hideLoading()
      if (res.status == 200) {
        this.setData({
          userList: res.data.rows,
          total: res.data.total
        })
        if(res.data.rows.length==0){
          this.setData({
            hasCompany:false
          })
        }else{
          this.setData({
            hasCompany: true
          })
        }
      } else {
        wx.showToast({
          title: res.tip
        })
      }
    })
  },
  handleInput(e){
    this.setData({
      listQuery:e.detail.value
    })
  },
  handleAdd(e){
    http.postReq('partner', { Id: e.target.dataset.id},res=>{
      if (res.status==200){
        wx.showToast({
          title: '添加成功',
        })
      }
    })
  }

})