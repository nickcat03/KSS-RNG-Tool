function changeInputs(value, variable) {
    value = parseInt(value, 10);
    maxInputs = value;
    console.log(value);
    for (var i = 1; i < value; i++) {
        box[i].style.display = 'revert';
    }
    for (var i = value; i < 6; i++) {
        box[i].style.display = 'none';
    }
    
    initializePage();
}

function noNumpadConversion(key) {
    const directionMap = {
        'z': 1,
        'x': 2,
        'c': 3,
        'a': 4,
        'd': 6,
        'q': 7,
        'w': 8,
        'e': 9,
    };

    return directionMap[key.toLowerCase()] || null;
}