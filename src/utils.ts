function setWorldSize(obj: Phaser.GameObjects.Image, width: number, height: number) {
    obj.setSize(width, height).setDisplaySize(width, height)
}

export { setWorldSize }
