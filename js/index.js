// set up youtube player
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;
var paused = false;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        width: '1920',
        height: '1080',
        playerVars: {
            listType: 'playlist',
            list: 'PLW0xC9CIbqVP4bl9NUF3w33uOzpmW8ieP',
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            loop: 1,
            showinfo: 0,
            rel: 0, 
            iv_load_policy: 3,
            start: 3
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange
        }
    });
}

function toggleMute() {
    $("#mute").removeClass("icon-volume-mute icon-volume-mute2");
    if (player.isMuted()) {
        player.unMute();
        $("#mute").addClass("icon-volume-mute");
    } else {
        player.mute();
        $("#mute").addClass("icon-volume-mute2");
    }
}

function togglePause() {
    $("#pause").removeClass("icon-pause2 icon-play3");
    if (paused) {
        player.playVideo();
        $("#pause").addClass("icon-pause2");
        paused = false;
    } else {
        player.pauseVideo();
        $("#pause").addClass("icon-play3");
        paused = true;
    }
}

function onPlayerStateChange(event) {
    // hide text until player loads + 2 seconds
    if (event.data == YT.PlayerState.PLAYING) {
        setTimeout(function (){
            $(".show-load").css("opacity", 0);
            $(".hide-load").removeClass("hide-load");
            $(".loader").css("display", "none");
        }, 3000);
    }
}

function onPlayerReady(event) {
    // mute player, set watch link, set mute toggle
    player.mute();
    $("#watch").attr("href", player.getVideoUrl());
    $("#mute").click(toggleMute);
    $("#pause").click(togglePause);

    // make youtube player correct size
    $(window).on("resize", function () {
        var $player = $("#player");
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        var ratio = 1280.0 / 580;
        var vidRatio = 16.0 / 9;
        var hAdjust = 720.0 / 580;
        if (windowWidth / windowHeight > ratio) { // too wide
            $player.width(windowWidth);
            var playerHeight = windowWidth / vidRatio;
            $player.height(playerHeight);
            var marginTop = (windowHeight - playerHeight) / 2;
            $player.css('margin-left', 0);
            $player.css('margin-top', marginTop+'px');
        } else { // too tall
            var playerHeight = windowHeight * hAdjust;
            var playerWidth = ratio * playerHeight;
            $player.height(playerHeight);
            $player.width(playerWidth);
            var marginLeft = (windowWidth - playerWidth) / 2;
            $player.css('margin-top', -(720.0 - 580) / 2 * hAdjust);
            $player.css('margin-left', marginLeft+'px');
        }
    }).resize();
}