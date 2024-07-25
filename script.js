// script.js

document.addEventListener('DOMContentLoaded', () => {
    const bottlesContainer = document.getElementById('bottles-container');
    const resetButton = document.getElementById('reset-button');
    const moveCounter = document.getElementById('moves-count');
    const resetsCount = document.getElementById('resets-count');
    const statusPopup = document.getElementById('status-popup');
    const levelHeading = document.getElementById('level-heading');

    let bottles = [];
    let selectedBottle = null;
    let moves = 0;
    let level = 1;
    const maxMovesPerLevel = [15, 18, 23, 27, 35];
    let maxMoves = maxMovesPerLevel[0];
    let resetsLeft = 3;

    const levels = [
        [
            ['red', 'blue', 'green', 'yellow'],
            ['green', 'yellow', 'red', 'blue'],
            ['blue', 'green', 'yellow', 'red'],
            [],
            []
        ],
        [
            ['red', 'blue', 'green', 'yellow'],
            ['yellow', 'red', 'blue', 'green'],
            ['blue', 'yellow', 'red', 'green'],
            ['green', 'yellow', 'blue', 'red'],
            [],
            []
        ],
        [
            ['red', 'blue', 'green', 'yellow'],
            ['yellow', 'red', 'blue', 'green'],
            ['blue', 'yellow', 'red', 'orange'],
            ['green', 'yellow', 'blue', 'red'],
            ['purple', 'orange', 'orange', 'purple'],
            ['orange', 'purple', 'green', 'purple'],
            [],
            []
        ],
        [
            ['red', 'blue', 'pink', 'pink'],
            ['yellow', 'purple', 'orange', 'green'],
            ['blue', 'yellow', 'red', 'green'],
            ['green', 'pink', 'blue', 'red'],
            ['purple', 'orange', 'purple', 'orange'],
            ['orange', 'purple', 'green', 'yellow'],
            ['red', 'yellow', 'pink', 'blue'],
            [],
            []
        ],
        [
            ['red', 'pink', 'green', 'yellow'],
            ['yellow', 'black', 'blue', 'green'],
            ['blue', 'orange', 'red', 'green'],
            ['pink', 'purple', 'blue', 'red'],
            ['purple', 'orange', 'black', 'pink'],
            ['orange', 'purple', 'green', 'yellow'],
            ['black', 'orange', 'pink', 'blue'],
            ['purple', 'red', 'black', 'yellow'],
            [],
            []
        ]
    ];

    function initLevel() {
        bottles = [];
        bottlesContainer.innerHTML = '';
        const levelData = levels[level - 1];
        levelData.forEach((layers, index) => {
            const bottle = document.createElement('div');
            bottle.classList.add('bottle');
            bottle.dataset.index = index;
            bottle.addEventListener('click', handleBottleClick);
            bottlesContainer.appendChild(bottle);
            bottles.push({ bottle, layers: [...layers] });
            renderBottle(bottles[index]);
        });
        moves = 0;
        maxMoves = maxMovesPerLevel[level - 1];
        moveCounter.textContent = `${maxMoves}`;
        resetsCount.textContent = `${resetsLeft}`;
        levelHeading.textContent = `Level ${level}`;
    }

    function renderBottle(bottle) {
        const bottleEl = bottle.bottle;
        bottleEl.innerHTML = '';
        bottle.layers.slice().reverse().forEach(color => {
            const layer = document.createElement('div');
            layer.classList.add('layer');
            layer.style.backgroundColor = color;
            bottleEl.appendChild(layer);
        });
    }

    function handleBottleClick(event) {
        const bottleEl = event.target.closest('.bottle');
        if (!bottleEl) return;

        const bottleIndex = parseInt(bottleEl.dataset.index);
        const bottle = bottles[bottleIndex];

        if (selectedBottle === null) {
            if (bottle.layers.length > 0) {
                selectedBottle = bottle;
                bottleEl.classList.add('selected');
            }
        } else {
            if (selectedBottle === bottle) {
                selectedBottle.bottle.classList.remove('selected');
                selectedBottle = null;
            } else {
                const sourceLayer = selectedBottle.layers[selectedBottle.layers.length - 1];
                const destinationLayer = bottle.layers[bottle.layers.length - 1];

                if (
                    bottle.layers.length < 4 &&
                    (destinationLayer === undefined || destinationLayer === sourceLayer)
                ) {
                    bottle.layers.push(selectedBottle.layers.pop());
                    moves++;
                    moveCounter.textContent = `${maxMoves - moves}`;
                    selectedBottle.bottle.classList.remove('selected');
                    renderBottle(selectedBottle);
                    renderBottle(bottle);
                    selectedBottle = null;

                    if (moves >= maxMoves) {
                        showStatus(`You lost the game! Final Score: ${moves}`);
                        return;
                    }

                    if (checkWinCondition()) {
                        if (level === 5) {
                            showStatus(`Congratulations! You completed all levels. Final Score: ${moves}`);
                            setTimeout(() => {
                                level = 1;
                                resetsLeft = 3; // Resetting resets for new game cycle
                                initLevel();
                            }, 7000);
                        } else {
                            level++;
                            showStatus(`Level Complete! Moving to Level ${level}.`);
                            setTimeout(initLevel, 4000);
                        }
                    }
                } else {
                    selectedBottle.bottle.classList.remove('selected');
                    selectedBottle = null;
                }
            }
        }
    }

    function checkWinCondition() {
        return bottles.every(bottle =>
            bottle.layers.length === 0 || bottle.layers.every(color => color === bottle.layers[0])
        );
    }

    function showStatus(message) {
        statusPopup.textContent = message;
        statusPopup.style.display = 'block';
        // statusPopup.classList("popup");
        setTimeout(() => {
            statusPopup.style.display = 'none';
        }, 2000);
    }

    function resetGame() {
        if (resetsLeft > 0) {
            resetsLeft--;
            showStatus(`Reset used! ${resetsLeft} resets left.`);
            initLevel();
            moves = 0;
        } else {
            showStatus('No resets left!');
        }
        resetsCount.textContent = `${resetsLeft}`;
    }

    resetButton.addEventListener('click', resetGame);

    initLevel();
});
