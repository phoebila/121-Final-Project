// allow for strict typing
'use strict'

const tileSize = 8

const worldPadding = 2
const worldDimensions = {
    width: 12,
    height: 8,
}

const gameDimensions = {
    width: tileSize * worldDimensions.width + tileSize * 2,
    height: tileSize * worldDimensions.height + tileSize * 3 + tileSize * worldPadding,
}

// game config
let config = {
    parent: 'GAME TITLE',
    type: Phaser.AUTO,
    render: {
        pixelArt: true,
    },
    width: gameDimensions.width,
    height: gameDimensions.height,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    zoom: Math.min(
        window.innerHeight / gameDimensions.height - 0.5,
        window.innerWidth / gameDimensions.width - 0.1,
    ),
    scene: [Load, Menu, Play, Keys, UI],
}

// game variables
const game = new Phaser.Game(config)
// convenience variables
const centerX = game.config.width / 2
const centerY = game.config.height / 2
const width = game.config.width
const height = game.config.height
// log variables
const testColor = 'color: #91aa86;'
const goodColor = 'color: #cfd1af;'
const badColor = 'color: #c088ae;'
// key variables
let cursors, space, eKey, gKey
