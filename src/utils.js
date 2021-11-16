// allows user to enable full screen
const goFullscreen = (element) => {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullscreen) {
        element.mozRequestFullscreen();
    } else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
    // .. and do nothing if the method is not supported
};

// converts seconds to minutes
function convertElapsedTime(sec) {
    let seconds = Math.floor(sec % 60);

    let minutes = Math.floor(sec / 60);
    return minutes + ":" + seconds;
}

// generates random integers
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// conversion
function degToRad(deg) {
    return deg * Math.PI / 180;
}

// allows to create gradients
function getLinearGradient(ctx, startX, startY, endX, endY, colorStops) {
    let lg = ctx.createLinearGradient(startX, startY, endX, endY);
    for (let stop of colorStops) {
        lg.addColorStop(stop.percent, stop.color);
    }
    return lg;
};


export {
    goFullscreen,
    convertElapsedTime,
    getRandomInt,
    degToRad,
    getLinearGradient
};
