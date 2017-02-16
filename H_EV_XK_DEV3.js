(function (i, s, o, g, r, a, m) {
    i["GoogleAnalyticsObject"] = r;
    i[r] = i[r] || function () {
          (i[r].q = i[r].q || []).push(arguments)
      }
      ,
      i[r].l = 1 * new Date();
    a = s.createElement(o),
      m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, "script", "//www.google-analytics.com/analytics.js", "ga");
ga("create", "UA-71338016-1", "auto");
ga("send", "pageview");
var HONGSHIYUN = function () {
    this.id = "";
    this.options = null;
    this.vid = null;
    this.epid = null;
    this.uid = null;
    this.xkuc = null;
    this.player = null;
    this.intervalId = null;
    this.useH5 = false;
    this.src = null;
    this.width = null;
    this.height = null;
    // this.playerCss = "http://static.hongshiyun.net/player/h5/v0.0.2/player.normal.rem.css";
    this.playerCss = "player.normal.rem.css";
    this.version = "v0.0.2";
    this.poster = null;
    this.H5Video = null;
    this.playEl = null;
    var beginSwipTime = null;
    var initBeginTime = 0;
    var progressInteval = null;
    var playList = null;
    this.rServer = null;
    var currentPlayIndex = 0;
    var r_server = null;
    var currentPlayTime = 0;
    var dragging = false;
    var isFirstOrSeek = true;
    var isFisrt = true;
    var forbidSeek = true; //初始化时，禁止seek,播放后启用seek;
    var bufferSetTime = null;
    var waitingSetTime = null;
    var isPlaying = false;
    var isComplete = false;
    var dev = false;
    var ajaxDev = false;
    var changeState = false;
    var controlBarHide = false;
    var controlBarInteval = null;
    var pauseIconInteval = null;
    var rateInteval = null;
    var videoParam = null;
    var self = this;
    this.liveId = null;
    this.cdnFlag = null;
    var eventCallback = null;
    var sessionId = null;
    var isOnline = true;
    this.onLive = false;  //是否为直播    (美术宝需求) 如果是直播,首次加载时控制栏显示直播
    this.isRotate = false;//全屏按钮是否需要转屏 (美术宝需求)
    this.isfullScreen = false;//默认是否为全屏 (美术宝需求)
    this.hideControlBar = false;//是否隐藏控制栏(美术宝需求) true时始终不显示控制栏
    this.isVR = false;
    var firstLoad = true;
    var positionLeft = 0; //处理进度条圆点在最左侧无法seekbug；
    var timeViewWidth = 0;
    var preRate = 1;
    var rate = 1;
    var locationHref = window.location.href;
    var rateSrc = {};
    var rateStateChange = false;
    var rateCurrentTime = 0;
    var H5Video;
    var H5Video2;
    var count = false;
    var videoToogle = false;
    var hidePauseInterval;
    this.embed = function (embedId, options) {
        this.options = options;
        if (options.eventCallback) {
            eventCallback = options.eventCallback
        }
        if (options.eventCallback) {
            videoCallback = options.videoCallback
        }
        if (options.rServer) {
            this.rServer = options.rServer;
            rServer = this.rServer
        }
        if (options.dev != null) {
            dev = options.dev
        }
        if (options.ajaxDev != null) {
            ajaxDev = options.ajaxDev
        }
        if (options.isVR != null) {
            this.isVR = options.isVR
        }
        if (options.width != null) {
            this.width = options.width
        }
        if (options.height != null) {
            this.height = options.height
        }
        if (options.poster != null) {
            this.poster = options.poster
        }
        // if (options.src != null) {
        //     if (locationHref.charAt(4) == "s") {
        //         // this.src = options.src.replace("http","https")
        //         this.playerCss = "https://static.hongshiyun.net/player/h5/v0.0.2/player.normal.rem.css";
        //     }
        //     this.src = options.src;
        // }
        if (options.id != null) {
            this.id = options.id
        }
        if (options.sessionId != null) {
            sessionId = options.sessionId
        }
        if (options.vid != null) {
            this.vid = options.vid
        }
        if (options.epId != null) {
            this.epId = options.epId
        }
        if (options.xkuc != null) {
            this.xkuc = options.xkuc
        } else {
            this.xkuc = Utils.getCookie("user_token")
        }
        if (options.liveId != null) {
            this.liveId = options.liveId
        }
        if (options.onLive != null) {
            this.onLive = options.onLive
        }
        if (options.isRotate != null) {
            this.isRotate = options.isRotate
        }
        if (options.isfullScreen != null) {
            this.isfullScreen = options.isfullScreen
        }
        if (options.hideControlBar != null) {
            this.hideControlBar = options.hideControlBar
        }
        if (options.rateSrc != null) {
            rateSrc = options.rateSrc;
            if (locationHref.charAt(4) == "s") {
                // this.src = options.src.replace("http","https")
                this.playerCss = "https://static.hongshiyun.net/player/h5/v0.0.2/player.normal.rem.css";
            }
            this.src = options.rateSrc['default'];
        }
        var self = this;
        var contentId = "player-container";
        document.getElementById(embedId).outerHTML = '<div id="' + contentId + '" class ="player-container"> </div>';
        this.playerEl = $("#" + contentId);
        this.dynamicLoading.css(this.playerCss);
        var html = '<div class="player-box" >' + '<div class="video-area" id="video-area" style=\'height: 100%\' ></div>' +
          '<div class="display" id="display" >' +
          '<div class="seek-tip" >  ' + "<div class=\"seek-forward\" >" + "</div>" + "<div class=\"seek-back\" >" + "</div>" + "<div class=\"time-view\" style='display: none;'>" + '<span class="control-text time-current-text" >00:00:00</span>' + "<span class=\" control-text control-time-split \" >/</span>" + '<span class="control-text time-total-text" >00:00:00</span>' + "</div>" + '<div class="control-slider-tip">' + '<div class="control-silder-tracked" ></div>' + "</div>" + "</div>" +
          '<div class="rate-select-text">' +'<div class = "rate-detail-set"><div class="rete-detail-container"><div class="rate-detail-item"><img src="images/rabbit-sketch.png" class="rate-detail-img" ></div>' + '<div class="rate-val" data-val = "1.8" >1.8倍数</div></div></div>' + '<div class="rate-line"></div>' +'<div class = "rate-detail-set"><div class="rete-detail-container"><div class="rate-detail-item"><img src="images/snail-sketch.png" class="rate-detail-img" ></div>' + '<div class="rate-val" data-val = "1.0" >1.0倍数</div></div></div>' + '</div>' +
          '<div class="control-bar" >  ' + '<div class="container-except-slider1" >' + '<ul class="rate-select">' + '<li class="rate-select-title">' + '</li>' + "</ul>" + "<div class=\"btn-playing\" style='display: none;'>直播中</div>" + "<div class=\"time-view\" style='display: none;'>" + '<span class="control-text time-current-text" >00:00:00</span>' + "</div>" + "</div>" + '<div class="control-slider-container">' + '<div class="control-slider-scrub"></div>' + '<div class="control-slider">' + '<div class="control-silder-tracked" ></div>' + "</div>" + "</div>" + '<div class="container-except-slider2" >' + "<div class=\"time-view time-total\" style='display: none;'>" + '<span class="control-text time-total-text" >00:00:00</span>' + "</div>" + '<ul class="quality-select-pop">' + "</ul>" + '<div class="quality-select">' + '<span class="quality-select-text"></span>' + "</div>" + '<div class="btn-fullscreen"></div>' + '<div class="btn-fullscreen-off"></div>' + "</div>" + "</div>" +
          '<div class="load-layer" >' + '<i class="player-icon icon-preview start-play"></i>' + "</div>" +
          '<div class="play-layer" >' + ' <div class="sk-fading-circle">' + '<div class="sk-circle1 sk-circle"></div>' + '<div class="sk-circle2 sk-circle"></div> ' + '<div class="sk-circle3 sk-circle"></div> ' + '<div class="sk-circle4 sk-circle"></div> ' + '<div class="sk-circle5 sk-circle"></div> ' + '<div class="sk-circle6 sk-circle"></div> ' + '<div class="sk-circle7 sk-circle"></div> ' + '<div class="sk-circle8 sk-circle"></div> ' + '<div class="sk-circle9 sk-circle"></div> ' + '<div class="sk-circle10 sk-circle"></div>' + ' <div class="sk-circle11 sk-circle"></div> ' + '<div class="sk-circle12 sk-circle"></div>' + "</div>" + '<i class="player-icon icon-preview go-play"></i>' + "<i class=\"pause-icon icon-preview\" style='display:none;'></i>" + "</div>" +
          "</div>";
        document.getElementById(contentId).innerHTML = html;
        document.getElementById("video-area").innerHTML = '<div id=\'danmu\' class=\'danmu-div\' style=\'pointer-events:none;\'></div><video   webkit-playsinline playsinline  class= "hideControls"  width="1%" height="1%" preload="auto"  load="loaded" ></video><video   webkit-playsinline playsinline id="shiftVideo"  class= "hideControls"  width="1%" height="1%" preload="auto"  load="loaded" ></video>';
        if (options.poster != null) {
            $(".load-layer").prepend("<img src='" + options.poster + "'>")
        }
        H5Video = document.getElementsByTagName("video")[0];
        H5Video2 = document.getElementsByTagName("video")[1];
        this.bindEvent(H5Video, options);
        this.bindEvent(H5Video2, options);
        var totalPlayTime = setInterval(function () {
            self.configureListeners("totalTimeWatched", "", ($video.attr("data-playingTime") / 1000).toFixed(3));
            $video.attr("data-playingTime", "0")
        }, 5000);
        // if (this.src != null) {
        //     playList = [{
        //         "desc": "标清",
        //         "url": this.src,
        //         "defaultVideo": "1"
        //     }];
        //     self.initPlayerEvent();
        //     $(".time-view").show();
        //     return this
        // }
        if (this.src != null) {
            if (this.src.indexOf('.m3u8') > 0) {
                this.parseDoubleM38u(this.src);
            } else {
                playList = [
                    {"desc": "", "url": this.src, "defaultVideo": "1"}
                ];
                self.initPlayerEvent();
                // $(".btn-pause").show();
                // // self.play();
                // $(".start-play").trigger('click');
                $('.time-view').show();
            }

            //self.setPosterImage(this.poster);
            return this;
        }
        ;
        var param = {
            liveId: this.liveId,
            epId: this.epId,
            vid: this.vid,
            id: this.id,
            xkuc: this.xkuc,
            sign: ""
        };
        videoParam = param;
        param.sign = faultylabs.MD5(param.vid + "3d6a640a475e5ac1a5191ebea8ff441a" + this.xkuc).toLowerCase();
        initBeginTime = new Date().getTime()
        return this
    };
    this.waiting = function () {
        if (eventCallback != null) {
            eventCallback("waiting")
            $('#test').append('waiting==>\n');
        }
        ga("send", "event", "videoBuffering", "waiting", self.src)
    };
    this.isLive = function (url) {
        if (this.onLive) {
            return true
        }
        if (url.indexOf("live") != -1) {
            return true
        } else {
            return false
        }
    };
    this.checkMultiDomain = function () {
        return;
        var playedDomain = ["http://hls1.xiankan.com", "http://hls2.xiankan.com"];
        var liveDomain = ["http://hlslive1.xiankan.com", "http://hlslive2.xiankan.com"];
        var randomSelectedUrl = playList[0].url;
        var kuaiwangUrl = null;
        var aliUrl = null;
        var endStr = "/cdn.gif?t=" + new Date().getTime();
        if (self.isLive(randomSelectedUrl)) {
            kuaiwangUrl = liveDomain[0] + endStr;
            aliUrl = liveDomain[1] + endStr;
            var randomInt;
            if (defaultCdn == 1) {
                randomInt = 0
            } else {
                randomInt = 1
            }
            console.log("select  %s", liveDomain[randomInt]);
            ga("send", "event", "chooseCdn", "chooseCdn", liveDomain[randomInt], "1");
            for (var i = 0; i < playList.length; i++) {
                playList[i].url = liveDomain[randomInt] + playList[i].url.replace(liveDomain[0], "").replace(liveDomain[1], "")
            }
            console.log(" PLAYLIST URL   %o", playList)
        } else {
            kuaiwangUrl = playedDomain[0] + endStr;
            aliUrl = playedDomain[1] + endStr;
            var randomInt;
            if (defaultCdn == 1) {
                randomInt = 0
            } else {
                randomInt = 1
            }
            console.log("select  %s", playedDomain[randomInt]);
            ga("send", "event", "chooseCdn", "chooseCdn", playedDomain[randomInt], "1");
            for (var i = 0; i < playList.length; i++) {
                playList[i].url = playedDomain[randomInt] + playList[i].url.replace(playedDomain[0], "").replace(playedDomain[1], "")
            }
        }
        console.log(1);
        console.log("one url %s ,second %s", kuaiwangUrl, aliUrl);
        var time = new Date();
        console.log("load start time  %s ", time);
        var kuaiwangImg = new Image();
        kuaiwangImg.src = kuaiwangUrl;
        kuaiwangImg.onload = function () {
            console.log("kuaiwangUrl load end time  %s ", new Date() - time);
            console.log("kuaiwangUrl %o", (new Date() - time));
            cdnFlag = 0;
            ga("send", "event", "kwcdn", "loadKwTime", "loadKwTime", new Date() - time)
        }
        ;
        var aliImg = new Image();
        aliImg.src = aliUrl;
        aliImg.onload = function () {
            console.log("aliUrl load end time  %s ", new Date() - time);
            console.log("aliUrl %o", (new Date() - time));
            ga("send", "event", "alicdn", "loadAliTime", "loadAliTime", new Date() - time);
            cdnFlag = 1
        }
    };
    this.setPosterImage = function (poster) {
        var img = new Image();
        img.src = poster;
        if (img.complete) {
            $(".load-layer").prepend('<img src="' + poster + '">');
            if (img.width < img.height) {
                $(".load-layer >img").css("top", "-6rem");
                $(".load-layer >img").css("height", "initial");
                $(".load-layer >img").show()
            } else {
                $(".load-layer >img").show()
            }
        } else {
            $(".load-layer").prepend('<img src="' + poster + '">');
            img.onload = function () {
                if (img.width < img.height) {
                    $(".load-layer >img").css("top", "-6rem");
                    $(".load-layer >img").css("height", "initial");
                    $(".load-layer >img").show()
                } else {
                    $(".load-layer >img").show()
                }
            }
        }
    };
    this.parseDoubleM38u = function (src) {
        var convertSrc;
        var srcArr = src.split('/');
        $.ajax({
            url: src,
            //url:'data/double.txt',
            // data: {
            //     url: src
            // },
            // dataType: "jsonp",
            success: function (result) {
                var isDouble = result.indexOf('#EXT-X-STREAM-INF') > 0 ? true : false;
                if (isDouble) {
                    convertSrc = result.split('\n');
                    for (var i in convertSrc) {
                        if (convertSrc[i].indexOf('.m3u8') > 0 && convertSrc[i].indexOf('#EXT') < 0) {
                            srcArr.splice(srcArr.length - 1, 1, convertSrc[i]);
                            convertSrc = srcArr.join('/');
                            break;
                        }
                    }
                } else {
                    convertSrc = src;
                }
                playList = [
                    {"desc": "", "url": convertSrc, "defaultVideo": "1"}
                ];
                // $('#test1').append('parseM3u8==>'+convertSrc)
                self.initPlayerEvent();
                $('.time-view').show();
                // console.log(convertSrc);
            }
        });
    };
    this.bindEvent = function (H5Video) {
        if (H5Video) {
            H5Video.addEventListener("durationchange", function () {
                self.onDurationChange()
            });
            H5Video.addEventListener("loadstart", this.loadStart);
            H5Video.addEventListener("canplay", function () {
                if (isFisrt) {
                    var initEndTime = new Date().getTime();
                    var firstDisplayTime = initEndTime - initBeginTime;
                    self.configureListeners("firstDisplayTime", "", firstDisplayTime);
                    isFisrt = false
                }
                if (eventCallback != null) {
                    eventCallback("canplay");
                    if (self.titlesOffSet && self.skipHead && H5Video.currentTime < 2) {
                        H5Video.currentTime = self.titlesOffSet
                    }
                    $('#test').append('canplay==>\n');
                }
                self.skipHead = false;
                self.titlesOffSet = 0
                if (rateStateChange) {
                    H5Video.currentTime = rateCurrentTime;
                }
            });
            H5Video.addEventListener("play", function () {
                if (self.titlesOffSet && self.skipHead && H5Video.currentTime < 2) {
                    H5Video.currentTime = self.titlesOffSet
                }
                $(".player-icon").hide()
            });
            H5Video.addEventListener("pause", function () {
                $(".btn-playing").hide();
                $(".btn-play").show();
                $(".btn-pause").hide();
                if (!count) {
                    $(".go-play").show();
                }
                $(".pause-icon").hide();
                self.pause()
            });
            H5Video.addEventListener("ended", function () {
                self.pause()
            });
            H5Video.addEventListener("waiting", function () {
                self.waiting();
                $(".sk-fading-circle").show();
                $(".player-icon").hide();
                $(".go-play").hide()
            });
            H5Video.addEventListener("seek", function () {
            });
            H5Video.addEventListener("ended", function () {
                self.complete();
                isComplete = true
            });
            H5Video.addEventListener("timeupdate", function () {
                self.timeupdate()
            });
            H5Video.addEventListener("seeking", function () {
                self.seeking()
            });
            H5Video.addEventListener("seeked", function () {
                self.seeked()
                if (rateStateChange) {
                    rateStateChange = false;
                    count = true;
                }
            });
            H5Video.addEventListener("playing", function () {
                self.playing();
                $(".sk-fading-circle").hide();
                $(".player-icon").hide();
            });
            H5Video.addEventListener("volumechange", function () {
                self.volumechange()
            });
            $video = $("video");
            $video.on("play", function () {
                self.configureListeners("playStateChange", "play", "1")
            });
            $video.on("pause", function () {
                self.configureListeners("playStateChange", "pause", "1")
            });
            $video.on("complete", function () {
                self.configureListeners("complete", "videoComplete", "1");
                clearInterval(totalPlayTime)
            });
            $video.on("loadedmetadata", function () {
                $('#test').append('videoWidth==>' + H5Video.videoWidth + '==>videoWidth==>' + H5Video.videoHeight);
            });
            $video.on("durationchange", function () {
                self.configureListeners("durationchange", "newDuration", "1")
            });
            $video.on("loadstart", function () {
                self.configureListeners("loadStateChange", "", "1")
            });
            $video.on("error", function () {
                self.configureListeners("error", "error msg", "1")
            });
            $video.on("volumechange", function () {
                self.configureListeners("volumechange", "newVolume", "1")
            });
            $video.on("waiting", function () {
                if (isFirstOrSeek) {
                    return
                }
                isFirstOrSeek = false;
                self.configureListeners("bufferingChange", "", "1")
            });
            $video.on("ratechange", function () {
                self.configureListeners("autoSwitchChange", "", "1")
            });
            $video.on("seeking", function () {
                self.configureListeners("seekingChange", "", "1")
            });
            $video.on("playing", function () {
                $video.attr("data-updateTime", +new Date())
            });
            $video.on("pause", function () {
                $video.removeAttr("data-updateTime")
            });
            $video.on("waiting", function () {
                $video.removeAttr("data-updateTime")
            });
            $video.on("timeupdate", function (event) {
                var $video = $(event.target)
                  , updateTime = parseInt($video.attr("data-updateTime") || 0)
                  , playingTime = parseInt($video.attr("data-playingTime") || 0)
                  , now = +new Date();
                playingTime = playingTime + now - updateTime;
                $video.attr("data-playingTime", playingTime);
                $video.attr("data-updateTime", now)
            });
            $video.on("waiting", function (event) {
                if ($video.attr("data-waitingTime")) {
                    var waitingTime = parseInt($video.attr("data-waitingTime") || 0)
                } else {
                    var waitingTime = 0
                }
                var time_waiting = 0;
                $video.attr("data-waitingTime", +new Date());
                var waitingUpdateTime = parseInt($video.attr("data-waitingTime") || 0);
                waitingSetTime = setInterval(function () {
                    time_waiting = 0;
                    time_waiting = time_waiting + 1;
                    waitingTime = waitingTime + time_waiting;
                    $video.attr("data-waitingTime", waitingTime);
                    if ($video.attr("data-waitingTime") >= 500) {
                        if (eventCallback != null) {
                            eventCallback("onAccess")
                            $('#test').append('onAccess==>\n');
                        }
                        clearInterval(waitingSetTime)
                    }
                    if ($video.attr("data-waitingTime") <= 50) {
                        isFirstOrSeek = false
                    }
                }, 10)
            });
            $video.on("pause", function () {
                if (waitingSetTime != null) {
                    clearInterval(waitingSetTime)
                }
            });
            $video.on("playing", function () {
                if (waitingSetTime != null) {
                    clearInterval(waitingSetTime)
                }
            });
            $video.on("stalled", function (event) {
                if ($video.attr("data-bufferTime")) {
                    var bufferTime = parseInt($video.attr("data-bufferTime") || 0)
                } else {
                    var bufferTime = 0
                }
                var time_buffer = 0;
                $video.attr("data-bufferTime", +new Date());
                var bufferUpdateTime = parseInt($video.attr("data-bufferTime") || 0);
                bufferSetTime = setInterval(function () {
                    time_buffer = 0;
                    time_buffer = time_buffer + 1;
                    bufferTime = bufferTime + time_buffer;
                    $video.attr("data-bufferTime", bufferTime)
                }, 10);
                console.log($video.attr("data-bufferTime"))
            });
            $video.on("pause", function () {
                if (bufferSetTime != null) {
                    clearInterval(bufferSetTime)
                }
            });
            $video.on("playing", function () {
                if (bufferSetTime != null) {
                    clearInterval(bufferSetTime)
                }
            });
            $video.on("playing", function () {
                if ($video.attr("data-bufferTime")) {
                    self.configureListeners("bufferingTime", "", $video.attr("data-bufferTime") * 10);
                    $video.attr("data-bufferTime", "0")
                } else {
                }
            });
        }
    }
    this.initPlayerEvent = function () {
        var self = this;
        self.checkMultiDomain();
        console.log(playList);
        if (self.isLive(playList[0].url) || self.onLive) {
            $(".btn-play").hide();
            $(".control-slider-container").hide();
            $(".time-view").hide();
            $(".btn-playing").show();
            $(".quality-select").hide();
            for (var i = 0; i < playList.length; i++) {
                if (playList[i].defaultVideo == "1") {
                    this.src = playList[i].url;
                    $(".quality-select .quality-select-text").html(playList[i].desc)
                }
                $(".quality-select-pop").append('<li class="quality-select-text">' + playList[i].desc + "</li>")
            }
        } else {
            for (var i = 0; i < playList.length; i++) {
                if (playList[i].desc == "") {
                    this.src = playList[i].url;
                    $(".quality-select .quality-select-text").html(playList[i].desc)
                }
                $(".quality-select-pop").append('<li class="quality-select-text">' + playList[i].desc + "</li>")
            }
        }
        if (this.src == null) {
            console.log("播放地址为空 %o", playList);
            return
        }
        H5Video.src = this.src;
        if (changeState) {
            return
        }
        this.playerEl.on("mediaPlay", this.play);
        this.playerEl.on("mediaPause", this.pause);
        this.playerEl.on("mediaSeek", function (e, offset) {
            self.seek(offset)
        });
        this.playerEl.on("mediaFullScreen", this.fullScreen);
        this.playerEl.on("mediaFullScreenOff", this.outFullScreen);
        this.playerEl.on("mediaQulitySelect", this.mediaQulitySelect);
        $(".play-layer").on("click", function (e) {
            if (self.isLive(playList[0].url)) {
                $(".pause-icon").hide();
            } else {
                if (isPlaying) {
                    if ($(".pause-icon").css('display') == 'block') {
                        $(".pause-icon").hide();
                    } else {
                        $(".pause-icon").show();
                        self.startPauseIconInterval();
                    }
                }
            }
            // if (!self.hideControlBar) {
            if ($(".control-bar").css('opacity') == '1') {
                $(".control-bar").css('opacity', 0);
            } else {
                self.showControlBar();
            }
            // $(".pause-icon").toggle();
            // }
        });
        $(".start-play").on("click", function () {
            $(".player-container .player-box video").css({
                "width": "100%",
                "height": "100%",
            });
            $(".start-play").hide();
            $(".load-layer").hide();
            // $(".rate-select-text").hide();
            $('.rate-select-text').animate({
                left: '-4.266rem'
            });
            $(".play-layer").show();
            $(".pause-icon").show();
            // if (!self.hideControlBar) {
            //     $(".control-bar").show()
            // }
            self.play();
            self.showControlBar();
            self.showPauseIcon();
            self.configureListeners("videoStart", "", "1");
            ga("send", "event", "video", "click", "start", 1);
            changeState = true;
            firstLoad = false;
            forbidSeek = false;
            return false
        });
        $(".go-play").on("click", function () {
            self.play();
            $(".player-icon").hide();
            $(".pause-icon").show()
            // $(".pause-icon").hide();
            // if (!self.hideControlBar) {
            //     $(".control-bar").show()
            // }
            // $(".control-bar").hide();
            self.showControlBar();
            self.showPauseIcon();
            $(".player-container .player-box video").show();
            ga("send", "event", "video", "click", "start", 1);
            return false
        });
        $("#display").find('.rate-select-text  .rate-detail-set').click(function (e) {
            var supportPlayBackRate = self.isIOS();
            var currentTime = H5Video.currentTime;
            var $el = $(this).find(".rate-val");
            var rateMap = {
                // "0.8": "0.8倍数",
                "1.0": "url(images/snail.png)",
                // "1.2": "1.2倍数",
                // "1.4": "1.4倍数",
                "1.8": "url(images/rabbit.png)"
                // "2.0": "2.0倍数"
            }
            var value = $el.attr('data-val');
            $('.rate-select').css("backgroundImage",rateMap[value]);
            // $(".rate-select-title").html(rateMap[value]);
            rate = Number(value);
            if (supportPlayBackRate) {
                rate && (H5Video.playbackRate = rate);
            } else {
                // H5Video.src = rateSrc[value];
                count = false;
                videoToogle = !videoToogle;
                rateStateChange = true;
                H5Video.pause();
                H5Video = document.getElementsByTagName('video')[(videoToogle ? 1 : 0)];
                // if (videoToogle) {
                //     self.changeVideo(rateSrc[value], H5Video2);
                // } else {
                self.changeVideo(rateSrc[value], H5Video);
                // }

                rateCurrentTime = currentTime * (preRate / rate);
                preRate = Number(value);
                rate = 1;
                var waitTime = 10;
                setTimeout(function () {
                    // Resume play if the element if is paused.
                    $(".go-play").hide();
                    if (H5Video.paused) {
                        H5Video.play();
                    }

                }, waitTime);
                // H5Video.play();
            }
            // if (!firstLoad) {


            // }

            // 选择不同倍率
            // alert(H5Video.playbackRate);
            // alert(H5Video.defaultPlaybackRate);
            // $(".rate-select-text").hide();
            $('.rate-select-text').animate({
                left: '-4.266rem'
            });
            self.stopEventBubble(e);
        })
        $(".rate-select").off().on("click", function (e) {
            self.stopEventBubble(e);
            if($('.control-bar').css('opacity') == 0){
                return ;
            }
            // $(".control-bar").css('opacity', 0);
            $('.control-bar').animate({
                bottom:'-1.621rem',
                opacity:'0'
            });
            $(".pause-icon").hide();
            // $(".rate-select-text").show();
            $('.rate-select-text').animate({
                left:'0'
            });
            self.startRateInterval();
        });
        $(".control-slider-container").off().on("click", function (e) {
            if (!forbidSeek) {
                self.playerEl.trigger("mediaSeek", e.offsetX)
                // console.log('clickseek');
                // $("#test1").append('clickseek==>\n');
            }
        });
        // $(".control-slider-container").on("dblclick", function (e) {
        //     self.playerEl.trigger("mediaSeek", e.offsetX)
        //     console.log('dbClickseek');
        // });
        var dx, dy;
        touch.on(".control-slider-scrub", "touchstart", function (ev) {
            if (forbidSeek) {
                return
            }
            ;
            // $(".control-slider-container").unbind('click');
            self.pause();
            dx = $(".control-slider-scrub").position().left
        });
        touch.on(".control-slider-scrub", "drag", function (ev) {
            if (forbidSeek) {
                return
            }
            ;
            self.stopEventBubble(ev);
            dragging = true;
            var sliderWidth = $(".control-slider-container").width();
            // var dragLeft = $(".control-slider-scrub").position().left;
            // console.log("======sliderWidth======" + sliderWidth);
            // var offset = $(".control-slider-scrub").offset();
            // if (dragLeft <= 0 || dragLeft >= sliderWidth - 23) {
            //     $("#test").append("======");
            //     dx = sliderWidth;
            //     this.style.webkitTransform = "translate3d(" + dx + "," + 0 + ",0)";
            //     return
            // } else {
            dx = dx || 0;
            dy = 0;
            // $("#test").append("当前dx值为:" + dx + "==>" );
            // $("#test").html("当前x值为:" + offx + "==>");
            // console.log("当前x值为:" + offx + ", 当前y值为:" + dy + ".");
            var offy = dy + "px";
            var currentX = ( dx + ev.x) < 0 ? 0 : ( dx + ev.x);
            currentX = ( dx + ev.x) < sliderWidth ? currentX : sliderWidth;
            var offx = currentX + "px";
            var currentTime = parseInt(currentX / sliderWidth * H5Video.duration);
            var playedPer = currentTime / H5Video.duration;
            if (ev.x < 0) {
                $('.seek-forward').hide();
                $('.seek-back').show();
            } else {
                $('.seek-forward').show();
                $('.seek-back').hide();
            }
            $(".player-icon").hide();
            $(".pause-icon").hide();
            $('.seek-tip').show();
            self.autoWidth();
            $(".time-current-text").html(Utils.formatTime(currentTime / rate));
            this.style.webkitTransform = "translate3d(" + offx + "," + offy + ",0)";
            $(".control-silder-tracked").css("width", (playedPer * 100) + "%");
            // }
        });
        touch.on(".control-slider-scrub", "dragend", function (ev) {
            if (forbidSeek) {
                return
            }
            ;
            self.stopEventBubble(ev);
            dragging = false;
            var dragLeft = $(".control-slider-scrub").position().left;
            if (dragLeft) {
                dx += ev.x
            }
            ;
            dy += ev.y;
            self.play();
            self.seek(dragLeft);
            $('.seek-tip').hide();
            // $("#test1").append('drangendSeek==>\n');
            // console.log('drangendSeek');
            // $(".control-slider-container").on("click", function (e) {
            //     if(!forbidSeek){
            //         self.playerEl.trigger("mediaSeek", e.offsetX)
            //         console.log('clickseek');
            //         $("#test1").append('clickseek==>\n');
            //     }
            // });
        });
        $(".btn-play").on("click", function (e) {
            $(".start-play").trigger("click")
        });
        $(".btn-pause").on("click", function (e) {
            self.playerEl.trigger("mediaPause")
        });
        $(".pause-icon").on("click", function (e) {
            self.playerEl.trigger("mediaPause");
            //暂停时控制条不自动隐藏
            if (controlBarInteval != null) {
                clearInterval(controlBarInteval)
            }
            self.stopEventBubble(e);

            $(".pause-icon").hide()
        });
        $(".btn-fullscreen").on("click", function (e) {
            self.playerEl.trigger("mediaFullScreen")
        });
        $(".btn-fullscreen-off").on("click", function (e) {
            self.playerEl.trigger("mediaFullScreenOff")
        });
        $(".display").on("click", function (e) {
            // $('.rate-select-text').hide();
            $('.rate-select-text').animate({
                left: '-4.266rem'
            });
            // self.showControlBar();
            // self.showPauseIcon();
        });
    };
    this.changeVideo = function (src, H5Video) {
        // 清屏
        if (src) {
            // if (this.src.indexOf('.m3u8') > 0) {
            //     this.parseDoubleM38u(src);
            // } else {
            playList = [
                {"desc": "", "url": src, "defaultVideo": "1"}
            ];
            // self.initPlayerEvent();
            // $(".btn-pause").show();
            // // self.play();
            // $(".start-play").trigger('click');
            var self = this;
            self.checkMultiDomain();
            console.log(playList);
            if (self.isLive(playList[0].url) || self.onLive) {
                $(".btn-play").hide();
                $(".control-slider-container").hide();
                $(".time-view").hide();
                $(".btn-playing").show();
                $(".quality-select").hide();
                for (var i = 0; i < playList.length; i++) {
                    if (playList[i].defaultVideo == "1") {
                        this.src = playList[i].url;
                        $(".quality-select .quality-select-text").html(playList[i].desc)
                    }
                    $(".quality-select-pop").append('<li class="quality-select-text">' + playList[i].desc + "</li>")
                }
            } else {
                for (var i = 0; i < playList.length; i++) {
                    if (playList[i].desc == "") {
                        this.src = playList[i].url;
                        $(".quality-select .quality-select-text").html(playList[i].desc)
                    }
                    $(".quality-select-pop").append('<li class="quality-select-text">' + playList[i].desc + "</li>")
                }
            }
            if (this.src == null) {
                console.log("播放地址为空 %o", playList);
                return
            }
            H5Video.src = this.src;
            H5Video.play();
            $('.time-view').show();
            // }

            if (!changeState) {
                $(".player-container .player-box video").css({
                    "width": "100%",
                    "height": "100%",
                });
                $(".start-play").hide();
                $(".load-layer").hide();
                $(".play-layer").show();
                $(".control-bar").show();
            }
            //self.setPosterImage(this.poster);
        }
        ;
        //
        return this;

        // self.initPlayerEvent();

    };
    this.loadStart = function () {
        if (eventCallback != null) {
            eventCallback("loadStart")
            $('#test').append('loadStart==>\n');
        }
    };
    this.timeupdate = function () {
        if (eventCallback != null) {
            eventCallback("timeupdate")
        }
        // var timeViewWidth = $('.time-view').width() + 42;
        // var screenSet = $('.btn-fullscreen').length > 0 ? $('.btn-fullscreen').width() + 62 : $('.btn-fullscreen-off').width() + 62;
        // console.log(timeViewWidth)
        // console.log(screenSet)
    };
    this.complete = function () {
        if (eventCallback != null) {
            eventCallback("complete")
            $('#test').append('complete==>\n');
        }
        return "complete"
    };
    this.progress = function () {
        if (eventCallback != null) {
            eventCallback("progerss")
            $('#test').append('progress==>\n');
        }
    };
    this.onDurationChange = function () {
        var duration = H5Video.duration;
        $(".time-total-text").html(Utils.formatTime(duration));
        if (currentPlayTime > 0) {
            H5Video.currentTime = currentPlayTime;
            H5Video.play()
        }
        if (currentPlayIndex) {
            var currentPlayName = playList[currentPlayIndex].desc;
            $(".quality-select .quality-select-text").html(currentPlayName)
        }
        if (progressInteval != null) {
            clearInterval(progressInteval)
        }
        if (count) {
            H5Video.currentTime = rateCurrentTime;
            H5Video.play();
        }
        progressInteval = window.setInterval(function () {
            var currentTime = 0;
            if (self.skipHead && self.titlesOffSet && currentTime > -1) {
                H5Video.currentTime = self.titlesOffSet
            }

            var currentTime = H5Video.currentTime;
            if (self.skipTail && currentTime > self.creditsOffSet && currentTime < self.creditsOffSet + 1) {
                self.pause();
                self.complete();
                self.skipTail = false
            }
            if (duration > 0) {
                if (dragging) {
                    return
                }
                var sliderWidth = $(".control-slider-container").width();
                var playedPer = currentTime / duration;
                $(".control-silder-tracked").css("width", (playedPer * 100) + "%");
                $(".time-total-text").html(Utils.formatTime(duration / rate));
                $(".time-current-text").html(Utils.formatTime(currentTime / rate));
                $(".control-slider-scrub").css("transform", "translate3d(" + sliderWidth * playedPer + "px, 0px, 0px)")
            }
            // if (count) {
            //     // alert('rateCurrentTime = '+rateCurrentTime)
            //     // alert('currentTime = '+currentTime)
            // }

            if (count && currentTime > rateCurrentTime + 1.1) {
                H5Video.style.zIndex = 1;
                document.getElementsByTagName('video')[(videoToogle ? 0 : 1)].style.zIndex = -1;
                count = false;
            }
        }, 1000);
        self.startControlBarInterval();
        if (eventCallback != null) {
            eventCallback("durationchange")
            $('#test').append('durationChange==>\n');
        }
        ;
        if (self.isfullScreen) {
            self.fullScreen()
        }
        ;
        if (self.hideControlBar) {
            $(".control-bar").hide()
        }
        ;
        if (self.isLive(playList[0].url) || self.onLive) {
            $('.time-view').hide();
            $(".btn-playing").show();
        }
        ;
        $(".control-bar").show();
        //进度条自动调整样式
        self.autoWidth();
    };
    this.showControlBar = function () {
        if (self.hideControlBar) {
            return
        }
        // $(".control-bar").css('opacity', 1);
        $('.control-bar').animate({
            bottom:'0',
            opacity:'1'
        });
        this.startControlBarInterval();
        timeViewWidth = $('.time-view').width();
        // console.log('show', $('.time-view').width());
    };
    this.showPauseIcon = function () {
        if (self.hideControlBar) {
            return
        }
        $(".pause-icon").show();
        this.startPauseIconInterval();
    }
    this.startControlBarInterval = function () {
        if (controlBarInteval != null) {
            clearInterval(controlBarInteval)
        }
        controlBarInteval = window.setInterval(function () {
            if (!firstLoad) {
                $(".control-bar").css('opacity', 0);
                // $(".rate-select-text").hide();
                // $('.rate-select-text').animate({
                //     left: '-4.266rem'
                // });
            }
            // $(".pause-icon").hide();
        }, 3000)
    };
    this.startPauseIconInterval = function () {
        if (pauseIconInteval != null) {
            clearInterval(pauseIconInteval)
        }
        pauseIconInteval = window.setInterval(function () {
            $(".pause-icon").hide()
            // $(".rate-select-text").hide();
            // $('.rate-select-text').animate({
            //     left: '-4.266rem'
            // });
        }, 3000)
    };
    this.startRateInterval = function () {
        if (rateInteval != null) {
            clearInterval(rateInteval);
        }
        rateInteval = window.setInterval(function () {
            // $(".rate-select-text").hide();
            $('.rate-select-text').animate({
                left: '-4.266rem'
            });
            // $(".pause-icon").hide();
        }, 7000);
    };
    this.play = function () {
        H5Video.play();
        if (self.isLive(playList[0].url)) {
            $(".btn-play").hide();
            $(".btn-pause").hide();
            $(".player-icon").hide();
            $(".pause-icon").hide();
            $(".go-play").hide();
            $(".control-slider-container").hide();
            $(".time-view").hide();
            $(".quality-select").hide();
            $(".btn-playing").show()
        } else {
            $(".btn-play").hide();
            $(".btn-pause").show()
        }
        if (eventCallback != null) {
            eventCallback("play")
            $('#test').append('play==>\n');

        }
    };
    this.pause = function () {
        H5Video.pause();
        if (eventCallback != null) {
            eventCallback("pause")
            $('#test').append('pause==>\n');

        }
        isPlaying = false
    };
    this.mediaQulitySelect = function () {
    };
    function getEnd(video) {
        var end = 0;
        try {
            end = video.buffered.end(0) || 0;
            end = parseInt(end * 1000 + 1) / 1000
        } catch (e) {
        }
        return end
    };
    this.seek = function (offset) {
        var sliderContainerWidth = $(".control-slider-container").width();
        var seekTime = parseInt(offset / sliderContainerWidth * H5Video.duration);
        H5Video.currentTime = seekTime;
        self.play();
        $(".pause-icon").show();
        self.showControlBar();
        self.startPauseIconInterval();
    };
    this.seeking = function () {
        if (eventCallback != null) {
            eventCallback("seeking")
            $('#test').append('seeking==>\n');

        }
    };
    this.playing = function () {
        if (eventCallback != null) {
            eventCallback("playing")
            $('#test').append('playing==>\n');
        }
        isPlaying = true
    };
    this.seeked = function () {
        isFirstOrSeek = true;
        if (eventCallback != null) {
            eventCallback("seeked")
            $('#test').append('seeked==>\n');

        }
        if (H5Video.currentTime >= H5Video.duration) {
            self.complete();
            self.pause()
        }
        //兼容安卓手机
        // if(count){
        //     H5Video.style.zIndex = 1;
        //     document.getElementsByTagName('video')[(videoToogle ? 0 : 1)].style.zIndex = -1;
        // }
    };
    this.volumechange = function () {
        if (eventCallback != null) {
            eventCallback("volumechange")
            $('#test').append('volumeChange==>\n');

        }
    };
    this.fullScreen = function () {
        $(".btn-fullscreen").hide();
        $(".btn-fullscreen-off").css('display', 'inline-block');
        $(".player-box").addClass("wide");
        eventCallback("fullScreen");
        $('#test').append('fullScreen==>\n');

        if (self.phoneVersion() == "android") {
            var arg = {};
            arg.action = "intoFullScreen";
            arg.params = {};
            try {
                window.jsInterface.invokeMethod("send", JSON.stringify(arg))
            } catch (e) {
                if (self.isRotate) {
                    Rotate($("#player-container").parent(), "rotate(90deg)")
                }
            }
        }
        if (self.phoneVersion() == "ios" && self.isRotate) {
            Rotate($("#player-container").parent(), "rotate(90deg)")
        }
    };
    this.outFullScreen = function () {
        $(".btn-fullscreen").css('display', 'inline-block');
        $(".btn-fullscreen-off").hide();
        $(".player-box").removeClass("wide");
        if (!self.hideControlBar) {
            $(".control-bar").show()
        }
        eventCallback("outFullScreen");
        $('#test').append('outFullScreen==>\n');

        if (self.phoneVersion() == "android") {
            var arg = {};
            arg.action = "outFullScreen";
            arg.params = {};
            try {
                window.jsInterface.invokeMethod("send", JSON.stringify(arg))
            } catch (e) {
                Rotate($("#player-container").parent(), "")
            }
        }
        if (self.phoneVersion() == "ios") {
            Rotate($("#player-container").parent(), "")
        }
    };
    this.currentTime = function () {
        try {
            if (H5Video) {
                return H5Video.currentTime
            } else {
                return 0
            }
        } catch (e) {
            return 0
        }
    };
    this.setDanmuDirection = function (dir, str) {
        if (dir == "h") {
            $(".flying").remove()
        } else {
            $(".flying").remove()
        }
    };
    this.setDanmuRect = function (x, y, width, height) {
        return;
        $("#danmu").danmu({
            left: x,
            top: y,
            height: width,
            width: height
        })
    };
    this.setDanmuBgOpacity = function (arg) {
    };
    this.setDanmuTextOpacity = function (arg) {
    };
    this.onAgree = function (data) {
    };
    this.setDanmuSpeed = function (t) {
        return
    };
    this.isIOS = function () {
        var u = navigator.userAgent;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        return isiOS
    };
    this.createXMLHTTPRequest = function () {
        var xmlHttpRequest = null;
        if (window.XMLHttpRequest) {
            xmlHttpRequest = new XMLHttpRequest();
            if (xmlHttpRequest.overrideMimeType) {
                xmlHttpRequest.overrideMimeType("text/xml")
            }
        } else {
            if (window.ActiveXObject) {
                var activexName = ["MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
                for (var i = 0; i < activexName.length; i++) {
                    try {
                        xmlHttpRequest = new ActiveXObject(activexName[i]);
                        if (xmlHttpRequest) {
                            break
                        }
                    } catch (e) {
                    }
                }
            }
        }
        return xmlHttpRequest
    };
    this.dynamicLoading = {
        css: function (path) {
            if (!path || path.length === 0) {
                throw new Error('argument "path" is required !')
            }
            var head = document.getElementsByTagName("head")[0];
            var link = document.createElement("link");
            link.href = path;
            link.rel = "stylesheet";
            link.type = "text/css";
            head.appendChild(link)
        },
        js: function (path) {
            if (!path || path.length === 0) {
                throw new Error('argument "path" is required !')
            }
            var head = document.getElementsByTagName("head")[0];
            var script = document.createElement("script");
            script.src = path;
            script.type = "text/javascript";
            head.appendChild(script)
        }
    };
    this.loadScript = function loadScript(sScriptSrc, callbackfunction) {
        var oHead = document.getElementsByTagName("head")[0];
        if (oHead) {
            var oScript = document.createElement("script");
            oScript.setAttribute("src", sScriptSrc);
            oScript.setAttribute("charset", "utf-8");
            oScript.setAttribute("type", "text/javascript");
            var loadFunction = function () {
                  if (this.readyState == "complete" || this.readyState == "loaded") {
                      callbackfunction()
                  }
              }
              ;
            oScript.onreadystatechange = loadFunction;
            oScript.onload = callbackfunction;
            oHead.appendChild(oScript)
        }
    };
    this.stopEventBubble = function (ev) {
        if (ev.stopPropagation) {
            ev.stopPropagation();
        }
        if (ev.preventDefault) {
            ev.preventDefault();
        }
        ev.cancelBubble = true;
        ev.returnValue = false;
    }
    this.autoWidth = function () {
        // $('#test1').append('autoWidth')
        var width = window.innerWidth;
        var timeViewWidth = $('.time-view').width();
        var seekTipWidth = $('.seek-tip').width();
        var containerExceptSlider1 = $('.container-except-slider1').width();
        var containerExceptSlider2 = $('.container-except-slider2').width();
        // var screenSet = $('.btn-fullscreen').length > 0 ? $('.btn-fullscreen').width() + 62 : $('.btn-fullscreen-off').width() + 62;
        $('.control-slider-tip').css({
            width: timeViewWidth,
            left: (seekTipWidth - timeViewWidth) / 2
        });
        if (width > 525) {
            return
        }
        ;
        $('.control-slider-container').css({
            // width: "6.997rem",
            width: 16 - 1.3 - (containerExceptSlider1 + containerExceptSlider2) / width * 16 + 'rem'
            // left: (timeViewWidth)
        });
        $('.control-slider').css({
            // width: "6.997rem",
            width: 16 - 1.3 - (containerExceptSlider1 + containerExceptSlider2) / width * 16 + 'rem'
            // left: (timeViewWidth)
        });
    }
    this.isPC = function () {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break
            }
        }
        return flag
    };
    this.phoneVersion = function () {
        var browser = {
            versions: function () {
                var u = navigator.userAgent
                  , app = navigator.appVersion;
                return {
                    trident: u.indexOf("Trident") > -1,
                    presto: u.indexOf("Presto") > -1,
                    webKit: u.indexOf("AppleWebKit") > -1,
                    gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1,
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/),
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
                    android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1,
                    iPhone: u.indexOf("iPhone") > -1 || u.indexOf("Mac") > -1,
                    iPad: u.indexOf("iPad") > -1,
                    webApp: u.indexOf("Safari") == -1
                }
            }(),
            language: (navigator.browserLanguage || navigator.language).toLowerCase()
        };
        if (browser.versions.android) {
            return "android"
        }
        if (browser.versions.iPhone) {
            return "ios"
        }
    };
    this.browserVersion = function () {
        var st = navigator.userAgent.toLowerCase().lastIndexOf("/");
        if (self.UA().toLowerCase() == "firefox" || self.UA().toLowerCase() == "seamonkey") {
            return self.UA().toLowerCase() + " " + navigator.userAgent.toLowerCase().substring(st + 1, st + 3)
        } else {
            if (self.UA().toLowerCase() == "opera") {
                return self.UA().toLowerCase() + " " + navigator.userAgent.toLowerCase().substring(st + 1, st + 3)
            } else {
                if (self.UA().toLowerCase() == "netscape") {
                    return self.UA().toLowerCase() + " " + navigator.userAgent.toLowerCase().substring(st + 1, st + 3)
                } else {
                    if (self.UA().toLowerCase() == "taobrowser") {
                        return self.UA().toLowerCase() + " " + navigator.userAgent.toLowerCase().substring(st + 1, st + 3)
                    } else {
                        if (self.UA().toLowerCase() == "qihu 360ee") {
                            return self.UA().toLowerCase()
                        } else {
                            if (self.UA().toLowerCase() == "safari") {
                                return self.UA().toLowerCase() + " " + navigator.userAgent.toLowerCase().substring(st + 1, st + 3)
                            } else {
                                if (self.UA().toLowerCase() == "chrome") {
                                    return self.UA().toLowerCase() + " " + navigator.userAgent.toLowerCase().substring(st + 1, st + 3)
                                } else {
                                    if (self.UA().toLowerCase() == "maxthon") {
                                        return self.UA().toLowerCase() + " " + navigator.userAgent.toLowerCase().substring(st + 1, st + 3)
                                    } else {
                                        if (self.UA().toLowerCase() == "360se") {
                                            return self.UA().toLowerCase()
                                        } else {
                                            if (self.UA().toLowerCase() == "qqbrowser") {
                                                return self.UA().toLowerCase() + " " + navigator.userAgent.toLowerCase().substring(st + 1, st + 3)
                                            } else {
                                                if (self.UA().toLowerCase() == "ttbrowser") {
                                                    return self.UA().toLowerCase() + " " + navigator.userAgent.toLowerCase().substring(st + 1, st + 3)
                                                } else {
                                                    if (self.UA().toLowerCase() == "msie") {
                                                        return self.UA().toLowerCase() + " " + navigator.userAgent.toLowerCase().substring(st + 1, st + 3)
                                                    } else {
                                                        return self.UA().toLowerCase()
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    this.UA = function () {
        var browsertype = "";

        function c(browser) {
            return navigator.userAgent.toLowerCase().indexOf(browser) > -1
        }

        return browsertype = c("opera") === true ? "opera" : (c("msie") && c("360se")) === true ? "360se" : ((c("msie") && c("tencenttraveler")) && c("metasr")) === true ? "sogobrowser" : (c("msie") && c("qqbrowser")) === true ? "QQbrowser" : (c("msie") && c("tencenttraveler")) === true ? "TTbrowser" : c("msie") === true ? "ie" : (c("safari") && !c("chrome")) === true ? "safari" : c("maxthon") === true ? "maxthon" : ((c("chrome") && c("safari")) && c("qihu 360ee")) === true ? "360ee" : (c("chrome") && c("taobrowser")) === true ? "taobrowser" : c("chrome") === true ? "chrome" : ((c("gecko") && !c("webkit")) && c("seamonkey")) === true ? "SeaMonkey" : ((c("gecko") && !c("webkit")) && !c("netscape")) === true ? "firefox" : ((c("gecko") && !c("webkit")) && c("netscape")) === true ? "netscape" : "other"
    };
    this.sendTrackInfo = function (status, label, value) {
        return;
        var variables = new Object();
        variables.client = "h5";
        variables.operatSystem = self.phoneVersion();
        variables.browserVersion = self.browserVersion();
        variables.uuid = self.uuid();
        variables.mac = "XK";
        variables.version = self.version;
        variables.vid = self.vid;
        variables.sessionId = sessionId;
        variables.duration = H5Video.duration;
        variables.uid = self.uid;
        variables.src = self.src;
        variables.type = "event";
        variables.title = document.title;
        variables.referrer = document.referrer;
        variables.loc = window.location.href;
        variables.category = "video";
        variables.action = status;
        variables.label = label;
        variables.ul = window.navigator.language;
        variables.value = value;
        if (window.screen.width >= window.screen.height) {
            variables.resolution = window.screen + "*" + window.screen.height
        } else {
            variables.resolution = window.screen.height + "*" + window.screen.width
        }
        return variables
    };
    this.uuid = function () {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 16), 1)
        }
        s[14] = "4";
        s[19] = hexDigits.substr((s[19] & 3) | 8, 1);
        s[8] = s[13] = s[18] = s[23] = "-";
        var uuid = s.join("");
        return uuid
    };
    this.configureListeners = function (status, label, value) {
        return false;
        var variables = self.sendTrackInfo(status, label, value);
        $.ajax({
            type: "GET",
            url: "http://analytics.hongshiyun.net/v2/acquisition/recordH5FlashContent",
            data: variables,
            dataType: "json",
            success: function (result) {
            }
        })
    };
};
window.addEventListener("orientationchange", function (event) {
    // Rotate($("#player-container").parent(), "");
    // alert(window.innerWidth); // 触发orientationchange回调时，得到屏宽还是480px;
    setTimeout(function () {
        var width = window.innerWidth;
        // if(width > 525){return};
        var containerExceptSlider1 = $('.container-except-slider1').width();
        var containerExceptSlider2 = $('.container-except-slider2').width();
        $('.control-slider-container').css({
            width: 16 - 1.3 - (containerExceptSlider1 + containerExceptSlider2 - 5) / width * 16 + 'rem'
        })
        $('.control-slider').css({
            width: 16 - 1.3 - (containerExceptSlider1 + containerExceptSlider2 - 5) / width * 16 + 'rem'
        })
    }, 300);
    // if (window.orientation == 180 || window.orientation == 0) {
    //     var width = $('body').width();
    //     alert("width180==>" + width)
    //     var timeViewWidth = $('.time-view').width() + 42;
    //     var screenSet = $('.btn-fullscreen').length > 0 ? $('.btn-fullscreen').width() + 62 : $('.btn-fullscreen-off').width() + 62;
    //     $('.control-slider-container').css({
    //         width: (width - timeViewWidth - screenSet),
    //         left: (timeViewWidth)
    //     })
    //     // $(".player-box").removeClass("wide");
    //     // $(".btn-fullscreen").show();
    //     // $(".btn-fullscreen-off").hide();
    //     // $(".limitInfo p ").css({
    //     //     "top": "50%",
    //     //     "left": "50%",
    //     //     "margin": "-1.5rem 0 0 -1.5rem",
    //     //     "width": "100%",
    //     //     "height": "100%"
    //     // });
    //     // $(".player-box .display .load-layer .player-icon").css({
    //     //     "top": "50%",
    //     //     "left": "50%",
    //     //     "margin": "-1.5rem 0 0 -1.5rem",
    //     //     "width": "3rem",
    //     //     "height": "3rem"
    //     // });
    //     // $(".player-box .display .play-layer .player-icon").css({
    //     //     "top": "50%",
    //     //     "left": "50%",
    //     //     "margin": "-1.5rem 0 0 -1.5rem",
    //     //     "width": "3rem",
    //     //     "height": "3rem"
    //     // });
    //     // $(".player-box .display .play-layer .pause-icon").css({
    //     //     "top": "50%",
    //     //     "left": "50%",
    //     //     "margin": "-1.5rem 0 0 -1.5rem",
    //     //     "width": "3rem",
    //     //     "height": "3rem"
    //     // })
    //     //进度条自动调整样式
    //     // this.autoWidth();
    // }
    // if (window.orientation == 90 || window.orientation == -90) {
    //
    //     var width = $('.display').width();
    //     alert("width90==>" + width)
    //     var timeViewWidth = $('.time-view').width() + 42;
    //     var screenSet = $('.btn-fullscreen').length > 0 ? $('.btn-fullscreen').width() + 62 : $('.btn-fullscreen-off').width() + 62;
    //     $('.control-slider-container').css({
    //         width: (width - timeViewWidth - screenSet),
    //         left: (timeViewWidth)
    //     })
    //
    //     // $(".player-box").addClass("wide");
    //     // $(".btn-fullscreen").hide();
    //     // $(".btn-fullscreen-off").show();
    //     // $(".load-layer div ").removeClass("limitInfo");
    //     // $(".player-box .display .load-layer .player-icon").css({
    //     //     "top": "50%",
    //     //     "left": "50%",
    //     //     "margin": "-1rem 0 0 -1rem",
    //     //     "width": "2rem",
    //     //     "height": "2rem"
    //     // });
    //     // $(".player-box .display .play-layer .player-icon").css({
    //     //     "top": "50%",
    //     //     "left": "50%",
    //     //     "margin": "-1rem 0 0 -1rem",
    //     //     "width": "2rem",
    //     //     "height": "2rem"
    //     // });
    //     // $(".player-box .display .play-layer .pause-icon").css({
    //     //     "top": "50%",
    //     //     "left": "50%",
    //     //     "margin": "-1rem 0 0 -1rem",
    //     //     "width": "2rem",
    //     //     "height": "2rem"
    //     // })
    //     //进度条自动调整样式
    //     // $('#test').append("90");
    //     // self.autoWidth();
    //     //     alert(3)
    // }
});

// function createOrientationChangeProxy(fn, scope) {
//     return function() {
//         /*
//          * 如果是Android浏览器，我们设想一种场景，手机从 竖屏-横屏-竖屏-横屏 时，
//          * 这个过程经历了四次切换，但实际我们只需要处理最后一次切横屏的结果，
//          * 那么，延迟300ms执行回调函数，可以在最开始时清除冗余的orientationChangedTimeout。
//          */
//         clearTimeout(scope.orientationChangedTimeout);
//         var args = Array.prototype.slice.call(arguments, 0);
//         scope.orientationChangedTimeout = setTimeout($.proxy(function() {
//             /*
//              * 再设想一种场景，手机从 竖屏-横屏-竖屏 时，在这个过程，系统并未改变任何东西，
//              * 将lastOrientation保存下来，能有效的避免垃圾操作产生的回调处理
//              */
//             var ori = window.orientation;
//             if (ori != scope.lastOrientation) {
//                 fn.apply(scope, args); // 这里才是真正执行回调函数
//             }
//             scope.lastOrientation = ori;
//         }, scope),  300);
//     };
// }
//
// window.addEventListener('orientationchange', createOrientationChangeProxy(function() {
//     alert(window.innerWidth); // 无论是Safari还是Android浏览器都能正确的输出屏宽
// }, window), false);
var Utils = {
    formatTime: function (time) {
        if (!isFinite(time)) {
            return "--:--"
        }
        time = time * 1000;
        time = parseInt(time / 1000);
        var seconds = time % 60;
        time = parseInt(time / 60);
        var minutes = time % 60;
        time = parseInt(time / 60);
        var hours = time % 24;
        var days = parseInt(time / 24);
        var out = "";
        if (days && days > 0) {
            out += days + ":";
            if (hours < 1) {
                out += "00:"
            }
        }
        out += ("0" + hours).slice(-2) + ":"
        out += ("0" + minutes).slice(-2) + ":";
        out += ("0" + seconds).slice(-2);
        return out.trim()
    },
    getCookie: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2])
        } else {
            return null
        }
    }
};
function Rotate(obj, val) {
    var color = obj.css("background-color");
    if (obj.attr("style").indexOf("transform") > 0) {
        val = ""
    }
    obj.css({
        "transform": val,
        "-webkit-transform": val,
        "-moz-transform": val,
        "-ms-transform": val,
        "height": "70%",
        "background-color": color
    })
};