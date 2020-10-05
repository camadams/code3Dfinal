/**
 * The ui for the controls of the 3d print animation
 * Cameron Adams
 *
 * ## LICENSE
 * This file is part of Code3D.

 Code3D is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Code3D is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 *
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
