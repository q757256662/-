//app.js
App({
  // 全局数据
  globalData: {
    // 用户数据
    userInfo: null,
    token: "", 
    msg : "", 
    // 是否绑定手机
    IsBindPhone: false,
    // 服务器地址
    // ServerURL: "http://localhost:63154"
    // ServerURL: "http://192.168.3.222:1111/"
    ServerURL: "https://app.etsystem.cn"
    //ServerURL: "https://api.autopai.cn"
  },
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)


  },

  getUserInfo(cb,fn,userInfoRes,getphone,getpwd) {
    var that = this;
    if (this.globalData.userInfo && this.globalData.token && wx.getStorageSync('sessionId')) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success(res) {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.showLoading({
            title: '加载中',
          })
          wx.request({
            url: that.globalData.ServerURL + '/WeiXinOpen/OnLogin',
            method: 'POST',
            data: {
              code: res.code
            },
            header: {
              'content-type': "application/x-www-form-urlencoded",
            },
            success(json) {
              wx.hideLoading()
              var result = json.data;
              if (result.success) {
                wx.setStorageSync('sessionId', result.sessionId);

                // 输出日志
                // console.log('sessionId:', wx.getStorageSync('sessionId'));

                // console.log('get userinfo', userInfoRes);
                that.globalData.userInfo = userInfoRes.userInfo
                typeof cb == "function" && cb(that.globalData.userInfo)

                //签名校验
                wx.request({
                  url: that.globalData.ServerURL + '/WeiXinOpen/CheckWxOpenSignature',
                  method: 'POST',
                  header: {
                    'content-type': "application/x-www-form-urlencoded", // 默认值
                  },
                  data: {
                    sessionId: wx.getStorageSync('sessionId'),
                    rawData: userInfoRes.rawData,
                    signature: userInfoRes.signature
                  },
                  success: function(json) {
                    var checkSuccess = json.data.success;
                    // console.log(json.data);
                  }
                })

                // 敏感信息解密
                wx.request({
                  url: that.globalData.ServerURL + '/WeiXinOpen/DecodeEncryptedData',
                  method: 'POST',
                  header: {
                    'content-type': "application/x-www-form-urlencoded", // 默认值
                  },
                  data: {
                    'type': "userInfo",
                    sessionId: wx.getStorageSync('sessionId'),
                    encryptedData: userInfoRes.encryptedData,
                    iv: userInfoRes.iv,
                    phone:getphone,
                    pwd:getpwd
                  },
                  success: function(json) {
                    if (json.data.success) {
                      that.globalData.IsBindPhone = true;
                      that.globalData.token = json.data.token;
                      //fn(json.data.token, json.data.msg)
                      that.globalData.msg = "";
                      // console.log(json.data);
                      
                    } else {
                      that.globalData.msg = json.data.msg;
                      //console.log(that.globalData.msg);
                    }
                    fn(that.globalData.token, that.globalData.msg)
                  }
                });
              } else {
                console.log('储存session失败！', json);
              }
            }

          })
        }
      })
    }
  },

  // 登录并获取用户信息
  getUserInfoAuto: function(cb,fn) {

    var that = this;
    if (this.globalData.userInfo && this.globalData.token && wx.getStorageSync('sessionId')) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    }
    else {
      //调用登录接口
      wx.login({
        success: function (res) {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            url: that.globalData.ServerURL + '/WeiXinOpen/OnLogin',
            method: 'POST',
            header: {
              'content-type': "application/x-www-form-urlencoded", // 默认值
            },
            data: {
              code: res.code
            },
            success: function (json) {
              var result = json.data;
              if (result.success) {
                wx.setStorageSync('sessionId', result.sessionId);

                // 输出日志
                console.log('sessionId:', wx.getStorageSync('sessionId'));

                wx.getUserInfo({
                  success: function (userInfoRes) {
                    console.log('get userinfo', userInfoRes);
                    that.globalData.userInfo = userInfoRes.userInfo
                    typeof cb == "function" && cb(that.globalData.userInfo)

                    //签名校验
                    wx.request({
                      url: that.globalData.ServerURL + '/WeiXinOpen/CheckWxOpenSignature',
                      method: 'POST',
                      header: {
                        'content-type': "application/x-www-form-urlencoded", // 默认值
                      },
                      data: {
                        sessionId: wx.getStorageSync('sessionId'),
                        rawData: userInfoRes.rawData,
                        signature: userInfoRes.signature
                      },
                      success: function (json) {
                        var checkSuccess = json.data.success;
                        console.log(json.data);
                      }
                    })

                    // 敏感信息解密
                    wx.request({
                      url: that.globalData.ServerURL + '/WeiXinOpen/DecodeEncryptedData',
                      method: 'POST',
                      header: {
                        'content-type': "application/x-www-form-urlencoded", // 默认值
                      },
                      data: {
                        'type': "userInfo",
                        sessionId: wx.getStorageSync('sessionId'),
                        encryptedData: userInfoRes.encryptedData,
                        iv: userInfoRes.iv
                      },
                      success: function (json) {
                        if (json.data.success){
                          that.globalData.IsBindPhone = true;
                          that.globalData.token = json.data.token;

                          // /fn(json.data.token, json.data.msg)

                          that.globalData.msg = "";

                          console.log(json.data);
                        }else{
                          that.globalData.msg = json.data.msg;
                          //console.log(that.globalData.msg);
                        }
                        fn(that.globalData.token, that.globalData.msg)
                      }
                    });
                  }
                })
              } else {
                console.log('储存session失败！', json);
              }
            }
          })

        }
      });
    }
  },

  // 登出
  signout: function() {
    wx.removeStorageSync("sessionId");
  },

})