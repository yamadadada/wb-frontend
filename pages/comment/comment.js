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
    avatarWidth: app.globalData.avatarWidth,
    uid: null,
    name: '',
    image: '',
    content: '',
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
    selectName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uid: app.globalData.uid,
      name: options.name,
      image: options.image,
      content: options.content
    })
    this.calWidth();
    const cid = options.cid;
    const that = this;
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
            placeholder: '回复 @' + res.data.data.commentVO.name
          })
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
    if (e.currentTarget.dataset.comment_name == null) {
      description = name + ':' + content;
    } else {
      description = name + ':' + '回复 @' + e.currentTarget.dataset.comment_name + ':' + content;
    }
    this.setData({
      selectCid: cid,
      sheetShow: true,
      description: description,
      selectName: name
    })
  },

  popupOpen: function (e) {
    this.setData({
      popupShow: true,
      commentValue: '',
      placeholder: '回复 @' + this.data.commentVO.name,
      selectName: ''
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
    const that = this;
    wx.request({
      url: app.globalData.host + '/comment/' + this.data.commentVO.cid + "/comment?sort=" + this.data.sort,
      header: {
        'token': app.globalData.token
      },
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          that.setData({
            commentVOList: that.data.commentVOList.concat(res.data.data.commentVOList),
            count: res.data.data.count
          })
        }
      }
    })
  },

  changeSort: function () {
    if (this.data.sort == 'like_count') {
      this.setData({
        sort: 'create_time',
        sortName: '按时间',
        commentVOList: []
      })
    } else {
      this.setData({
        sort: 'like_count',
        sortName: '按热度',
        commentVOList: []
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
                commentVOList: []
              })
              that.getCommentVOList();
            } else {
              Toast.fail(res.data.msg);
            }
          }
        })
      })
    } else if (event.detail.name === '转发') {
      var forwardContent = '';
      if (this.data.selectCid === this.data.commentVO.cid) {
        forwardContent = '//@' + this.data.description
      } else {
        forwardContent = '//@' + this.data.description + '//@' + this.data.name + ':' + this.data.content
      }
      wx.navigateTo({
        url: '/pages/forward/forward?wid=' + this.data.commentVO.wid + "&name=" + this.data.name + "&image=" + this.data.image + "&content=" + this.data.content + "&forward_content=" + forwardContent
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
    if (commentName === this.data.commentVO.name) {
      commentName = '';
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
        commentName: commentName
      },
      method: 'POST',
      success(res) {
        verifyToken(res);
        if (res.statusCode == 200) {
          Toast.success('发送成功');
          that.setData({
            sort: 'create_time',
            sortName: '按时间',
            commentVOList: []
          })
          that.getCommentVOList();
        } else {
          Toast.fail(res.data.msg);
        }
      }
    })
    if (this.data.checked) {
      // 转发
      if (comment === '') {
        comment = '转发微博'
      }
      wx.request({
        url: app.globalData.host + '/forward',
        header: {
          'token': app.globalData.token
        },
        method: 'POST',
        data: {
          content: comment,
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
  }
})