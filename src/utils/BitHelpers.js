// helpers and variables for tiles saving themselves

// important attributes saved in each tile
const bitDetailsIndex = {
    LIGHT_LEVEL: 0,
    WATER_LEVEL: 1,
    SPECIES: 2,
    GROWTH_LEVEL: 3,
}

// amount bits per attribute
const bitLayout = [{ bits: 2 }, { bits: 2 }, { bits: 3 }, { bits: 2 }]

// helper function for masking bits in a given file
function calculateMask(bits) {
    return (1 << bits) - 1
}

// modifies the bit layout to include attribute shift + mask
let shift = 0
bitLayout.forEach(bitInfo => {
    bitInfo.shift = shift
    shift += bitInfo.bits
    bitInfo.mask = calculateMask(bitInfo.bits)
})