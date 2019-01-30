// pages/acceptMessage/acceptMessage.js
var app = getApp()
var http = require('../../utils/request.js')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    total:0,
    hasMore:true,
    hasUser:true,
    pageCount:{
      limit:10,
      page:1
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.page(this.data.pageCount)
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
    this.setData({
      pageCount: {
        limit: 10,
        page: 1
      }
    })
    this.page(this.data.pageCount)
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMore) {
      let pageCount = this.data.pageCount
      pageCount.page++
      // console.log(pageCount)
      this.setData({
        pageCount
      })
      this.handleNextPage(this.data.pageCount)
    } else {
      wx.showToast({
        title: '加载完毕',
        icon: "none"
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  page(e){
    http.header.Authorization = 'Bearer ' + app.globalData.token
    http.getReq('Messages?page='+e.page+'&limit='+e.limit, res => {
      res.MessagesList.map(el=>{
        // el.CreateTime = el.CreateTime.util("T"," ")
        el.CreateTime = util.formatTimeS(new Date(el.CreateTime))
        // el.CreateTime = el.CreateTime.substring(0,19)
      })
      this.setData({
        list: res.MessagesList,
        total: res.Count
      })
      if (this.data.total < e.limit){
        this.setData({
          hasMore:false
        })
      }else{
        this.setData({
          hasMore: true
        })
      }
      if (res.Count==0){
        this.setData({
          hasUser:false
        })
      }
      // console.log(util.formatTime(new Date(this.data.list.CreateTime)))
    })
  },
  handleClick(e){
    // console.log(e)
    let item = e.currentTarget.dataset.item
    // item.Contents = this.dotran(item.Contents)
    // console.log(item)
    // item.Contents = item.Contents.replace(/"/g,"\\\"")
    let query = JSON.stringify(item)
    // console.log(query)
    let index = JSON.stringify(e.currentTarget.dataset.index)
      // = e.currentTarget.dataset.item.Contents.query.replace(/"/g, "\\\"")
    // console.log(query)
    console.log(item)
    wx.navigateTo({
      url: '../openMessage/openMessage?id=' + item.IMCID + '&IMID='+item.IMID,
    })
    let list = [...this.data.list]
    list.splice(e.currentTarget.dataset, 1)
    this.setData({
      list
    })
  },
  
  handleNextPage(e){
    http.header.Authorization = 'Bearer ' + app.globalData.token
    http.getReq('Messages?page=' + e.page + '&limit=' + e.limit, res => {
      res.MessagesList.map(el => {
        el.CreateTime = el.CreateTime.replace("T", " ")
        el.CreateTime = el.CreateTime.substring(0, 19)
      })
      let list = [...this.data.list]
      list.push(...res.MessagesList)
      console.log(list)
      this.setData({
        list
      })
      if (this.data.total < e.limit*e.page) {
        this.setData({
          hasMore: false
        })
      } else {
        this.setData({
          hasMore: true
        })
      }
    })
  }
    
   
})