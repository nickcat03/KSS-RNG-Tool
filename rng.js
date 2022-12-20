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
const threeBin = "00000011";
const eightBin = "00001000";

//Basic number calc functions
function hexToDecimal(hex) {
    returnhex = parseInt(hex, 16);
    return returnhex;
}

function twoHexToDecimal(hex) {
    hex1 = hex.slice(0, 2);
    hex2 = hex.slice(2);

    dec1 = hexToDecimal(hex1);
    dec2 = hexToDecimal(hex2);

    return [dec1, dec2];
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

function convertToString (number) {
    if (typeof number === 'string' || number instanceof String) {
        return parseInt(number);
    }
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
    var output = startRNG;
    for (var i = 0; i < count; i++) {
        output = nextHexRNG(output);
    }
    return output;
}

function countToDecimal(count) {
    return twoHexToDecimal(countToHex(count));
}

function advanceRNG (hex, amount) {
    var output = hex;
    for (var i = 0; i < amount; i++) {
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


function compareSixNumbers(num1, num2, num3, num4, num5, num6, funct, multiplier) {
    var hex = startRNG;
    let num = [num6, num5, num4, num3, num2, num1];
    let countList = [];
    let hexList = [];
    let amount = 6;
    var count = 0;
    hits = 0;
    let rngWindow = Array(12).fill(0);
    let checkNum = Array(6).fill(false);
    let tempHexList = Array(12).fill(0);
    let hasValues = false;

    console.log(num);

    for (var i = 0; i < 6; i++) {
        if (num[i].length != 0) {
            checkNum[i] = true;
        }
    }

    for (var i = 0; i < 6; i++) {
        if (checkNum[i] == true){
            hasValues = true;
            break;
        } else {
            amount = (6 - (i + 1));
        }
    }

    if (!hasValues)
        return;
    
    while (count < maxCount) {
        count++;
        let doMatch = Array(6).fill(false);
        
        hex = nextHexRNG(hex);
        tempHexList.unshift(hex);
        tempHexList.pop();

        var num1 = hex.slice(0, 2);

        rngWindow.unshift(funct(num1));
        rngWindow.pop();

        for (var i = 0; i < 6; i++) {
            if ((checkNum[i] == false) || (rngWindow[i * multiplier] == num[i])) {
                doMatch[i] = true;
            }
        }

        if (allAreTrue(doMatch) && (count > (6 - amount))) {
            countList.push(count - ((6 - amount) * multiplier));
            hexList.push(tempHexList[((6 - amount) * multiplier)]);
            hits++;
        }
    }
    return [hexList, countList, amount];
}


function willWhaleBall(count) {
    count = convertToString(count);

    var rng2HexFull = countToHex(count + 2);
    var rng5HexFull = countToHex(count + 5);
    var rng2Dec = hexToDecimal(rng2HexFull.slice(0, 2));
    var rng5Dec = hexToDecimal(rng5HexFull.slice(0, 2));

    var addThisDec = rng2Dec & 8;
    var newDec = rng5Dec & 3;
    var finalDec = (newDec * 2) + addThisDec;

    if ((finalDec == 0) || (finalDec == 4) || (finalDec == 6) || (finalDec == 12)) {
        return true;
    } else {
        return false;
    }
}


//Battle Windows

function battleWindowsAttackFirst(count, enemy) {

    //Enemy List:
    //0 : Slime, Magician
    //1 : Puppet, Dark Knight
    //2 : Red Dragon

    let startHex = countToHex(count);
    let attacksFirstNumber = advanceRngAndSlice(startHex, 1);

    switch (enemy) {
        case 0:
            var low = 64,
            high = 127;
            break;
        case 1:
            var low = 128,
            high = 191;
            break;
        case 2:
            var low = 192,
            high = 255;
            break;
    }
    if (isBetween(attacksFirstNumber, low, high)) {
        return true;
    }
    else {
        return false;
    }
}

function battleWindowsPowers(count, firstTurn) {
    var firstTurnModifier = 0;

    if (firstTurn) {
        firstTurnModifier = 1;
    }

    count = convertToString(count);
    let rightPowerAppearance = false;
    let leftPowerAppearance = false;
    var leftPowerModifier = 0;

    var startHex = countToHex(count);

    //find if right powerup shows up
    let rightPowerAppearanceNumber = advanceRngAndSlice(startHex, 1 + firstTurnModifier);
    if (isBetween(rightPowerAppearanceNumber, 64, 127)) {
        rightPowerAppearance = true;
        leftPowerModifier = 3;
    }

    //find if left powerup shows up
    let leftPowerAppearanceNumber = advanceRngAndSlice(startHex, 1 + firstTurnModifier + leftPowerModifier);
    if (isBetween(leftPowerAppearanceNumber, 128, 191))
        leftPowerAppearance = true;

    //calculate right side
    if (rightPowerAppearance == true) {
        rightPower = determinePowerType(startHex, firstTurnModifier);
    }
    else {
        rightPower = "None";
    }

    //calculate left side
    if (leftPowerAppearance == true) {
        leftPower = determinePowerType(startHex, firstTurnModifier + leftPowerModifier);
    }
    else {
        leftPower = "None";
    }

    //calculate ending RNG
    if ((rightPowerAppearance == true) && (leftPowerAppearance == true)) {
        var finalRNG = hexToDecimal(advanceRNG(startHex, 5));
    }
    else if ((rightPowerAppearance == true || leftPowerAppearance == true)) {
        var finalRNG = hexToDecimal(advanceRNG(startHex, 3));
    }
    else {
        var finalRNG = hexToDecimal(advanceRNG(startHex, 1));
    }
    return [leftPower, rightPower];
}

function determinePowerType (startHex, modifier) {
    determinePowerPool = advanceRngAndSlice(startHex, 2 + modifier);
    powerNumber = advanceRngAndSlice(startHex, 3 + modifier);
    return battleWindowsPowerSelect(determinePowerPool, powerNumber);
}

function battleWindowsPowerSelect(determinePowerPool, powerNumber) {
    //Note that this is still inaccurate. Needs to be determined
    if (isBetween(determinePowerPool, 0, 63) || isBetween(determinePowerPool, 128, 191)) {   //pool 1
        if (isBetween(powerNumber, 0, 21))
            return "Fighter";
        else if (isBetween(powerNumber, 22, 42))
            return "Plasma";
        else if (isBetween(powerNumber, 43, 63))
            return "Hammer";
        else if (isBetween(powerNumber, 64, 85))
            return "Beam";
        else if (isBetween(powerNumber, 86, 106))
            return "Bomb";
        else if (isBetween(powerNumber, 107, 127))
            return "Sword";
        else if (isBetween(powerNumber, 128, 148))
            return "Hammer";
        else if (isBetween(powerNumber, 149, 170))
            return "Bomb";
        else if (isBetween(powerNumber, 171, 191))
            return "Plasma";
        else if (isBetween(powerNumber, 192, 212))
            return "Sword";
        else if (isBetween(powerNumber, 213, 233))
            return "Beam";
        else if (isBetween(powerNumber, 234, 255))
            return "Fighter";
    } else {    //pool 2
        if (isBetween(powerNumber, 0, 21))
            return "Stone";
        else if (isBetween(powerNumber, 22, 42))
            return "Cutter";
        else if (isBetween(powerNumber, 43, 63))
            return "Wheel";
        else if (isBetween(powerNumber, 64, 85))
            return "Jet";
        else if (isBetween(powerNumber, 86, 106))
            return "Ice";
        else if (isBetween(powerNumber, 107, 127))
            return "Parasol";
        else if (isBetween(powerNumber, 128, 148))
            return "Fire";
        else if (isBetween(powerNumber, 149, 170))
            return "Suplex";
        else if (isBetween(powerNumber, 171, 191))
            return "Ninja";
        else if (isBetween(powerNumber, 192, 212))
            return "Yo-yo";
        else if (isBetween(powerNumber, 213, 233))
            return "Mirror";
        else if (isBetween(powerNumber, 234, 255))
            return "Wing";
    }
}

function advanceRngAndSlice(hex, number) {
    return hexToDecimal((advanceRNG(hex, (number))).slice(0, 2));
}



