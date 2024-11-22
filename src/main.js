// making myself not miserable
'use strict'

// game config
let config = {
    parent: 'GAME TITLE',
    type: Phaser.AUTO,
    render: {
        pixelArt: true
    },
    width: 291,
    height: 181,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    zoom: Math.min((window.innerHeight/181)-.1, (window.innerWidth/291)-.1),
    scene: [ Load, PlantTest, Play, Keys ]
}

// game variables
const game = new Phaser.Game(config)
// convenience variables
const centerX = game.config.width/2
const centerY = game.config.height/2
const width = game.config.width
const height = game.config.height
// log variables
const testColor = "color: #91aa86;"
const goodColor = "color: #cfd1af;"
const badColor = "color: #c088ae;"
// key variables
let cursors