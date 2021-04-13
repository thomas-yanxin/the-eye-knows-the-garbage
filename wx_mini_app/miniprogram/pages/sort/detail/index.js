//index.js
//获取应用实例
var app = getApp()
var garbage_sort_letter = require('../../../utils/garbage-sort/garbage-sort.js');
const garbage_categroy = require('../../../utils/garbage-sort/garbage-categroy.js');

Page({
  data: {
  },
  onLoad: function (options) {
      this.data.type = options.type
      var typeInt = parseInt(this.data.type);
      var title = garbage_categroy.getCategoryName(typeInt-1)

      var that = this
      wx.setNavigationBarTitle({
          title: title,
      });
      garbage_sort_letter.init(typeInt, that);
  },

  onShow: function () {
    var that = this
  },

  wxaSortPickerItemTap: function(e){
    console.log(e.target.dataset.text);
  },
})
