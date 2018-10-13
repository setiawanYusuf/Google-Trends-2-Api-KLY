 //ARRAY
exports.create2DArray = function (numRows, numColumns) {
    let array = new Array(numRows);

    for (let i = 0; i < numColumns; i++) {
        array[i] = new Array(numColumns);
    }

    return array;
}