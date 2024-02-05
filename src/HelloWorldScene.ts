import Phaser from 'phaser'
import * as Utils from './utils'

interface IMovePayload {
    target: Phaser.GameObjects.GameObject
    startX: number
    startY: number
    peakY: number
    destX: number
    destY: number
    firstDuration: number
    secondDuration: number
    easingNamespace: {
        Out: (v: number) => number
        In: (v: number) => number
    }
}

export default class HelloWorldScene extends Phaser.Scene {
    constructor() {
        super('hello-world')
    }

    preload() {
        this.load.setBaseURL('https://labs.phaser.io')

        this.load.image('sky', 'assets/skies/space3.png')
        this.load.image('logo', 'assets/sprites/phaser3-logo.png')
        this.load.image('coin', 'assets/sprites/block-ice.png')
        this.load.image('red', 'assets/particles/red.png')
    }

    create() {
        this.add.image(400, 300, 'sky')
        const totalDuration = 1500

        const logo = this.add.image(100, 300, 'coin')
        Utils.setWorldSize(logo, 50, 50)
        this.tweenHigherToLower({
            target: logo,
            peakY: 80,
            startX: 100,
            startY: 300,
            destX: 500,
            destY: 500,
            firstDuration: totalDuration / 2,
            secondDuration: totalDuration / 2,
            easingNamespace: Phaser.Math.Easing.Quadratic,
        })
    }

    private validateHigherToLowerPayload(payload: IMovePayload) {
        const { startY, destY, peakY, firstDuration, secondDuration } = payload

        if (destY <= startY) throw new Error('not higher to lower')
        if (peakY >= startY || peakY >= destY) throw new Error('Invalid peak Y')
        if (firstDuration <= 0) throw new Error('Invalid first duration')
        if (secondDuration <= 0) throw new Error('Invalid second duration')
    }

    private tweenHigherToLower(payload: IMovePayload) {
        this.validateHigherToLowerPayload(payload)
        this.moveObject(payload)
    }

    private moveObject(payload: IMovePayload) {
        const { target, peakY, destX, destY, firstDuration, secondDuration, easingNamespace } = payload
        const totalDuration = firstDuration + secondDuration

        this.add.tween({
            targets: target,
            duration: firstDuration,
            ease: easingNamespace.Out,
            props: {
                y: peakY,
            },
            onComplete: () => {
                this.add.tween({
                    targets: target,
                    duration: secondDuration,
                    ease: easingNamespace.In,
                    props: {
                        y: destY,
                    },
                })
            },
        })

        this.add.tween({
            targets: target,
            duration: totalDuration,
            props: {
                x: destX,
            },
        })
    }
}
