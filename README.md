# h5player
使用H5-video打造属于自己的视频播放器
###一、h5播放器依赖以下文件：
- jquery.min.js
- public.js
- H_EV_XK_DEV.js
- player.normal.rem.css
- touch.js(扩展功能）
- jquery.danmu.js(扩展功能）
- images(保存播放器所需图片)

###二、使用说明：
- html文件头部引入播放器依赖文件；
- 通过new HONGSHIYUN().embed()方法调用（详情见example.html）并传入视频地址（支持ajax请求获取视频地址）；

###三、主要功能：
- 基本功能：播放、暂停、快进、快退、全屏、退出全屏、陀螺仪；
- 扩展功能：弹幕、滑动seek、手动seek、数据上报、倍数播放；
- 手机支持：兼容市场绝大多数手机；

###四、其他说明：
- m3u8格式的文件pc端无法直接播放，只有移动端才能播放；
