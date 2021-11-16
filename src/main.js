import * as canvas from './canvas.js';
import * as audio from './audio.js';
import * as utils from './utils.js';

let boolWaveFreq = true;
let lowshelf = false;
let size;

const drawParams = {
    showGradient: true,
    showBars: false,
    showCircles: false,
    rect: true,
    showBackground: true,
    showQuad: false,
    showNoise: false,
    showInvert: false,
    showEmboss: false,
}

const DEFAULTS = Object.freeze({
    sound1: "audio/Daybreak.wav"
});

function init() {
    console.log("init called");

    audio.setupWebaudio(DEFAULTS.sound1);
    let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
    setupUI(canvasElement);
    canvas.setupCanvas(canvasElement, audio.analyserNode);

    // Chrome autoplay fix
    // https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
    canvasElement.onplay = (e) => {
        if (audioCtx.state == "suspended") {
            audioCtx.resume();
        }
    };

    loop();
}

function loop() {

    requestAnimationFrame(loop);
    canvas.draw(drawParams);

    let audioData = new Uint8Array(audio.analyserNode.fftSize / 2);
    audio.analyserNode.getByteFrequencyData(audioData);
    canvas.getTime(audio.element);

    ////////// FREQ OR WAVE FORM //////////////////
    if (freq.checked) {
        boolWaveFreq = true;
    } else {
        boolWaveFreq = false;
    }

    if (wave.checked) {
        boolWaveFreq = true;
    } else {
        boolWaveFreq = false;
    }

    audio.biquadFilterNode.gain.value = lowshelfSlide.value;
    size = sizeSlider.value + 10;

}

function setupUI(canvasElement) {
    // fullscreen button
    const fsButton = document.querySelector("#fsButton");

    // add .onclick event to button
    fsButton.onclick = e => {
        console.log("init called");
        utils.goFullscreen(canvasElement);
    };

    playButton.onclick = e => {
        console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

        if (audio.audioCtx.state == "suspended") {
            audio.audioCtx.resume();
        }

        console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
        if (e.target.dataset.playing == "no") {
            audio.playCurrentSound();
            e.target.dataset.playing = "yes";
        } else {
            audio.pauseCurrentSound();
            e.target.dataset.playing = "no";
        }
    }

    // hookup track <select>
    let trackSelect = document.querySelector("#trackSelect");
    // add .onchange event to <select>
    trackSelect.onchange = e => {
        audio.loadSoundFile(e.target.value);
        //pause the current track if it is playing
        if (playButton.dataset.playing = "yes") {
            playButton.dispatchEvent(new MouseEvent("click"));
        }
    };


    // hookup volume slider & label
    let volumeSlider = document.querySelector("#volumeSlider");
    let volumeLabel = document.querySelector("#volumeLabel");

    // add .oninput event to slider
    volumeSlider.oninput = e => {
        // set the gain
        audio.setVolume(e.target.value);
        // update value of label to match value of slider
        volumeLabel.innerHTML = Math.round((e.target.value / 2 * 100));
    };

    // set value of label to match initial value of slider
    volumeSlider.dispatchEvent(new Event("input"));

    lowshelfSlide.oninput = e => {
        lowshelfLabel.innerHTML = e.target.value;
    };

    sizeSlider.oninput = e => {
        sizeLabel.innerHTML = e.target.value;
    };

    /////////////////// CHECK BUTTONS: SHAPES ///////////////////
    circlesCB.onclick = function () {
        if (this.checked) {
            drawParams.showCircles = true;
        } else {
            drawParams.showCircles = false;
        }
    }

    // enables rect
    rectCB.checked = true;
    rectCB.onclick = function () {
        if (this.checked) {
            drawParams.rect = true;
        } else {
            drawParams.rect = false;
        }
    }

    // enables cars to be shown
    barsCB.onclick = function () {
        if (this.checked) {
            drawParams.showBars = true;
        } else {
            drawParams.showBars = false;
        }
    }

    // show quadratics
    quadCB.onclick = function () {
        if (this.checked) {
            drawParams.showQuad = true;
        } else {
            drawParams.showQuad = false;
        }
    }

    ////////////////// RADIO BUTTONS: FILTERS /////////////////////
    radioButtons.onchange = function () {
        if (noiseCB.checked) {
            drawParams.showNoise = true;
        } else {
            drawParams.showNoise = false;

        }

        if (invertCB.checked) {
            drawParams.showInvert = true;

        } else {
            drawParams.showInvert = false;

        }

        if (embossCB.checked) {
            drawParams.showEmboss = true;

        } else {
            drawParams.showEmboss = false;

        }
    }

}

export {
    init,
    boolWaveFreq,
    size
};
