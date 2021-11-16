import * as utils from './utils.js';
import * as main from './main.js';

let ctx, canvasWidth, canvasHeight, analyserNode, gradient, audioData;

function setupCanvas(canvasElement, analyserNodeRef) {
    ctx = canvasElement.getContext("2d");
    canvasWidth = canvasElement.width;
    canvasHeight = canvasElement.height;


    // BACKGROUND GRADIENT
    gradient = utils.getLinearGradient(ctx, 0, 0, 0, canvasHeight, [{
        percent: 0,
        color: "#fad0c4"
    }, {
        percent: .25,
        color: "#fcb69f"
    }, {
        percent: .5,
        color: "#fecfef"
    }, {
        percent: .75,
        color: "#c2e9fb"
    }, {
        percent: 1,
        color: "#e2ebf0"
    }]);

    // ref to the analyser node
    analyserNode = analyserNodeRef;

    // array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.fftSize / 2);


}

// CANVAS DRAWING
function draw(params = {}) {
    // populate the audioData array with the frequency data from the analyserNode    

    // SHOWS DIFFERENT FORMS OF DATA
    if (main.boolWaveFreq) {
        analyserNode.getByteFrequencyData(audioData);
    } else {
        analyserNode.getByteTimeDomainData(audioData); // waveform data
    }

    // FILLING THE BACKGROUMD
    if (params.showGradient) {
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();
    }

    if (params.showBackground) {
        ctx.save();

        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.fillStyle = "white";
        //        ctx.arc(utils.getRandomInt(canvasWidth), utils.getRandomInt(canvasHeight), utils.getRandomInt(5), 0, 2 * Math.PI, false);
        ctx.arc(utils.getRandomInt(canvasWidth), utils.getRandomInt(canvasHeight), utils.getRandomInt(5), 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }

    // BARS OPTION
    if (params.showBars) {

        const maxHeight = ctx.canvas.height - 200; //100;
        const padding = 5 / main.size;

        // where to start the bottom
        const middleY = (ctx.canvas.height / 2) + 10; // /2;

        let barWidth = ((ctx.canvas.width * 3.5) * main.size) / (audioData.length * 10);
        for (let barNum in audioData) {
            ctx.save();

            barNum = barNum;

            ctx.translate(padding + barWidth * barNum, middleY);
            let barHeight = maxHeight * (audioData[barNum] / 1000) * (main.size / 10); //256

            ctx.beginPath();
            ctx.rotate(2 * Math.PI / 180);

            ctx.rect(0, -barHeight, barWidth - padding, barHeight);

            // REFLECTION
            ctx.scale(1, -1)
            ctx.rect(0, -barHeight + 5, barWidth - padding, barHeight);
            ctx.closePath();
            //ctx.fillStyle = `hsl(${audioData[barNum]}, 100%, 75%)`;
            ctx.fillStyle = "#F6F6F6";
            //ctx.fillStyle = `rgb(${audioData[barNum]}, ${audioData[barNum]},${audioData[barNum]})`; // 'red';
            ctx.fill();
            ctx.restore();

        }

    }

    // QUADRATIC FILTER
    if (params.showQuad) {

        ctx.save();

        for (let i = 0; i < audioData.length; i++) {
            ctx.globalAlpha = 0.2;

            ctx.lineWidth = "0.3";
            ctx.strokeStyle = "white";
            ctx.beginPath(); // left
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo((audioData[i]), audioData[i], 0, 500);
            ctx.stroke();

            ctx.beginPath(); // top
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo((audioData[i]), audioData[i], 800, 0);
            ctx.stroke();

            ctx.beginPath(); // right 
            ctx.moveTo(800, 0);
            ctx.quadraticCurveTo((audioData[i] * -1) + 800, (audioData[i]), 800, 500);
            ctx.stroke();

            ctx.beginPath(); // bottom
            ctx.moveTo(0, 500);
            ctx.quadraticCurveTo((audioData[i] + 100), (audioData[i] * -1.5) + 500, 800, 500);
            ctx.stroke();
        }
        ctx.restore();

    }

    // CIRCLE OPTION
    if (params.showCircles) {
        let maxRadius = canvasHeight / 2.5;
        ctx.save();
        for (let i = 0; i < audioData.length; i++) {
            let percent = audioData[i] / 255;
            let circleRadius = percent * maxRadius;
            //ctx.fillStyle = "white";
            ctx.lineWidth = 5;

            ctx.save();
            ctx.globalAlpha = 0.4;
            ctx.beginPath();
            ctx.strokeStyle = "#c2e9fb";
            ctx.arc((canvasWidth / 2) - 5, (canvasHeight / 2), circleRadius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            ctx.restore();

            ctx.save();
            ctx.globalAlpha = 0.4;
            ctx.beginPath();
            ctx.strokeStyle = "#fcb69f";
            ctx.arc((canvasWidth / 2), canvasHeight / 2, circleRadius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            ctx.restore();

            ctx.save();
            ctx.globalAlpha = 0.05;
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.strokeStyle = "cyan";
            ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * 1.2, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            ctx.restore();

        }
        ctx.restore();
    }

    // CIRCLE OF RECT OPTION
    if (params.rect) {
        let deg = 70;
        let size = main.size;

        for (let i = 0; i < audioData.length; i++) {
            ctx.save();
            ctx.beginPath(); // right 
            ctx.translate(canvasWidth / 2, canvasHeight / 2);
            ctx.rotate(deg * Math.PI / 180);
            deg += 65;
            ctx.fillStyle = `hsl(${audioData[i]}, 100%, 75%)`;
            ctx.rect(-15, 0, size * (audioData[i] / 10), (size - 4) * (audioData[i] / 50));
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    // FILTERS 
    let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;
    for (let i = 0; i < length; i += 4) {
        // NOISE FILTER
        if (params.showNoise && Math.random() < .05) {
            data[i] = data[i] = data[i + 2] = 0;
            data[i + 2] = 100;
        }

        // INVERT FILTER
        if (params.showInvert) {
            let red = data[i],
                green = data[i + 1],
                blue = data[i + 2];
            data[i] = 255 - red; // set red value
            data[i + 1] = 255 - green; // set blue value
            data[i + 2] = 255 - blue; // set green value

        }
    }

    // EMBOSS FILTER
    if (params.showEmboss) {
        for (let i = 0; i < length; i++) {
            if (i % 4 == 3) continue; // skip alpha channel
            data[i] = 127 + 2 * data[i] - data[i + 4] - data[i + width * 4];
        }
    }
    ctx.putImageData(imageData, 0, 0);

}


// PROGRESS BAR
// allows the user to see the time of the song
function getTime(audio) {

    let currTime = Math.floor(audio.currentTime).toString();
    var duration = Math.floor(audio.duration).toString();

    for (let i = 0; i < audioData.length; i++) {
        ctx.font = `${(audioData[i] / 22) + 25 % 30}px Baloo Bhai`;
    }

    ctx.fillStyle = "red";
    ctx.fillText(`${utils.convertElapsedTime(currTime)}/${utils.convertElapsedTime(duration)}`, 19.5, 480.5);
    ctx.fillStyle = "cyan";
    ctx.fillText(`${utils.convertElapsedTime(currTime)}/${utils.convertElapsedTime(duration)}`, 20.5, 479.5);
    ctx.fillStyle = "#000";
    ctx.fillText(`${utils.convertElapsedTime(currTime)}/${utils.convertElapsedTime(duration)}`, 20, 480);
    //ctx.fillText(`${utils.convertElapsedTime(currTime)}/${utils.convertElapsedTime(duration)}`, canvasWidth / 2, canvasHeight / 2);
}

export {
    setupCanvas,
    draw,
    getTime
};
