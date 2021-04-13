
var garbage_data = require('./garbage-sort-data.js');
var sorts = [
    {
        color: "#014782",
        bgcolor: "#e9e8e6",
        logo: "../../../images/RecycleableWaste.jpg",
        name: "可回收物",
        content: "适宜回收利用和资源化利 用的，如：玻、金、塑、 纸、衣",
        desc: "酱油瓶、玻璃杯、平板玻璃、易拉罐、饮料瓶、 洗发水瓶、塑料玩具、书本、报纸、广告单、 纸板箱、衣服、床上用品等",
        action: ["轻投轻放", "清洁干燥，避免污染", "废纸尽量平整", "立体包装物请清空内容物，清洁后压扁投放","有尖锐边角的，应包裹后投放"],
    },
    {
        color: "#e73322",
        bgcolor: "#c8e2f8",
        logo: "../../../images/HazardouAwaste.jpg",
        name: "有害垃圾",
        content: "对人体健康或者自然环境造成直接或潜在危害的废弃物",
        desc: "废电池、油漆桶、荧光灯管、废药品及其包装物等",
        action: ["投放时请注意轻放", "易破损的请连带包装或包裹后轻放","如易挥发，请密封后投放"],
    },
    {
    color:"#664035",
    bgcolor: "#d6d5d4",
    logo:"../../../images/HouseholdfoodWaste.jpg",
    name:"湿垃圾",
    content: "日常生活垃圾产生的容易腐烂的生物质废弃物",
    desc: "剩菜剩饭、瓜皮果核、花卉绿植、过期食品等",
    action: ["纯流质的食物垃圾，如牛奶等，应直接倒进下水口","有包装物的湿垃圾应将包装物去除后分类投放，包装物请投放到对应的可回收物或干垃圾容器"],
},{
    color: "#2c2b27",
    bgcolor: "#e9e8e6",
    logo: "../../../images/ResidualWaste.png",
    name: "干垃圾",
    content: "除有害垃圾、湿垃圾、可回收物以外的其他生活废弃物",
    desc: "餐盒、餐巾纸、湿纸巾、卫生间用纸、塑料袋、 食品包装袋、污染严重的纸、烟蒂、纸尿裤、 一次性杯子、大骨头、贝壳、花盆、陶瓷等",
    action: ["尽量沥干水分", "难以辨识类别的生活垃圾投入干垃圾容器内"],

}];

function init(categroy, that, callback) {
  if (categroy <= 0){
    return false;
  }
  var temData = that.data.wxaSortPickerData;
  if(typeof temData == 'undefined'){
      temData = {};
  }
  that.wxaSortPickerUpper = wxaSortPickerUpper;
  that.wxaSortPickerLower = wxaSortPickerLower;
  that.wxaSortPickerScroll = wxaSortPickerScroll;
  that.wxaSortPickerTemTagTap = wxaSortPickerTemTagTap;
  setViewWH(that);

  buildTextData(that,categroy);
}

function buildTextData(that,categroy){

  //读取某类垃圾数据
var textData = {};
    var  garbage_sort_data = garbage_data.garbage_sort_data;
    garbage_sort_data.forEach(function (item){
        if(item.categroy ===categroy){
            textData = item.data ;
        }
    })

   // console.log("textData:"+JSON.stringify(textData)) ;
    var temData = that.data.wxaSortPickerData;
    if(typeof temData == 'undefined'){
            temData = {};
    }
    temData.textData = textData;
    that.setData({
        wxaSortPickerData: temData
    });

    that.setData({
        sort: sorts[categroy-1]
    });

   // console.log(that.data.wxaSortPickerData);
    //console.log('sort:'+JSON.stringify(that.data.sort));

}

function wxaSortPickerUpper(e) {
    //console.dir(e);
}

function wxaSortPickerLower(e) {
    //console.dir(e);
}

function wxaSortPickerScroll(e) {
    //console.log(e.detail.scrollTop);
}

function setViewWH(that) {
    wx.getSystemInfo({
        success: function (res) {
            // console.dir(res);
            var windowWidth = res.windowWidth;
            var windowHeight = res.windowHeight;
            var temData = that.data.wxaSortPickerData;
            if(typeof temData == 'undefined'){
                temData = {};
            }
            var view = {};
            view.scrollHeight = windowHeight;
            temData.view = view;
            that.setData({
                wxaSortPickerData: temData
            })
        }
    })
}

function wxaSortPickerTemTagTap(e) {
    var that = this;
    var temData = that.data.wxaSortPickerData;
    temData.wxaSortPickertoView = e.target.dataset.tag;
    //console.log(temData)
    that.setData({
        wxaSortPickerData: temData
    });
}

module.exports = {
    init: init
}