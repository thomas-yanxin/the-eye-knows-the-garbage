
const getBdAiAccessToken = function () {
    return  new Promise((resolve, reject) => {
        console.log('getBdAiAccessToken!');
        var time = wx.getStorageSync("time");
        var curTime = new Date().getTime();
        console.log('time:'+time+'----curTime:'+curTime);
        console.log(parseInt((curTime - time) / 1000/60/60/24));
        var timeNum = parseInt((curTime - time) / 1000/60/60/24);
        console.log("token生成天数timeNum:" + timeNum);
        var accessToken = wx.getStorageSync("access_token")
        console.log("缓存中的accessToken===" + accessToken)
        if (timeNum > 28 || (accessToken == "" ||
            accessToken == null || accessToken == undefined)) {
            //token超过28天或者不存在，则调用云函数重新获取
            wx.cloud.callFunction({
                name: 'baiduAccessToken',
                success: res => {
                    console.log("云函数获取token:" + JSON.stringify(res))
                    var access_token = res.result.data.access_token
                    // wx.setStorageSync("access_token", access_token);
                    wx.setStorageSync("time", new Date().getTime());
                    resolve(
                        {
                            'access_token': access_token
                        }
                    );
                },
                fail: error => {
                    console.error('[云函数] [sum] 调用失败：', error);
                    reject('调用云函数失败：' + JSON.stringify(error));
                }
            });
        } else {
            //缓存中存在有效的token
            resolve(
                {
                    'access_token': accessToken
                }
            );
        }

    });
}

module.exports = {
    getBdAiAccessToken: getBdAiAccessToken,
}