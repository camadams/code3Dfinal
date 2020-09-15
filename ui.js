// Slider
var slider = document.getElementById("slider");

var drawRange = 2;
slider.oninput = function () {
    drawRange = this.value;
}

// Play button
var play = false;

var playButton = document.getElementById("play");

function togglePlay() {
    play = ! play;
    if (play) {
        playButton.innerHTML = "Stop";
    } else {
        playButton.innerHTML = "Play"
    }
}

playButton.addEventListener('click', () => togglePlay());

// Restart Button
var restartButton = document.getElementById("restart");

restartButton.addEventListener('click', () => {
    if (play) {
        togglePlay();
    }

    drawRange = 2;
    slider.value=drawRange;
});

// Console
// const consoleOutput = document.getElementById("consoleOutput")
