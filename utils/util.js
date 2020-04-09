import Dialog from '../vant/dialog/dialog';
import Toast from '../vant/toast/toast';

const app = getApp()

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

const login = function login() {
  wx.login({
    success: res => {
      if (res.code) {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: app.globalData.host + '/login',
          data: {
            'code': res.code
          },
          success(res) {
            if (res.statusCode === 200) {
              app.globalData.uid = res.data.data.uid;
              app.globalData.token = res.data.data.token;
              // 刷新页面
              let pages = getCurrentPages();
              let curPage = pages[pages.length - 1];
              curPage.onShow();
              Dialog.close();
            } else {
              Toast.fail('登录失败: ' + res.data.msg);
            }
          },
          fail() {
            Toast.fail('登录失败，请稍后再试！');
          }
        })
      } else {
        Toast.fail('登录失败：' + res.errMsg);
      }
    }
  })
}

const verifyToken = function verifyToken(res) {
  if (res.data.code == -3) {
    app.globalData.token = null;
    Dialog.confirm({
      title: '提示',
      message: '登录已过期，请点击确认重新登录!',
      asyncClose: true
    }).then(() => {
      login();
    }).catch(() => {
      Dialog.close();
    });
  }
}

module.exports = {
  formatTime: formatTime,
  login: login,
  verifyToken: verifyToken
}
