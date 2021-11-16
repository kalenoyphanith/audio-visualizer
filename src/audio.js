let audioCtx;

let element, sourceNode, analyserNode, gainNode, biquadFilterNode;

const DEFAULTS = Object.freeze({
    gain: .5,
    numSamples: 256
});

const Filter = {
    freq: 6000,
    qual: 40,
    playing: false
}

let audioData = new Uint8Array(DEFAULTS.numSamples / 2);

function setupWebaudio(filePath) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    // creates an <audio> element
    element = new Audio();

    // point at a sound file
    loadSoundFile(filePath);

    // create an a source node that points at the <audio> element
    sourceNode = audioCtx.createMediaElementSource(element);

    // analyser node
    analyserNode = audioCtx.createAnalyser();

    analyserNode.fftSize = DEFAULTS.numSamples;

    // 7 - create a gain (volume) node
    gainNode = audioCtx.createGain();
    gainNode.gain.value = DEFAULTS.gain;

    // BIQUIDFILTER: LOWSHELF/BASS
    biquadFilterNode = audioCtx.createBiquadFilter();
    biquadFilterNode.type = "lowshelf";

    // audio graph
    //    sourceNode.connect(analyserNode);
    //    analyserNode.connect(gainNode);
    //    sourceNode.connect(biquadFilterNode);
    //    biquadFilterNode.connect(gainNode);
    //    analyserNode.connect(audioCtx.destination);
    //    gainNode.connect(audioCtx.destination);
    sourceNode.connect(analyserNode);
    analyserNode.connect(gainNode);
    sourceNode.connect(biquadFilterNode);
    biquadFilterNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);

}

// loads in the audio file
function loadSoundFile(filePath) {
    element.src = filePath;
}

// plays the song selected
function playCurrentSound() {
    element.play();
}

// stops the song selected
function pauseCurrentSound() {
    element.pause();
}

// allows the user to adjust volume
function setVolume(value) {
    // make sure that it's a Number rather than a String
    value = Number(value);
    gainNode.gain.value = value;
}

export {
    audioCtx,
    element,
    setupWebaudio,
    playCurrentSound,
    pauseCurrentSound,
    loadSoundFile,
    setVolume,
    analyserNode,
    biquadFilterNode
};
