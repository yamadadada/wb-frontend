import { $wuxDialog } from '../lib/index';
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
            app.globalData.uid = res.data.data.uid;
            app.globalData.token = res.data.data.token;
          },
          fail() {
            openDialog('错误', '登录失败，请稍后再试！');
          }
        })
      } else {
        openDialog('错误', '登录失败：' + res.errMsg);
      }
    }
  })
}

const openDialog = function openDialog(title, message) {
  Dialog.alert({
    title: title,
    message: message
  }).then(() => {
    // on close
  });
}

const verifyToken = function verifyToken(res) {
  if (res.data.code == -3) {
    app.globalData.token = null;
    login();
    Toast.fail('登录已过期，请重新操作!');
  }
}

module.exports = {
  formatTime: formatTime,
  login: login,
  verifyToken: verifyToken,
  openDialog: openDialog
}
