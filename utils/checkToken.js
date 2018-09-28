var app = getApp()
if (app.token==''){
  wx.redirectTo({
    url: '../pages/login/login',
  })
  wx.showToast({
    title: '未检查到你的账号,请重新登录',
  })
}
