class Vector {
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    add(other) {
        return new Vector(this.x + other.x, this.y + other.y)
    }

    minus(other) {
        return new Vector(this.x - other.x, this.y - other.y)
    }

    copy() {
        return new Vector(this.x, this.y)
    }

    stringify() {
        return this.x.toString() + ':' + this.y.toString()
    }

    mult(coefficient) {
        const x = this.x * coefficient
        const y = this.y * coefficient
        return new Vector(x, y)
    }

    equal(other) {
        return this.x == other.x && this.y == other.y
    }
}
