import { verifyToken } from '../../utils/util'
import Toast from '../../vant/toast/toast';
import Dialog from '../../vant/dialog/dialog';

const app = getApp()

Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    color: '#000',
    background: '#ffffff',
    loading: false,
    avatarWidth: app.globalData.avatarWidth,
    cid: null,
    uid: null,
    sheetShow: false,
    sheetActions: [],
    description: '',
    commentVO: null,
    commentVOList: [],
    sort: 'like_count',
    sortName: '按热度',
    count: 0,
    popupShow: false,
    commentValue: '',
    placeholder: '写评论',
    checked: false,
    selectCid: null,
    selectName: '',
    selectUid: null,
    page: 1,
    size: 10,
    isAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.calWidth();
    this.setData({
      cid: options.cid,
      uid: app.globalData.uid,
      attach: options.attach
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
    const that = this;
    const cid = this.data.cid;
    this.setData({
      loading: true
    })
    wx.request({
      url: app.globalData.host + '/comment/' + cid,
      header: {
        'token': app.globalData.token
      },
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          that.setData({
            commentVO: res.data.data.commentVO,
            commentVOList: res.data.data.commentVO.commentVOList,
            count: res.data.data.count,
            placeholder: '回复 @' + res.data.data.commentVO.name,
            page: 1,
            isAll: false
          })
        }
      },
      complete() {
        that.setData({
          loading: false
        })
      }
    })
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
    if (this.data.page != 0) {
      this.getCommentVOList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  calWidth: function () {
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    const avatarWidth = windowWidth * 0.3 * 0.33;
    this.setData({
      avatarWidth: avatarWidth,
    })
  },

  sheetClose: function () {
    this.setData({
      sheetShow: false
    })
  },

  sheetOpen: function (e) {
    const cid = e.currentTarget.dataset.cid;
    const haveDelete = e.currentTarget.dataset.have_delete;
    const name = e.currentTarget.dataset.name;
    const content = e.currentTarget.dataset.content;
    const uid = e.currentTarget.dataset.uid;
    const commentName = e.currentTarget.dataset.comment_name;
    if (haveDelete) {
      this.setData({
        sheetActions: [
          { name: '回复' },
          { name: '转发' },
          { name: '投诉' },
          { name: '删除' }
        ]
      })
    } else {
      this.setData({
        sheetActions: [
          { name: '回复' },
          { name: '转发' },
          { name: '投诉' }
        ]
      })
    }
    var description = '';
    if (commentName == null) {
      description = name + ':' + content;
    } else {
      description = name + ':' + '回复 @' + commentName + ':' + content;
    }
    this.setData({
      selectCid: cid,
      sheetShow: true,
      description: description,
      selectName: name,
      selectUid: uid
    })
  },

  popupOpen: function (e) {
    this.setData({
      popupShow: true,
      commentValue: '',
      placeholder: '回复 @' + this.data.commentVO.name,
      selectName: '',
      selectUid: null
    })
  },

  popupClose: function () {
    this.setData({
      popupShow: false
    })
  },

  checkedChange: function () {
    this.setData({
      checked: !this.data.checked
    })
  },

  getCommentVOList: function () {
    if (this.data.isAll) {
      return;
    }
    const that = this;
    wx.request({
      url: app.globalData.host + '/comment/' + this.data.commentVO.cid + "/comment?sort=" + this.data.sort,
      header: {
        'token': app.globalData.token
      },
      data: {
        page: this.data.page + 1,
        size: this.data.size
      },
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          const list = res.data.data.commentVOList;
          if (list == null || list.length == 0) {
            that.setData({
              isAll: true
            })
          } else {
            that.setData({
              commentVOList: that.data.commentVOList.concat(list),
              count: res.data.data.count,
              page: that.data.page + 1,
            })
            if (list.length < that.data.size) {
              that.setData({
                isAll: true
              })
            }
          }
        } else {
          Toast.fail('加载失败，请稍后再试')
        }
      }
    })
  },

  changeSort: function () {
    if (this.data.sort == 'like_count') {
      this.setData({
        sort: 'create_time',
        sortName: '按时间',
        commentVOList: [],
        page: 0,
        isAll: false
      })
    } else {
      this.setData({
        sort: 'like_count',
        sortName: '按热度',
        commentVOList: [],
        page: 0,
        isAll: false
      })
    }
    this.getCommentVOList();
  },

  likeChange1: function (e) {
    const cid = e.currentTarget.dataset.cid;
    const islike = e.currentTarget.dataset.is_like;
    const islikeIndex = "commentVO.isLike";
    const likeCountIndex = "commentVO.likeCount";
    if (islike) {
      this.setData({
        [islikeIndex]: false,
        [likeCountIndex]: this.data.commentVO.likeCount - 1
      })
      wx.request({
        url: app.globalData.host + '/commentLike/' + cid,
        header: {
          'token': app.globalData.token
        },
        method: 'delete',
        success(res) {
          verifyToken(res);
        }
      })
    } else {
      this.setData({
        [islikeIndex]: true,
        [likeCountIndex]: this.data.commentVO.likeCount + 1
      })
      wx.request({
        url: app.globalData.host + '/commentLike/' + cid,
        header: {
          'token': app.globalData.token
        },
        method: 'put',
        success(res) {
          verifyToken(res);
        }
      })
    }
  },

  likeChange2: function (e) {
    const cid = e.currentTarget.dataset.cid;
    const islike = e.currentTarget.dataset.is_like;
    const index = e.currentTarget.dataset.index;
    const islikeIndex = "commentVOList[" + index + "].isLike";
    const likeCountIndex = "commentVOList[" + index + "].likeCount";
    if (islike) {
      this.setData({
        [islikeIndex]: false,
        [likeCountIndex]: this.data.commentVOList[index].likeCount - 1
      })
      wx.request({
        url: app.globalData.host + '/commentLike/' + cid,
        header: {
          'token': app.globalData.token
        },
        method: 'delete',
        success(res) {
          verifyToken(res);
        }
      })
    } else {
      this.setData({
        [islikeIndex]: true,
        [likeCountIndex]: this.data.commentVOList[index].likeCount + 1
      })
      wx.request({
        url: app.globalData.host + '/commentLike/' + cid,
        header: {
          'token': app.globalData.token
        },
        method: 'put',
        success(res) {
          verifyToken(res);
        }
      })
    }
  },

  sheetSelect: function (event) {
    if (event.detail.name === '回复') {
      this.setData({
        popupShow: true,
        commentValue: '',
        placeholder: '回复 @' + this.data.selectName
      })
    } else if (event.detail.name === '删除') {
      const cid = this.data.selectCid;
      const that = this;
      Dialog.confirm({
        title: '提示',
        message: '确认删除该条评论?'
      }).then(() => {
        wx.request({
          url: app.globalData.host + '/comment/' + cid,
          header: {
            'token': app.globalData.token
          },
          method: 'DELETE',
          success(res) {
            verifyToken(res);
            if (res.statusCode == 200) {
              Toast.success('删除成功');
              that.setData({
                commentVOList: [],
                page: 0,
                isAll: false
              })
              that.getCommentVOList();
            } else {
              Toast.fail(res.data.msg);
            }
          }
        })
      }).catch(() => {
        // on cancel
      });
    } else if (event.detail.name === '转发') {
      var attach = this.data.attach;
      if (this.data.selectCid === this.data.commentVO.cid) {
        attach = '//@' + this.data.description + attach;
      } else {
        attach = '//@' + this.data.description + '//@' + this.data.commentVO.name + ':' + this.data.commentVO.content + attach;
      }
      wx.navigateTo({
        url: '/pages/forward/forward?wid=' + this.data.commentVO.wid + '&attach=' + attach
      })
    } else if (event.detail.name === '投诉') {
      var selectCid = this.data.selectCid;
      if (selectCid == null) {
        selectCid = this.data.cid;
      }
      wx.navigateTo({
        url: '/pages/appeal/appeal?id=' + selectCid + '&type=1'
      })
    }
  },

  addComment: function () {
    var comment = this.data.commentValue;
    if (comment.length == 0) {
      Toast.fail('评论内容不能为空');
      return;
    }
    this.popupClose();
    Toast.loading({
      mask: true,
      message: '提交中...'
    });
    var commentName = this.data.selectName;
    var commentUid = this.data.selectUid;
    if (this.data.selectUid === this.data.commentVO.uid) {
      commentName = '';
      commentUid = null;
    }
    const that = this;
    wx.request({
      url: app.globalData.host + '/comment',
      header: {
        'token': app.globalData.token
      },
      data: {
        wid: this.data.commentVO.wid,
        content: comment,
        commentCid: this.data.commentVO.cid,
        commentName: commentName,
        commentUid: commentUid
      },
      method: 'POST',
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          Toast.success('发送成功');
          that.setData({
            sort: 'create_time',
            sortName: '按时间',
            commentVOList: [],
            page: 0,
            isAll: false
          })
          that.getCommentVOList();
        } else {
          Toast.fail(res.data.msg);
        }
      }
    })
    if (this.data.checked) {
      // 转发
      var content = '//@' + this.data.commentVO.name + ':' + this.data.commentVO.content + this.data.attach;
      if (commentName.length > 0) {
        content = '回复@' + commentName + ':' + comment + content;
      } else {
        content = comment + content;
      }
      wx.request({
        url: app.globalData.host + '/forward',
        header: {
          'token': app.globalData.token
        },
        method: 'POST',
        data: {
          content: content,
          wid: this.data.commentVO.wid
        },
        success(res) {
          verifyToken(res);
        }
      })
    }
  },

  fieldChange: function (e) {
    this.setData({
      commentValue: e.detail
    })
  },

  toUser: function (e) {
    const uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '/pages/user/user?uid=' + uid
    })
  },

  toTop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  }
})