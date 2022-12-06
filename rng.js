//Kirby Super Star RNG Simulator

//these following arrays are for the current bits and next bits, each in integer and boolean form
const currbitsint = Array(16).fill(0);
const nextbitsint = Array(16).fill(0);
const currbitsbin = Array(16).fill(false);
const nextbitsbin = Array(16).fill(false);

//startRNG is the default RNG value when game starts up
const startRNG = "7777";
const minCount = 0;
const maxCount = 65536;
var hits = 0;

//Basic number calc functions
function hexToDecimal(hex) {
    returnhex = parseInt(hex, 16);
    return returnhex;
}

function isBetween(x, low, high) {
    return low <= x && x <= high;
}

function boolToInt(result) {
    var output;
    if (result) {
        return 1;
    }
    else {
        return 0;
    }
}

function hexToBin(hex) {
    let i = parseInt(hex, 16)
    var binary = toBinaryString(i);
    while (binary.length < 8) {
        binary = "0" + binary;
    }
    return binary;
}

function toBinaryString (number) {
    let num = number;
    let binary = (num % 2).toString();
    for (; num > 1; ) {
        num = parseInt(num / 2);
        binary =  (num % 2) + (binary);
    }
    return binary;
}

function toHexString(number) {
    var str = Number(number).toString(16);
    return str.length == 1 ? "0" + str : str;
}

function numDigits(x) {
    return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
}

function allAreTrue(arr) {
    const all =! arr.includes(false);
    return all;
}

//"Count" conversions (count is a unit which is defined by how many steps are from the starting RNG, with the start being 0)
//7777 = 0, DDBD = 1, etc...
function countToHex(count) {
    output = startRNG;
    for (var i = 0; i < count; i++) {
        output = nextHexRNG(output);
    }
    return output;
}

function hexToCount(hexTarget) {
    hexTarget = hexTarget.toUpperCase();
    count = 0;
    testHex = startRNG;
    while ((!(testHex == hexTarget)) && (count < maxCount)){
        count++;
        testHex = nextHexRNG(testHex);
    }
    if (count < maxCount)
        return count;
    else
        return none;
}

function hexToCount(hexTarget) {
    hexTarget = hexTarget.toUpperCase();
    count = 0;
    testHex = startRNG;
    while ((!(testHex == hexTarget)) && (count < maxCount)){
        count++;
        testHex = nextHexRNG(testHex);
    }
    if (count < maxCount)
        return count;
    else
        return none;
}


//RNG-related functions
function xorCalculate(count, bitnum, negative, a, b, c, d, e) {
    var result; 
    var intresult;
    var negresult;

    if (count == 5) {
        result = (a ^ b ^ c ^ d ^ e);
    }
    else {
        result = (a ^ b ^ c);
    }
    intresult = boolToInt(result);

    if (negative) {
        if (intresult == 0)
            negresult = 1;
        else
            negresult = 0;
        intresult = negresult;
    }

    if (intresult != 0) {
        nextbitsint[bitnum] = 1;
        nextbitsbin[bitnum] = true;
    } else {
        nextbitsint[bitnum] = 0;
        nextbitsbin[bitnum] = false;
    }
}

