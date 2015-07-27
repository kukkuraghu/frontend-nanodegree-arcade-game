//Define the constants

// These values are taken from engine.js.
// If you want to change any of these values, change it in engine.js also.
var NO_OF_FIELD_ROWS = 3; //Number of rows available for enemies
var NO_OF_WATER_ROWS = 1; //Number of water rows
var INITIAL_PLAYER_ROW = 5;
var NO_OF_COLUMNS = 5; //Total number of columns
var ROW_HEIGHT = 83; //Row height used in engine.js
var COL_WIDTH = 101; // Col width used in engine.js

// The following values can be adjusted.
var ENEMY_POS_ADJUST = -20; //Used while rendering the enemy. Required to position the enemy vertically centered.
var PLAYER_POS_ADJUST = -10; //Used while redering player. Required to position the player properly in the cell.
//Speed of the enemy is randomly selected from lower limit to higher limit.
var ENEMY_SPEED_LOWER_LIMIT = 120;
var ENEMY_SPEED_HIGHER_LIMIT = 300;
var NO_OF_ENEMIES = 5; //Number of enemy shapes in the game

// Enemy constructor
var Enemy = function() {
    'use strict';
    // The image/sprite for our enemy
    this.sprite = 'images/enemy-bug.png';

    //defines and initializes enemy's x position, y position, speed and row
    this.init();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    'use strict';
    this.x += dt*this.speed; //mutliply time delta with the speed of the enemy

    //if the enemy cross over all the columns, reset the enemy's position
    if (this.x > NO_OF_COLUMNS * COL_WIDTH) {
        this.init();
        return;
    }

    //if the enemy collides with the player (both in the same cell), reset the player.
    if (this.collisionWithPlayer(player)) {
        player.init();
    }
};

// Draw the enemy on the screen.
Enemy.prototype.render = function() {
    'use strict';
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Initialize the horizontal positon (x), row, speed and vertical position(y) of the enemy.
Enemy.prototype.init = function() {
    'use strict';

    //initializes the horizontal position of the enemy, randomly.
    //The randomness will prevent all the enemies entering the game board together.
    //The initial position will be always behind the left edge of the game board.
    //This will provide natural entry for the enemy to the board.
    this.x = getRandomInt(1,10) * -1 * COL_WIDTH;

    //Row of the enemy is randomly selected
    this.row = getRandomInt(NO_OF_WATER_ROWS, NO_OF_WATER_ROWS + NO_OF_FIELD_ROWS);

    //The spped of the enemy is randomly selected
    this.speed = getRandomInt(ENEMY_SPEED_LOWER_LIMIT, ENEMY_SPEED_HIGHER_LIMIT);

    //The vertical position of the enemy
    this.y = this.row * ROW_HEIGHT + ENEMY_POS_ADJUST;
};

// Determine whether the enemy is colliding with the player
// Return true if collides, otherwise return false
Enemy.prototype.collisionWithPlayer = function(player) {
    'use strict';

    //Decide the column of the enemy
    var col = Math.round(this.x / COL_WIDTH);

    //if the enemy is in the same cell with the player, there is collision, return true. Else return false.
    return ((player.row == this.row) && (player.col == col));
};

// Player constructor
var Player = function() {
    'use strict';
    this.sprite = 'images/char-boy.png';
    
    // Initialize the row and col of the player
    this.init();
};

// Draw the player
Player.prototype.render = function() {
    'use strict';
    ctx.drawImage(Resources.get(this.sprite), this.col * COL_WIDTH, this.row * ROW_HEIGHT + PLAYER_POS_ADJUST);
};

// Initialize the row and column of the player
Player.prototype.init = function() {
    'use strict';
    this.row = INITIAL_PLAYER_ROW;
    this.col = getRandomInt(0, NO_OF_COLUMNS); //col is arrived randomly
};

// Adjust the position (row and column) of the player,
// depending on the key pressed.
Player.prototype.handleInput = function(key) {
    'use strict';
    switch(key) {
        case 'left' : this.col -= 1;
            // if the player tries to move out of the left border,
            // keep him at the left most column.
            if (this.col < 0) {
                this.col = 0;
            }
            break;
        case 'right'    :   this.col += 1;
            // if the player tries to move out of the right border,
            // keep him at the right most column.
            if (this.col > 4) {
                this.col = 4;
            }
            break;
        case 'up'       :   this.row -= 1;
             // if the player tries to move up the top row,
             // place him at the bottom row - INITIAL_PLAYER_ROW.
             if (this.row === 0) {
                 this.row = INITIAL_PLAYER_ROW;
             }
             break;
        case 'down'     :   this.row += 1;
            // if the player tries to move down the bottom row,
            // keep him at the bottom row - INITIAL_PLAYER_ROW.
            if (this.row > INITIAL_PLAYER_ROW) {
                this.row = INITIAL_PLAYER_ROW;
            }

            // This break is not necessary.
            // Still added, to avoid bugs in the future if somebody reshuffles
            // the case clauses or adds another case clause.
            break;
    }
    
};

// Load the Enemies to the array allEnemies.
var allEnemies = [];
for (var i=0; i < NO_OF_ENEMIES; i++) {
    allEnemies.push(new Enemy());
}

var player = new Player();


// This listens for key presses and sends the keys to
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    'use strict';
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Returns a random integer between min (included) and max (excluded)
function getRandomInt(min, max) {
    'use strict';
    return Math.floor(Math.random() * (max - min)) + min;
}