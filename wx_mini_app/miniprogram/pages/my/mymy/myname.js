// miniprogram/pages/my/mymy/myname.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoMess: '',
    userRealName:'',
  },
  userNameInput:function(e){
    var userRealName = e.detail.detail.value;
    console.log(userRealName);
    wx.setStorageSync('myrealname', userRealName);
    this.setData({
      userRealName: e.detail.value,
    })  
  },
  loginBtnClick:function(){
    var userRealName = wx.getStorageSync('myrealname');
    if(!userRealName){
      this.setData({
        infoMess:'温馨提示：用户名和密码不能为空！',
      })
    }else{
      this.setData({
        infoMess:'',
      })
      var myimage = wx.getStorageSync('myimgdata');
      var myname = wx.getStorageSync('myrealname');
      var token = wx.getStorageSync('token');
      var openid = wx.getStorageSync('openid');
      console.log(myimage);
      console.log(myname);
      console.log(token);
      console.log(openid);
      var data = {
          'token': token,
          'openid': openid,
          'name': myname,
          'img': myimage,
      };
      wx.request({
          url: 'http://127.0.0.1:8000/intput_identify/',
          method: 'POST',
          data: data,
          header: {
              "content-type": "application/x-www-form-urlencoded",
          },
          success (res) {
              console.log(res)
              console.log(res.data)
              var results = res.data.results;
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
      wx.navigateBack({
        delta: 1,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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