function nextHexRNG(initialHex) {
    var initcurrbin = hexToBin(initialHex); //initcurrbin = initial current binary
    var zeroes = "";

    for (i = initcurrbin.length; i < 16; i++) {
        zeroes = zeroes + "0";
    }

    currbin = zeroes + initcurrbin;  //currbin = current binary
    currbitsstr = currbin.split(""); //convert binary to 16 strings

    for (i = 0; i < 16; i++) {  //convert binary strings to booleans
        currbitsint[i] = parseInt(currbitsstr[i]);
        if (currbitsint[i] == 0) {
            currbitsbin[i] = false;
        }
        else {
            currbitsbin[i] = true;
        }
    }
    //Bit Calculations:
    //1
    xorCalculate(5, 0, true, currbitsbin[6], currbitsbin[7], currbitsbin[8], currbitsbin[10], currbitsbin[11]);
    //2
    xorCalculate(5, 1, false, currbitsbin[6], currbitsbin[8], currbitsbin[9], currbitsbin[11], currbitsbin[12]);
    //3
    xorCalculate(5, 2, false, currbitsbin[7], currbitsbin[9], currbitsbin[10], currbitsbin[12], currbitsbin[13]);
    //4
    xorCalculate(3, 3, false, nextbitsbin[0], currbitsbin[13], currbitsbin[14], true, true);
    //5
    xorCalculate(3, 4, false, nextbitsbin[1], currbitsbin[14], currbitsbin[15], true, true);
    //6
    xorCalculate(3, 5, false, nextbitsbin[2], currbitsbin[15], currbitsbin[0], true, true);
    //7
    xorCalculate(3, 6, false, nextbitsbin[3], currbitsbin[0], currbitsbin[1], true, true);
    //8
    xorCalculate(3, 7, false, nextbitsbin[4], currbitsbin[1], currbitsbin[2], true, true);
    //9 - 13
    for (i = 0; i < 5; i++) {
        nextbitsint[i + 8] = currbitsint[i + 3];
    }
    //14
    xorCalculate(3, 13, true, currbitsbin[6], currbitsbin[7], currbitsbin[8], true, true);
    //15
    xorCalculate(3, 14, false, currbitsbin[6], currbitsbin[8], currbitsbin[9], true, true);
    //16
    xorCalculate(3, 15, false, currbitsbin[7], currbitsbin[9], currbitsbin[10], true, true);

    var completeBinary = "";

    for (i = 0; i < 16; i++) {
        completeBinary = completeBinary + nextbitsint[i];
    }

    var b = parseInt(completeBinary, 2);
    var inithex = toHexString(b);

    zeroes = "";
    for (i = inithex.length; i < 4; i++) {
        zeroes = zeroes + "0";
    }

    var hex = zeroes + inithex;
    hex = hex.toUpperCase();
    return hex;
}

function hexToStarDirection(x) {
    x = hexToDecimal(x);

    if (isBetween(x, 0, 31))
        return 1;
    else if (isBetween(x, 32, 63))
        return 2;
    else if (isBetween(x, 64, 95))
        return 3;
    else if (isBetween(x, 96, 127))
        return 4;
    else if (isBetween(x, 128, 159))
        return 5;
    else if (isBetween(x, 160, 191))
        return 6;
    else if (isBetween(x, 192, 223))
        return 7;
    else if (isBetween(x, 224, 255))
        return 8;
    else
        return 0;
}


function calcCountFromStars(star1, star2, star3, star4, star5, star6) {
    var hex = startRNG;
    let star = [star1, star2, star3, star4, star5, star6];
    let countList = [];
    let hexList = [];
    let amount = arguments.length;
    var count = 0;
    hits = 0;
    let rngWindow = Array(11).fill(0);
    let checkStar = Array(amount).fill(false);

    for (var i = 0; i < amount; i++) {
        if (star[i] != 0)
            checkStar[i] = true;
    }

    while (count < maxCount) {
        count++;
        let doMatch = Array(amount).fill(false);
        
        hex = nextHexRNG(hex);
        var num1 = hex.slice(0, 2);

        rngWindow.unshift(hexToStarDirection(num1));
        rngWindow.pop();



        /*
        for (var i = 0; i <= 9; i++) {
            rngWindow[i + 1] = rngWindow[i];
        } 
        rngWindow[9] = hexToStarDirection(num1);
        */

        for (var i = 0; i < amount; i++) {
            if ((checkStar[i] == false) || (rngWindow[i * 2] == star[i])) {
                doMatch[i] = true;
            }
        }

        if (allAreTrue(doMatch)) {
            countList.push(count);
            hexList.push(hex);
            hits++;
            console.log("hit");
        }
    }
    return [hexList, countList];
}

