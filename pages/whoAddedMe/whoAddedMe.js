// pages/whoAddedMe/whoAddedMe.js
var app = getApp();
var http = require('../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList:[],
    listQuery: {
      page: 1,
      limit: 10,
      action: "addme",
      Stime: "",
      Etime: "",
    },
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
    let currpage = pages[pages.length - 1]
    if (this.data.SeletuserList) {
      let obj = this.data.SeletuserList
      this.setData({
        userList: obj,
        SeletuserList: null
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
      listQuery: obj,
      hasMore: true
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
    obj.page += 1
    this.setData({
      listQuery: obj
    })
    if (this.data.hasMore) {
      this.handleNextPage(obj.page)
    } else {
      wx.showToast({
        title: '加载完成',
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
    http.getReq('partner?page=' + this.data.listQuery.page + "&limit=" + this.data.listQuery.limit + "&action=addme", res => {
      wx.hideLoading()
      if (res.status == 200) {
        let obj = res.data.rows
        // obj.Receiver.substring(obj.Receiver.length - 2, obj.Receiver.length-1)
        obj.map(el=>{
          el.Receiver = el.Receiver.slice(0, el.Receiver.length-1)
        })

        this.setData({
          userList: obj,
          total: res.data.total
        })
        if (res.data.total <= 10) {
          this.setData({
            hasMore: false
          })
        }
      } else {
        wx.showToast({
          title: res.tip,
          image: '../../images/error.png',
        })
      }
    })
  },
  handleTo(e){
    let query = JSON.stringify(e.currentTarget.dataset.item)
    let index = JSON.stringify(e.currentTarget.dataset.index)
    wx.navigateTo({
      url: '../acceptUploadState/acceptUploadState?query=' + query + "&index=" + index,
    })
  },
  handleNextPage(count) {
    // wx.showLoading({
    //   title: '加载中',
    // })
    // var that = this
    http.getReq('partner?page=' +count + "&limit=" + this.data.listQuery.limit + "&action=addme", res => {
      // console.log(res.data.rows)
      let arr = this.data.userList
      res.data.rows.map(el => {
        arr.push(el)
      })
      // console.log(arr)
      this.setData({
        userList: arr
      })
      if (res.data.total <= 10 * this.data.listQuery.page) {
        this.setData({
          hasMore: false
        })
      }
    })
  },
})