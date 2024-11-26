const bitDetailsIndex = {
    LIGHT_LEVEL: 0,
    WATER_LEVEL: 1,
    SPECIES: 2,
    GROWTH_LEVEL: 3

}
const bitLayout = [
    { bits: 2 },
    { bits: 2 },
    { bits: 3 },
    { bits: 2 }
]

function calculateMask (bits) {
    return (1 << bits ) - 1;
}

let shift = 0;
bitLayout.forEach(bitInfo => {
    bitInfo.shift = shift;
    shift+= bitInfo.bits;
    bitInfo.mask = calculateMask(bitInfo.bits)
});