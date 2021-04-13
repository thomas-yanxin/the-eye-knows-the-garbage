var http = require('../../../utils/http.js')
var baiduTokenUtil = require('../../../utils/baidu-token-util.js');
//调用插件
const plugin = requirePlugin('WechatSI');
//获取全局唯一的语音识别管理器recordRecoManager
const manager = plugin.getRecordRecognitionManager();
var innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.onError((res) => {
  // 播放音频失败的回调
})


Page({
    data: {
        isShow: false,
        results: [],
        src: "",
        isCamera: true,
        btnTxt: "拍照",
        visible3: false,
        actions3: [
            {
                name: '返回主页',
                color: '#2d8cf0',
            },
            {
                name: '更多相关垃圾',
                color: '#19be6b'
            }
        ],
    },
    handleClick3 ({ detail }) {
        const index = detail.index;
        if (index === 0) {
            wx.navigateBack({
              delta: 1,
            })
        } else if (index === 1) {
            var results = wx.getStorageSync('photo_results');
            var garbage_name = results[0].garbage_name;
            console.log(garbage_name);
            wx.navigateTo({
                url: '/pages/ai/search?searchText=' + garbage_name,
            })
        }
        this.setData({
            visible3: false
        });
    },
    accessToken: "",

    onLoad() {
        this.ctx = wx.createCameraContext();
        var that=this
        wx.showShareMenu({
            withShareTicket: true //要求小程序返回分享目标信息
        });
        try {
            baiduTokenUtil.getBdAiAccessToken().then(
                function (res) {
                    console.log('获取百度ai token:' + JSON.stringify(res));
                    that.accessToken = res.access_token;
                }, function (error) {
                    console.error('获取百度ai token:' + error);
                }
            );
        } catch (error) {
            console.error(error);
        }

    },
    takePhoto() {
        var that = this
        if (this.data.isCamera == false) {
            this.setData({
                isCamera: true,
                btnTxt: "拍照"
            })
            return
        }
        this.ctx.takePhoto({
            quality: 'high',
            success: (res) => {
                this.setData({
                    src: res.tempImagePath,
                    isCamera: false,
                    btnTxt: "重拍"
                })
                wx.showLoading({
                    title: '正在加载中',
                })
                wx.getFileSystemManager().readFile({
                    filePath: res.tempImagePath,
                    encoding: "base64",
                    success: res => {
                        that.req(that.accessToken, res.data)
                    },
                    fail: res => {
                        wx.hideLoading()
                        wx.showToast({
                            title: '拍照失败,未获取相机权限或其他原因',
                            icon: "none"
                        })
                    }
                })
            }
        })
    },
    req: function (token, image) {
        var that = this
        var data = {
            "image": image
        }
        wx.request({
            url: 'http://127.0.0.1:8000/Reference/',
            method: 'POST',
            data: data,
            header: {
                "content-type": "application/x-www-form-urlencoded",
            },
            success (res) {
                wx.hideLoading();
                console.log(res.data)
                var results = res.data.results;
                wx.setStorageSync('photo_results', results);
                console.log(results);
                if (results) {
                    that.setData({
                        isShow: true,
                        results: results,
                        visible3: true
                    })
                    if(results.order==1){
                        this.setData({
                            result_pic:'/images/1.png'
                        })
                    }
                    else if(results.order==2){
                        this.setData({
                            result_pic:'/images/2.png'
                        })
                    }
                    else if(results.order==3){
                        this.setData({
                            result_pic:'/images/3.png'
                        })
                    }
                    else if(results.order==4){
                        this.setData({
                            result_pic:'/images/4.png'
                        })
                    }
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: '没有认出来，可以再试试~',
                    })
                }
                plugin.textToSpeech({
                    lang: "zh_CN",//代表中文
                    tts: true, //是否对翻译结果进行语音合成，默认为false，不进行语音合成
                    content: '该垃圾是'+results[0].garbage_name+',属于'+results[0].garbage_classification,//要转为语音的文字
                    success: function (res) {
                      console.log("succ tts", res.filename);
                      innerAudioContext.src = res.filename;
                      innerAudioContext.play()
                    },
                    fail: function (res) {
                      console.log("fail tts", res)
                    }
                  })
                

            },
            fail(error){
                wx.hideLoading();
                console.log(error);
                wx.showToast({
                    icon: 'none',
                    title: '请求失败了，请确保网络正常，重新试试~',
                })
            }
        });

    },
    radioChange: function (e) {
        console.log(e)
        console.log(e.detail)
        console.log(e.detail.value)
        wx.navigateTo({
            url: '/pages/ai/search?searchText=' + e.detail.value,
        })
    },
    hideModal: function () {
        this.setData({
            isShow: false,
        })
    },

    error(e) {
        console.log(e.detail)
    }

})