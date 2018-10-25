var app = getApp()
var rootDocment = app.globalData.ServerURL
// var rootDocment = 'http://fwq2012:8081/ETWebApi/';
var header = {
  'Accept': 'application/json',
  'content-type': 'application/json',
  'Authorization': 'Bearer '+app.globalData.token,
}
function getReq(url, cb) {
  wx.showLoading({
    title: '加载中',
  })
  // console.log("header=="),
  //   console.log(header)
  wx.request({
    url: rootDocment + url,
    method: 'get',
    header: header,
    success: function (res) {
      wx.hideLoading();
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      wx.hideLoading();
      wx.showModal({
        title: '网络错误',
        content: '网络出错，请刷新重试',
        showCancel: false
      })
      return typeof cb == "function" && cb(false)
    }
  })
}

function postReq(url, data, cb) {
  wx.showLoading({
    title: '加载中',
  })
  // console.log("header=="),
  //   console.log(header),
    wx.request({
      url: rootDocment + url,
      header: header,
      data: data,
      method: 'post',
      success: function (res) {
        wx.hideLoading();
        return typeof cb == "function" && cb(res.data)
      },
      fail: function () {
        wx.hideLoading();
        wx.showModal({
          title: '网络错误',
          content: '网络出错，请刷新重试',
          showCancel: false
        })
        return typeof cb == "function" && cb(false)
      }
    })

}

function putReq(url, data, cb) {
  wx.showLoading({
    title: '加载中',
  })
  // console.log("header=="),
  //   console.log(header),
  wx.request({
    url: rootDocment + url,
    header: header,
    data: data,
    method: 'put',
    success: function (res) {
      wx.hideLoading();
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      wx.hideLoading();
      wx.showModal({
        title: '网络错误',
        content: '网络出错，请刷新重试',
        showCancel: false
      })
      return typeof cb == "function" && cb(false)
    }
  })
}

function delReq(url, data, cb) {
  wx.showLoading({
    title: '加载中',
  })
  // console.log("header=="),
  //   console.log(header),
  wx.request({
    url: rootDocment + url,
    header: header,
    data: data,
    method: 'delete',
    success: function (res) {
      wx.hideLoading();
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      wx.hideLoading();
      wx.showModal({
        title: '网络错误',
        content: '网络出错，请刷新重试',
        showCancel: false
      })
      return typeof cb == "function" && cb(false)
    }
  })
}
module.exports = {
  getReq: getReq,
  postReq: postReq,
  header: header,
  putReq: putReq,
  delReq: delReq
}  
