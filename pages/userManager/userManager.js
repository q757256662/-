// pages/userManager/userManager.js

var app = getApp();
var http = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listQuery:{
      page: 1,
      limit: 10
    },
    userList:[],
    hasMore:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    let pages = getCurrentPages()
    let currpage = pages[pages.length-1]
    if(this.data.SeletuserList){
      let obj = this.data.SeletuserList
      this.setData({
        userList: obj,
        SeletuserList:null
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let obj = {
      page: 1,
      limit: 10
    }
    this.setData({
      listQuery:obj,
      hasMore:true
    })

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
    let obj = {
      page: 1,
      limit: 10
    }
    this.setData({
      listQuery: obj,
      hasMore: true
    })
    this.page()
    wx.stopPullDownRefresh()    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let obj = this.data.listQuery
    obj.page+=1
    this.setData({
      listQuery: obj
    })
    if (this.data.hasMore){
      this.handleNextPage(obj.page)
    }else{
      wx.showToast({
        title: '已加载完成',
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  page(){
    wx.showLoading({
      title: '加载中',
    })
    http.header.Authorization = 'Bearer ' + app.globalData.token
    http.getReq('staffmanager?page=' + this.data.listQuery.page + '&limit=' + this.data.listQuery.limit + '&ordertype=0&isasc=false', res => {
      wx.hideLoading()
      if (res.status == 200) {
        this.setData({
          userList:res.data.rows
        })
        if(res.data.total<=10){
          this.setData({
            hasMore: false
          })
        }
      } else {
        wx.showToast({
          title: res.tip,
          icon:'error'
        })
      }
    })
  },
  handleEdit(e){
    let query = JSON.stringify(e.target.dataset.item)
    let index = JSON.stringify(e.target.dataset.index)
    wx.navigateTo({
      url: '../putUserMsg/putUserMsg?query=' + query + "&index=" + index,
    })
  },
  handleNextPage(count){
    // wx.showLoading({
    //   title: '加载中',
    // })
    // var that = this
    http.getReq('staffmanager?page=' + count + '&limit=' + this.data.listQuery.limit + '&name=' + this.data.listQuery.name, res => {
      // console.log(res.data.rows)
      let arr = this.data.userList
      res.data.rows.map(el=>{
        arr.push(el)
      })
      // console.log(arr)
      this.setData({
        userList:arr
      })
      if (res.data.total <= 10 * this.data.listQuery.page){
        this.setData({
          hasMore:false
        })
      }
    })
  },
  handleSearch(e){
    let obj = {}
    obj.User = e.detail.value;
    http.getReq('staffmanager/SearchUser?User=' + obj.User,res=>{
      console.log(res)
      let userList = res.data.rows
      let total = res.data.total
      this.setData({
        userList,
        total
      })
      if (res.data.total <= 10) {
        this.setData({
          hasMore: false
        })
      }
      if (res.data.total <= 10 * this.data.listQuery.page) {
        this.setData({
          hasMore: false
        })
      }
    })
  }
})