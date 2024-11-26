// making myself not miserable
'use strict'

const tileSize = 8 // tile size in pixels
const worldWidth = 12 // world width in tiles
const worldHeight = 8 // world height in tiles
const worldPadding = 2 // padding for UI layer in tiles
const dimensions = {
    width: tileSize * worldWidth + tileSize * 2,
    height: tileSize * worldHeight + tileSize * 3 + tileSize * worldPadding,
}

// game config
let config = {
    parent: 'GAME TITLE',
    type: Phaser.AUTO,
    render: {
        pixelArt: true,
    },
    width: dimensions.width,
    height: dimensions.height,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    zoom: Math.min(
        window.innerHeight / dimensions.height - 0.5,
        window.innerWidth / dimensions.width - 0.1,
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
