// pages/iSendWho/iSendWho.js
var app = getApp();
var http = require('../../utils/request.js')
var getCurrentTime1 = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listQuery: {
      page: 1,
      limit: 10,
      action: "add",
      sTime: '',
      eTime: '',
    },
    userList:[],
    total:0,
    hasMore:true,
    hasUser:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.page()
    // this.setTime()
    // this.getCurrentTime('2018-8-30')
    // console.log(getCurrentTime1.formatTime(new Date()))
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
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },
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
        title: '已加载完成',
      })
    }
  },
  page(){
    this.setTime()
    wx.showLoading({
      title: '加载中',
    })
    http.header.Authorization = 'Bearer ' + app.globalData.token
    http.getReq('partner?page=' + this.data.listQuery.page + "&limit=" + this.data.listQuery.limit + "&action=add&sTime=" + this.data.listQuery.sTime + "+00:00&eTime=" + this.data.listQuery.eTime + "+23:59", res => {
      wx.hideLoading()
      if(res.status==200){
        this.setData({
          userList: res.data.rows,
          total: res.data.total
        })
        if (res.data.total <= 10) {
          this.setData({
            hasMore: false
          })
        }
        if (res.data.total==0){
          this.setData({
            hasUser:false
          })
        }else{
          this.setData({
            hasUser: true
          })
        }
      }else{
        wx.showToast({
          title: res.tip
        })
      }
    })
  },
  handleToSet(e){
    let query = JSON.stringify(e.currentTarget.dataset.item)
    let index = JSON.stringify(e.currentTarget.dataset.index)
    wx.navigateTo({
      url: '../setUploadState/setUploadState?query=' + query+"&index="+index
    })
  },
  bindDateChange(e) {
    // console.log(e.detail.value)
    let obj = this.data.listQuery
    obj.page = 1
    obj.sTime = e.detail.value.replace(/\-/g, '-')
    this.setData({
      listQuery: obj,
      hasMore:true
    })
    this.handleSearch(this.data.listQuery)
  },
  bindDateChange2(e) {
    let obj = this.data.listQuery
    obj.page = 1
    obj.eTime = e.detail.value.replace(/\-/g, '-')
    this.setData({
      listQuery: obj,
      hasMore: true
    })
    this.handleSearch(this.data.listQuery)
  },
  handleSearch(obj){
    http.getReq('partner?page=' + obj.page + "&limit=" + obj.limit + "&action=add&sTime=" + obj.sTime+"+00:00&eTime="+obj.eTime+"+23:59", res => {
      if(res.status==200){
        this.setData({
          userList:res.data.rows
        })
        if (res.data.total <= 10) {
          this.setData({
            hasMore: false
          })
        }
        if (res.data.total==0){
          this.setData({
            hasUser:false
          })
        }else{
          this.setData({
            hasUser: true
          })
        }
      }
    })
  },
  setTime(){
    // =================================================================================
    // var date = new Date().toLocaleDateString().replace(/\//g, '-')
    // var arr = date.split('-');
    // var year = arr[0]; //获取当前日期的年份
    // var month = arr[1]; //获取当前日期的月份
    // var day = arr[2]; //获取当前日期的日
    // if (day < 10) {
    //   day = "0"+day; //月份填补成2位。
    // }
    // var t1 = getCurrentTime1.formatTime(new Date())
    // // console.log(t1)
    // var days = new Date(year, month, 0);
    // days = days.getDate(); //获取当前日期中月的天数
    // var year2 = year;
    // var month2 = parseInt(month) - 3;
    // if (month2 == 0) { //如果是1月份，则取上一年的12月份
    //   year2 = parseInt(year2) - 3;
    //   month2 = 12;
    // }
    // var day2 = day;
    // var days2 = new Date(year2, month2, 0);
    // days2 = days2.getDate();
    // if (day2 > days2) { //如果原来日期大于上一月的日期，则取当月的最大日期。比如3月的30日，在2月中没有30
    //   day2 = days2;
    // }
    // if (month2 < 10) {
    //   month2 = '0' + month2; //月份填补成2位。
    // }
    // if (day2 < 10) {
    //   day2 = day2; //月份填补成2位。
    // }
    // var t2 = year2 + '-' + month2 + '-' + day2;
    // // t1 = this.getCurrentTime(t1)
    // t2 = this.getCurrentTime(t2)
    // let obj = this.data.listQuery
    // console.log("q:"+t1)
    // console.log(t2)
    // obj.eTime = getCurrentTime1.formatTime(new Date(t1))
    // obj.sTime = getCurrentTime1.formatTime(new Date(t2))
    // this.setData({
    //   listQuery: obj
    // })
    // =================================================================================

    let t1 = new Date()
    let t2 = new Date(new Date().getTime() - 1000*60*60*24*90)
    t1 = getCurrentTime1.formatTime(t1)
    t2 = getCurrentTime1.formatTime(t2)
    // console.log(t1)
    // console.log(t2)
    let obj = this.data.listQuery
    obj.eTime = t1
    obj.sTime = t2
    this.setData({
      listQuery: obj
    })
  },
  handleNextPage(){
    http.getReq('partner?page=' + this.data.listQuery.page + "&limit=" + this.data.listQuery.limit + "&action=add&sTime=" + this.data.listQuery.sTime + "+00:00&eTime=" + this.data.listQuery.eTime + "+23:59", res => {
      wx.hideLoading()
      if (res.status == 200) {
        let obj = this.data.userList
        res.data.rows.map(el=>{
          obj.push(el)
        })
        this.setData({
          userList: obj,
          total: res.data.total
        })
        if (res.data.total <= 10 * this.data.listQuery.page) {
          this.setData({
            hasMore: false
          })
        }
      } else {
        wx.showToast({
          title: res.tip
        })
      }
    })
  },
  getCurrentTime(WashTime){
    var date = new Date(WashTime);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + " ";
    // var hour = date.getHours() + ":00-" + (date.getHours() + 1) + ":00"
    // console.log(Y + M + D)
    return Y+ M + D
  }
})