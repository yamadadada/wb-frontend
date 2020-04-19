import { verifyToken } from '../../utils/util'
import Toast from '../../vant/toast/toast';

const areaList = require("../../utils/area.js");

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: '#3A3A3A',
    background: '#FDFDFD',
    user: null,
    avatarWidth: 0,
    showPop1: false,
    showPop2: false,
    showPop3: false,
    pickGender: 0,
    maxDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
    error1: false,
    errorMessage1: '',
    error2: false,
    avatar: '',
    areaList: areaList.default,
    nameReadOnly: false,
    nameLabel: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.calWidth();
    const that = this;
    wx.request({
      url: app.globalData.host + '/user',
      header: {
        'token': app.globalData.token
      },
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          var birth = new Date().getTime();
          if (res.data.data.birth != null) {
            birth = new Date(res.data.data.birth).getTime();
          }
          that.setData({
            user: res.data.data,
            currentDate: birth,
            pickGender: res.data.data.gender,
            avatar: res.data.data.avatar
          })
        }
      }
    })
    // 检测昵称修改是否在间隔期
    wx.request({
      url: app.globalData.host + '/user/isNameInterval',
      header: {
        'token': app.globalData.token
      },
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          if (res.data.data == true) {
            that.setData({
              nameReadOnly: true,
              nameLabel: '修改昵称30天内无法再次修改'
            })
          }
        }
      }
    })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  calWidth: function () {
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    const avatarWidth = windowWidth * 0.2;
    this.setData({
      avatarWidth: avatarWidth
    })
  },

  changeName: function (e) {
    var patt1 = /^[\w\u4e00-\u9fa5]{1,16}$/
    if (patt1.test(e.detail)) {
      this.setData({
        error1: false,
        errorMessage1: ''
      })
    } else {
      this.setData({
        error1: true,
        errorMessage1: '昵称只能由汉字字母数字下划线组成'
      })
      return;
    }
    const nameIndex = "user.name";
    this.setData({
      [nameIndex]: e.detail
    })
  },

  changeIntro: function (e) {
    const introIndex = "user.introduction";
    this.setData({
      [introIndex]: e.detail
    })
  },

  openPop1: function () {
    this.setData({
      showPop1: true
    })
  },

  closePop1: function () {
    this.setData({
      showPop1: false
    })
  },

  genderChange: function (event) {
    this.setData({
      pickGender: event.detail.index
    })
  },

  confirmGender: function () {
    const pickGender = this.data.pickGender;
    const genderIndex = "user.gender"
    this.setData({
      [genderIndex]: pickGender,
      showPop1: false
    })
  },

  openPop2: function () {
    this.setData({
      showPop2: true
    })
  },

  closePop2: function () {
    this.setData({
      showPop2: false
    })
  },

  onInput: function (event) {
    this.setData({
      currentDate: event.detail
    });
  },

  confirmBirth: function () {
    const birthIndex = "user.birth"
    const date = new Date(this.data.currentDate);
    const birth = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    this.setData({
      [birthIndex]: birth,
      showPop2: false
    })
  },

  showPop3: function () {
    this.setData({
      showPop3: true
    })
  },

  closePop3: function () {
    this.setData({
      showPop3: false
    })
  },

  locationConfirm: function (e) {
    const locationIndex = "user.location";
    const province = e.detail.values[0].name.replace('省', '').replace('市', '').replace('自治区', '').replace('壮族', '').replace('回族', '').replace('维吾尔', '').replace('特别行政区', '');
    const city = e.detail.values[1].name.replace('市', '').replace('盟', '').replace('地区', '');
    this.setData({
      [locationIndex]: province + ' ' + city,
      showPop3: false
    })
  },

  chooseImage: function () {
    const that = this;
    wx.chooseImage({
      count: 1,
      success: function(res) {
        that.setData({
          avatar: res.tempFilePaths[0]
        })
      },
    })
  },

  changeSchool: function (e) {
    var patt2 = /^[\u4e00-\u9fa5]{0,16}$/
    if (patt2.test(e.detail)) {
      this.setData({
        error2: false
      })
    } else {
      this.setData({
        error2: true
      })
      return;
    }
    const schoolIndex = "user.school";
    this.setData({
      [schoolIndex]: e.detail
    })
  },

  commit: function () {
    if (this.data.error1) {
      Toast.fail('昵称格式不正确');
      return;
    }
    if (this.data.error2) {
      Toast.fail('学校格式不正确');
      return;
    }
    if (this.data.user.avatar != this.data.avatar) {
      wx.uploadFile({
        url: app.globalData.host + '/user/updateAvatar/' + app.globalData.uid,
        header: {
          'token': app.globalData.token
        },
        filePath: this.data.avatar,
        name: 'file'
      });
    }
    wx.request({
      url: app.globalData.host + '/user/' + app.globalData.uid,
      header: {
        'token': app.globalData.token
      },
      method: 'PUT',
      data: {
        name: this.data.user.name,
        introduction: this.data.user.introduction,
        gender: this.data.user.gender,
        birth: this.data.user.birth,
        location: this.data.user.location,
        school: this.data.user.school
      },
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          Toast.success('更新成功')
          setTimeout(function(){
            wx.navigateBack({});
          }, 2000);
        } else {
          Toast.fail(res.data.msg);
        }
      }
    })
  }
})