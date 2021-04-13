const app = getApp();
Page({
  data: {
    ColorList: [
      {'pic':"../../images/RecycleableWaste.jpg",'name':"可回收垃圾"},
      {'pic':"../../images/HazardouAwaste.jpg",'name':"有害垃圾"},
      {'pic':"../../images/HouseholdfoodWaste.jpg",'name':"湿垃圾"},
      {'pic':"../../images/ResidualWaste.png",'name':"干垃圾"}
    ]
  },
  onLoad:function(){
      wx.showShareMenu({
          withShareTicket: true //要求小程序返回分享目标信息
      })
  },
  goSearch: function () {
    wx.navigateTo({
      url: '/pages/ai/search',
    })
  },
  onClick:function(e){
   // console.log(JSON.stringify(e))
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
        url: '/pages/sort/detail/index?type=' + (index+1)

    })
  }
})