var app = getApp()
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

var checkToken = ()=>{
  if (app.token == '') {
    wx.redirectTo({
      url: '../pages/login/login',
    })
    wx.showToast({
      title: '未检查到你的账号,请重新登录',
      image: '../../images/error.png',
    })
  }
}

module.exports = {
  formatTime: formatTime,
  checkToken: checkToken
}
