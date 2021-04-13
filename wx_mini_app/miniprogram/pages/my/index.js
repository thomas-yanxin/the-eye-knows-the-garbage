//list.js
var app = getApp()
Page({
  data: {
      isLogin: '',
      nickName: "",
      avatarUrl: "",
      point:''
  },
  /**
    * 生命周期函数--监听页面加载
    */
  onLoad: function (options) {
    var point = wx.getStorageSync('point');
    this.setData({
      point: point,
    })
    var that = this;
    wx.getSetting({
      success: function(res){
        if (res.authSetting['scope.userInfo']){
          that.setData({
            isLogin: true
          });
          wx.getUserInfo({
            success: function (res) {
              var nickName = res.userInfo.nickName;
              var avatarUrl = res.userInfo.avatarUrl;
              that.setData({
                nickName: nickName,
                avatarUrl: avatarUrl
              });
            }
          });
        }
      }
    })
    var openid = wx.getStorageSync('openid');
    var token = wx.getStorageSync('token');
    if(openid){
      console.log("openidididid"+openid);
      var data = {
        'token': token,
        'openid': openid,
      };
      wx.request({
        url: 'http://127.0.0.1:8000/search_user/',
        method: 'POST',
        data: data,
        header: {
            "content-type": "application/x-www-form-urlencoded",
        },
        success (res) {
          console.log("历史数据");
          console.log(res)
          console.log(res.data)
          var history = res.data;
          console.log(history);
          wx.setStorageSync('history', history);
        },
        fail(error){
            wx.hideLoading();
            console.log(error);
            wx.showToast({
                icon: 'none',
                title: '请求失败了，请确保网络正常，重新试试~',
            });
        }
      });
    }
  },
  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
        //用户按了允许授权按钮
        var that = this;
        // 获取到用户的信息了，打印到控制台上看下
        console.log(e.detail);
        console.log("用户的信息下：");
        console.log(e.detail.userInfo);
        var userInfo = e.detail.userInfo;
        wx.setStorageSync('userInfo', userInfo)
        //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
        that.setData({
            isHide: false
        });
        wx.login({
            success: res => {
                // 获取到用户的 code 之后：res.code
                console.log(res);
                console.log("用户的code:" + res.code);
                var code = res.code;
                wx.setStorageSync('code', res.code)
                wx.request({
                    url: 'http://127.0.0.1:8000/login_in/',
                    method: 'POST',
                    header: {
                      "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: {
                      code: code,
                      userinfo: JSON.stringify(userInfo)
                    },
                    success: res => {
                      console.log(res);
                      const token = res.data.token;
                      wx.setStorageSync("token", token);
                    }
                })
            }
        });
        wx.showModal({
          title: '注意',
          content: '请前往用户中心录入人脸信息进行认证！如已录入，请忽略！',
          showCancel: true,
        })
        this.onLoad();
    } else {
        //用户按了拒绝按钮
        wx.showModal({
            title: '注意',
            content: '拒绝授权，将无法进入获取个人信息，请授权后进入！',
            showCancel: false,
            confirmText: '返回授权',
            success: function(res) {
                // 用户没有授权成功，不需要改变 isHide 的值
                if (res.confirm) {
                    console.log('用户点击了“返回授权”');
                }
            }
        });
    }
  },

  onClick:function(){
    wx.navigateTo({
      url: '/pages/my/mymy/mymy',
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

  }

})

