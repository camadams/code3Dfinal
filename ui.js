/**
 * The ui for the controls of the 3d print animation
 * Cameron Adams
 */

// Slider to control printing timeline
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
function restartPrint() {
    if (play) {
        togglePlay();
    }
    drawRange = 2;
    slider.value=drawRange;
}
restartButton.addEventListener('click', () => restartPrint());

//Reset button
var resetViewButton = document.getElementById("resetView");
function resetView() {
    myControls.reset();

}
resetViewButton.addEventListener('click', () => resetView());
