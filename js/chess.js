let selected_piece = "";
let selected_color = "";
let selected_piece_loc = "";
let isBlocked = "";
let is_black = false;
let is_white = false;
let white_king_moved = false;
let black_king_moved = false;
let white_rook_1_moved = false;
let white_rook_2_moved = false;
let black_rook_1_moved = false;
let black_rook_2_moved = false;
let turn = "white";

move_audio = new Audio("../sound/move-piece.mp3");

function generateBoard() {
    document.getElementById("board").innerHTML = "";

    for (let i = 8; i > 0; i--) {
        for (let j = 0; j < 8; j++) {
            let charCode = 97 + j;
            charCode = String.fromCharCode(charCode);

            let tile = document.createElement('div');
            tile.className = "tile";
            tile.innerHTML = "";

            let is_white = false;
            let is_black = false;

            if ((i + j) % 2 === 0) {
                tile.style.backgroundColor = "green";
            } else {
                tile.style.backgroundColor = "beige";
            }

            for (let key in white_pieces) {
                if (white_pieces[key] === charCode + i) {
                    let cutkey = key.slice(0, -1);
                    
                    let piece = document.createElement('div');
                    piece.className = "piece";
                    piece.style.backgroundImage = 'url("../img/pieces/' + cutkey + '_w.png")'

                    if (selected_piece === "" && turn === "white") {
                        piece.addEventListener('click', function() {
                            piece.style.filter = "brightness(150%)";
                            selectPiece(charCode + i, "white");
                        });
                    } else if (turn === "black")  {
                        piece.addEventListener('click', function() {
                            moveTo(charCode + i, "white");
                        });
                    }

                    tile.appendChild(piece);
                    is_white = true;
                    break;
                }
            }

            for (let key in black_pieces) {
                if (black_pieces[key] === charCode + i) {
                    let cutkey = key.slice(0, -1);
                    
                    let piece = document.createElement('div');
                    piece.className = "piece";
                    piece.style.backgroundImage = 'url("../img/pieces/' + cutkey + '_b.png")'

                    if (selected_piece === "" && turn === "black") {
                        piece.addEventListener('click', function() {
                            selectPiece(charCode + i, "black");
                        });
                    } else if (turn === "white") {
                        piece.addEventListener('click', function() {
                            moveTo(charCode + i, "black");
                        });
                    }

                    tile.appendChild(piece);
                    is_black = true;
                    break;
                }
            }

            if (!is_white && !is_black) {
                if (selected_piece !== "") {
                    tile.addEventListener('click', function() {
                        moveTo(charCode + i, "");
                    });
                }
            }

            if (j === 0) {
                let row_indicator = document.createElement('div');
                row_indicator.className = "row_indicator"
                row_indicator.innerText = i;
                
                tile.appendChild(row_indicator);
            }

            if (i === 1) {
                let column_indicator = document.createElement('div');
                column_indicator.className = "column_indicator";
                column_indicator.innerHTML = charCode;

                tile.appendChild(column_indicator);
            }

            if (selected_piece_loc === charCode + i) {
                tile.style.backgroundColor = "yellow";
            }

            document.getElementById('board').appendChild(tile);
        }
    }
}

function selectPiece(selection, color) {
    if (color === "white") {
        for (let key in white_pieces) {
            if (white_pieces[key] === selection) {
                selected_piece_loc = selection;
                selected_piece = key;
                break;
            } 
        }
    }
    else {
        for (let key in black_pieces) {
            if (black_pieces[key] === selection) {
                selected_piece_loc = selection;
                selected_piece = key;
                break;
            } 
        }
    }

    selected_color = color;
    generateBoard();
}

function moveTo(selection, color) {
    let piece_to_move_to;
    if (selected_color !== color && checkMove(selection, color) === true) {
        if (color === "white") {
        for (let key in white_pieces) {
            if (white_pieces[key] === selection) {
                piece_to_move_to = key;
                break;
            }
        }
    } 
    else if (color === "black") {
        for (let key in black_pieces) {
            if (black_pieces[key] === selection) {
                piece_to_move_to = key;
                break;
            }
        }
    } 
    else {
        piece_to_move_to = selection;
    }

    if (selected_color === "white" && color !== "white") {
        if (color === "black") {
            black_pieces[piece_to_move_to] = "x";
            white_pieces[selected_piece] = selection;
        } 
        else {
            white_pieces[selected_piece] = piece_to_move_to;
        }
    } 
    else if (selected_color === "black" && color !== "black") {
        if (color === "white") {
            white_pieces[piece_to_move_to] = "x";
            black_pieces[selected_piece] = selection;
        } 
        else {
            black_pieces[selected_piece] = piece_to_move_to;
        }
    }
        move_audio.play();
        changeTurn();
    }
    
    selected_piece = "";
    piece_to_move = "";
    selected_piece_loc = "";

    generateBoard();
}

function checkMove(selection, color, kingMovementCheck) {
    let isLegal = false;

    let piece = selected_piece.slice(0, -1);
    let position_array = selection.split("");
    position_array[1] = parseInt(position_array[1]);
    let selected_loc_array = selected_piece_loc.split("");
    selected_loc_array[1] = parseInt(selected_loc_array[1]);

    switch (piece) {
        case "pawn":
            if (selected_color === "white") {
                if (position_array[0] === selected_loc_array[0]) {
                    if (position_array[1] == selected_loc_array[1] + 1 && color === "") {
                        isLegal = true;
                    } 
                    else if (position_array[1] == selected_loc_array[1] + 2 && selected_loc_array[1] === 2 && color === "") {
                        for (let key in black_pieces) {
                            if (black_pieces[key] === selected_loc_array[0] + (selected_loc_array[1] + 1)) {
                                isLegal = false;
                                break;
                            } else {
                                if (white_pieces[key] === selected_loc_array[0] + (selected_loc_array[1] + 1)) {
                                    isLegal = false;
                                    break;
                                } else {
                                    isLegal = true;
                                }
                            }
                        }
                    }
                }
                else if (position_array[0].charCodeAt(0) === selected_loc_array[0].charCodeAt(0) + 1 || position_array[0].charCodeAt(0) === selected_loc_array[0].charCodeAt(0) - 1) {
                    if (color === "black" && selected_loc_array[1] + 1 === position_array[1]) {
                        isLegal = true;
                    }
                }
            } 
            else {
                if (position_array[0] === selected_loc_array[0]) {
                    if (position_array[1] == selected_loc_array[1] - 1 && color === "") {
                        isLegal = true;
                    } 
                    else if (position_array[1] == selected_loc_array[1] - 2 && selected_loc_array[1] === 7 && color === "") {
                        for (let key in white_pieces) {
                            if (white_pieces[key] === selected_loc_array[0] + (selected_loc_array[1] - 1)) {
                                isLegal = false;
                                break;
                            } else {
                                if (black_pieces[key] === selected_loc_array[0] + (selected_loc_array[1] - 1)) {
                                    isLegal = false;
                                    break;
                                } else {
                                    isLegal = true;
                                }
                            }
                        }
                    }
                } 
                else if (position_array[0].charCodeAt(0) === selected_loc_array[0].charCodeAt(0) + 1 || position_array[0].charCodeAt(0) === selected_loc_array[0].charCodeAt(0) - 1) {
                    if (color === "white" && selected_loc_array[1] - 1 === position_array[1]) {
                        isLegal = true;
                    }
                }
            }
            break;

        case "knight":
            if (selected_color === "white") {
                if (selected_loc_array[0].charCodeAt(0) + 1 === position_array[0].charCodeAt(0) || selected_loc_array[0].charCodeAt(0) - 1 === position_array[0].charCodeAt(0)) {
                    if (selected_loc_array[1] + 2 === position_array[1] || selected_loc_array[1] - 2 === position_array[1]) {
                        if (color === "black" || color === "") {
                            isLegal = true;
                        }
                    }
                }
                else if (selected_loc_array[0].charCodeAt(0) + 2 === position_array[0].charCodeAt(0) || selected_loc_array[0].charCodeAt(0) - 2 === position_array[0].charCodeAt(0)) {
                    if (selected_loc_array[1] + 1 === position_array[1] || selected_loc_array[1] - 1 === position_array[1]) {
                        if (color === "black" || color === "") {
                            isLegal = true;
                        }
                    }
                }
            }
            else if (selected_color === "black") {
                if (selected_loc_array[0].charCodeAt(0) + 1 === position_array[0].charCodeAt(0) || selected_loc_array[0].charCodeAt(0) - 1 === position_array[0].charCodeAt(0)) {
                    if (selected_loc_array[1] + 2 === position_array[1] || selected_loc_array[1] - 2 === position_array[1]) {
                        if (color === "white" || color === "") {
                            isLegal = true;
                        }
                    }
                }
                else if (selected_loc_array[0].charCodeAt(0) + 2 === position_array[0].charCodeAt(0) || selected_loc_array[0].charCodeAt(0) - 2 === position_array[0].charCodeAt(0)) {
                    if (selected_loc_array[1] + 1 === position_array[1] || selected_loc_array[1] - 1 === position_array[1]) {
                        if (color === "white" || color === "") {
                            isLegal = true;
                        }
                    }
                }
            }
            break;

        case "rook":
            if (selected_color === "white") {
                if (position_array[0] === selected_loc_array[0]) {

                    if (position_array[1] < selected_loc_array[1]) {
                        for (let i = selected_loc_array[1]; i >= position_array[1]; i--) {
                            isBlocked = false;
                            for (let key in black_pieces) {
                                if (black_pieces[key] === selected_loc_array[0] + i && i !== position_array[1]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                                else if (white_pieces[key] === selected_loc_array[0] + i && i !== selected_loc_array[1]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                            }
                            if (isBlocked) {
                                break;
                            }
                        }
                        if (!isBlocked) {
                            isLegal = true;
                        }
                    }

                    else if (position_array[1] > selected_loc_array[1]) {
                        for (let i = selected_loc_array[1]; i <= position_array[1]; i++) {
                            isBlocked = false;
                            for (let key in black_pieces) {
                                if (black_pieces[key] === selected_loc_array[0] + i && i !== position_array[1]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                                else if (white_pieces[key] === selected_loc_array[0] + i && i !== selected_loc_array[1]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                            }
                            if (isBlocked) {
                                break;
                            }
                        }
                        if (!isBlocked) {
                            isLegal = true;
                        }
                    }
                }
                else if (position_array[1] === selected_loc_array[1]) {
                    if (position_array[0].charCodeAt(0) < selected_loc_array[0].charCodeAt(0)) {
                        for (let i = selected_loc_array[0].charCodeAt(0); i >= position_array[0].charCodeAt(0); i--) {
                            isBlocked = false;
                            for (let key in black_pieces) {
                                if (black_pieces[key] === String.fromCharCode(i) + selected_loc_array[1] && String.fromCharCode(i) !== position_array[0]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                                else if (white_pieces[key] === String.fromCharCode(i) + selected_loc_array[1] && String.fromCharCode(i) !== selected_loc_array[0]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                            }

                            if (isBlocked) {
                                break;
                            }
                        }
                        if (!isBlocked) {
                            isLegal = true;
                        }
                    }
                    else if (position_array[0].charCodeAt(0) > selected_loc_array[0].charCodeAt(0)) {
                        for (let i = selected_loc_array[0].charCodeAt(0); i <= position_array[0].charCodeAt(0); i++) {
                            isBlocked = false;
                            for (let key in black_pieces) {
                                if (black_pieces[key] === String.fromCharCode(i) + selected_loc_array[1] && String.fromCharCode(i) !== position_array[0]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                                else if (white_pieces[key] === String.fromCharCode(i) + selected_loc_array[1] && String.fromCharCode(i) !== selected_loc_array[0]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                            }

                            if (isBlocked) {
                                break;
                            }
                        }
                        if (!isBlocked) {
                            isLegal = true;
                        }
                    }
                }

                if (isLegal) {
                    if (selected_piece === "rook1") {
                        white_rook_1_moved = true;
                    } else {
                        white_rook_2_moved = true;
                    }
                }
            }
            else if (selected_color === "black") {
                if (position_array[0] === selected_loc_array[0]) {

                    if (position_array[1] < selected_loc_array[1]) {
                        for (let i = selected_loc_array[1]; i >= position_array[1]; i--) {
                            isBlocked = false;
                            for (let key in white_pieces) {
                                if (white_pieces[key] === selected_loc_array[0] + i && i !== position_array[1]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                                else if (black_pieces[key] === selected_loc_array[0] + i && i !== selected_loc_array[1]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                            }
                            if (isBlocked) {
                                break;
                            }
                        }
                        if (!isBlocked) {
                            isLegal = true;
                        }
                    }

                    else if (position_array[1] > selected_loc_array[1]) {
                        for (let i = selected_loc_array[1]; i <= position_array[1]; i++) {
                            isBlocked = false;
                            for (let key in white_pieces) {
                                if (white_pieces[key] === selected_loc_array[0] + i && i !== position_array[1]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                                else if (black_pieces[key] === selected_loc_array[0] + i && i !== selected_loc_array[1]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                            }
                            if (isBlocked) {
                                break;
                            }
                        }
                        if (!isBlocked) {
                            isLegal = true;
                        }
                    }
                }
                else if (position_array[1] === selected_loc_array[1]) {
                    if (position_array[0].charCodeAt(0) < selected_loc_array[0].charCodeAt(0)) {
                        for (let i = selected_loc_array[0].charCodeAt(0); i >= position_array[0].charCodeAt(0); i--) {
                            isBlocked = false;
                            for (let key in white_pieces) {
                                if (white_pieces[key] === String.fromCharCode(i) + selected_loc_array[1] && String.fromCharCode(i) !== position_array[0]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                                else if (black_pieces[key] === String.fromCharCode(i) + selected_loc_array[1] && String.fromCharCode(i) !== selected_loc_array[0]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                            }

                            if (isBlocked) {
                                break;
                            }
                        }
                        if (!isBlocked) {
                            isLegal = true;
                        }
                    }
                    else if (position_array[0].charCodeAt(0) > selected_loc_array[0].charCodeAt(0)) {
                        for (let i = selected_loc_array[0].charCodeAt(0); i <= position_array[0].charCodeAt(0); i++) {
                            isBlocked = false;
                            for (let key in white_pieces) {
                                if (white_pieces[key] === String.fromCharCode(i) + selected_loc_array[1] && String.fromCharCode(i) !== position_array[0]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                                else if (black_pieces[key] === String.fromCharCode(i) + selected_loc_array[1] && String.fromCharCode(i) !== selected_loc_array[0]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                            }

                            if (isBlocked) {
                                break;
                            }
                        }
                        if (!isBlocked) {
                            isLegal = true;
                        }
                    }
                }
                
                if (isLegal) {
                    if (selected_piece === "rook1") {
                        black_rook_1_moved = true;
                    } else {
                        black_rook_2_moved = true;
                    }
                }
            }
            break;

        case "bishop":
            if (selected_color === "white") {
                // If selected piece is lower than selected tile
                if (selected_loc_array[1] < position_array[1]) {
                    // if selected piece is more to the right than the selected tile
                    if (selected_loc_array[0].charCodeAt(0) > position_array[0].charCodeAt(0)) {
                        for (let i = 0; i <= 8; i++) {
                            isBlocked = false;
                            let checkRow = selected_loc_array[1] + i;
                            let checkColumn = String.fromCharCode(selected_loc_array[0].charCodeAt(0) - i);
                            for (let key in white_pieces) {
                                if (white_pieces[key] === checkColumn + checkRow && white_pieces[key] !== selected_piece_loc) {
                                    isBlocked = true;
                                    break;
                                } else if (black_pieces[key] === checkColumn + checkRow && black_pieces[key] !== selection) {
                                    isBlocked = true;
                                    break;
                                }
                            }

                            if (isBlocked === true) {
                                break;
                            }

                            if (selection === checkColumn + checkRow && !isBlocked) {
                                isLegal = true;
                                break;
                            }
                        }
                    } else if (selected_loc_array[0].charCodeAt(0) < position_array[0].charCodeAt(0)) {
                        for (let i = 0; i <= 8; i++) {
                            isBlocked = false;
                            let checkRow = selected_loc_array[1] + i;
                            let checkColumn = String.fromCharCode(selected_loc_array[0].charCodeAt(0) + i);
                            for (let key in white_pieces) {
                                if (white_pieces[key] === checkColumn + checkRow && white_pieces[key] !== selected_piece_loc) {
                                    isBlocked = true;
                                    break;
                                } else if (black_pieces[key] === checkColumn + checkRow && black_pieces[key] !== selection) {
                                    isBlocked = true;
                                    break;
                                }
                            }

                            if (isBlocked === true) {
                                break;
                            }

                            if (selection === checkColumn + checkRow && !isBlocked) {
                                isLegal = true;
                                break;
                            }
                        }
                    }
                } else if (selected_loc_array[1] > position_array[1]) {
                    if (selected_loc_array[0].charCodeAt(0) > position_array[0].charCodeAt(0)) {
                        for (let i = 0; i <= 8; i++) {
                            isBlocked = false;
                            let checkRow = selected_loc_array[1] - i;
                            let checkColumn = String.fromCharCode(selected_loc_array[0].charCodeAt(0) - i);
                            for (let key in white_pieces) {
                                if (white_pieces[key] === checkColumn + checkRow && white_pieces[key] !== selected_piece_loc) {
                                    isBlocked = true;
                                    break;
                                } else if (black_pieces[key] === checkColumn + checkRow && black_pieces[key] !== selection) {
                                    isBlocked = true;
                                    break;
                                }
                            }

                            if (isBlocked === true) {
                                break;
                            }

                            if (selection === checkColumn + checkRow && !isBlocked) {
                                isLegal = true;
                                break;
                            }
                        }
                    } else if (selected_loc_array[0].charCodeAt(0) < position_array[0].charCodeAt(0)) {
                        for (let i = 0; i <= 8; i++) {
                            isBlocked = false;
                            let checkRow = selected_loc_array[1] - i;
                            let checkColumn = String.fromCharCode(selected_loc_array[0].charCodeAt(0) + i);
                            for (let key in white_pieces) {
                                if (white_pieces[key] === checkColumn + checkRow && white_pieces[key] !== selected_piece_loc) {
                                    isBlocked = true;
                                    break;
                                } else if (black_pieces[key] === checkColumn + checkRow && black_pieces[key] !== selection) {
                                    isBlocked = true;
                                    break;
                                }
                            }

                            if (isBlocked === true) {
                                break;
                            }

                            if (selection === checkColumn + checkRow && !isBlocked) {
                                isLegal = true;
                                break;
                            }
                        }
                    }
                }
            }
            else if (selected_color === "black") {
                if (selected_loc_array[1] < position_array[1]) {
                    // if selected piece is more to the right than the selected tile
                    if (selected_loc_array[0].charCodeAt(0) > position_array[0].charCodeAt(0)) {
                        for (let i = 0; i <= 8; i++) {
                            isBlocked = false;
                            let checkRow = selected_loc_array[1] + i;
                            let checkColumn = String.fromCharCode(selected_loc_array[0].charCodeAt(0) - i);
                            for (let key in black_pieces) {
                                if (black_pieces[key] === checkColumn + checkRow && black_pieces[key] !== selected_piece_loc) {
                                    isBlocked = true;
                                    break;
                                } else if (white_pieces[key] === checkColumn + checkRow && white_pieces[key] !== selection) {
                                    isBlocked = true;
                                    break;
                                }
                            }

                            if (isBlocked === true) {
                                break;
                            }

                            if (selection === checkColumn + checkRow && !isBlocked) {
                                isLegal = true;
                                break;
                            }
                        }
                    } else if (selected_loc_array[0].charCodeAt(0) < position_array[0].charCodeAt(0)) {
                        for (let i = 0; i <= 8; i++) {
                            isBlocked = false;
                            let checkRow = selected_loc_array[1] + i;
                            let checkColumn = String.fromCharCode(selected_loc_array[0].charCodeAt(0) + i);
                            for (let key in black_pieces) {
                                if (black_pieces[key] === checkColumn + checkRow && black_pieces[key] !== selected_piece_loc) {
                                    isBlocked = true;
                                    break;
                                } else if (white_pieces[key] === checkColumn + checkRow && white_pieces[key] !== selection) {
                                    isBlocked = true;
                                    break;
                                }
                            }

                            if (isBlocked === true) {
                                break;
                            }

                            if (selection === checkColumn + checkRow && !isBlocked) {
                                isLegal = true;
                                break;
                            }
                        }
                    }
                } else if (selected_loc_array[1] > position_array[1]) {
                    if (selected_loc_array[0].charCodeAt(0) > position_array[0].charCodeAt(0)) {
                        for (let i = 0; i <= 8; i++) {
                            isBlocked = false;
                            let checkRow = selected_loc_array[1] - i;
                            let checkColumn = String.fromCharCode(selected_loc_array[0].charCodeAt(0) - i);
                            for (let key in black_pieces) {
                                if (black_pieces[key] === checkColumn + checkRow && black_pieces[key] !== selected_piece_loc) {
                                    isBlocked = true;
                                    break;
                                } else if (white_pieces[key] === checkColumn + checkRow && white_pieces[key] !== selection) {
                                    isBlocked = true;
                                    break;
                                }
                            }

                            if (isBlocked === true) {
                                break;
                            }

                            if (selection === checkColumn + checkRow && !isBlocked) {
                                isLegal = true;
                                break;
                            }
                        }
                    } else if (selected_loc_array[0].charCodeAt(0) < position_array[0].charCodeAt(0)) {
                        for (let i = 0; i <= 8; i++) {
                            isBlocked = false;
                            let checkRow = selected_loc_array[1] - i;
                            let checkColumn = String.fromCharCode(selected_loc_array[0].charCodeAt(0) + i);
                            for (let key in black_pieces) {
                                if (black_pieces[key] === checkColumn + checkRow && black_pieces[key] !== selected_piece_loc) {
                                    isBlocked = true;
                                    break;
                                } else if (white_pieces[key] === checkColumn + checkRow && white_pieces[key] !== selection) {
                                    isBlocked = true;
                                    break;
                                }
                            }

                            if (isBlocked === true) {
                                break;
                            }

                            if (selection === checkColumn + checkRow && !isBlocked) {
                                isLegal = true;
                                break;
                            }
                        }
                    }
                }
            }
            break;

        case "queen":
            if (selected_color === "white") {
                if (position_array[0] === selected_loc_array[0]) {

                    if (position_array[1] < selected_loc_array[1]) {
                        for (let i = selected_loc_array[1]; i >= position_array[1]; i--) {
                            isBlocked = false;
                            for (let key in black_pieces) {
                                if (black_pieces[key] === selected_loc_array[0] + i && i !== position_array[1]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                                else if (white_pieces[key] === selected_loc_array[0] + i && i !== selected_loc_array[1]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                            }
                            if (isBlocked) {
                                break;
                            }
                        }
                        if (!isBlocked) {
                            isLegal = true;
                        }
                    }

                    else if (position_array[1] > selected_loc_array[1]) {
                        for (let i = selected_loc_array[1]; i <= position_array[1]; i++) {
                            isBlocked = false;
                            for (let key in black_pieces) {
                                if (black_pieces[key] === selected_loc_array[0] + i && i !== position_array[1]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                                else if (white_pieces[key] === selected_loc_array[0] + i && i !== selected_loc_array[1]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                            }
                            if (isBlocked) {
                                break;
                            }
                        }
                        if (!isBlocked) {
                            isLegal = true;
                        }
                    }
                }
                else if (position_array[1] === selected_loc_array[1]) {
                    if (position_array[0].charCodeAt(0) < selected_loc_array[0].charCodeAt(0)) {
                        for (let i = selected_loc_array[0].charCodeAt(0); i >= position_array[0].charCodeAt(0); i--) {
                            isBlocked = false;
                            for (let key in black_pieces) {
                                if (black_pieces[key] === String.fromCharCode(i) + selected_loc_array[1] && String.fromCharCode(i) !== position_array[0]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                                else if (white_pieces[key] === String.fromCharCode(i) + selected_loc_array[1] && String.fromCharCode(i) !== selected_loc_array[0]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                            }

                            if (isBlocked) {
                                break;
                            }
                        }
                        if (!isBlocked) {
                            isLegal = true;
                        }
                    }
                    else if (position_array[0].charCodeAt(0) > selected_loc_array[0].charCodeAt(0)) {
                        for (let i = selected_loc_array[0].charCodeAt(0); i <= position_array[0].charCodeAt(0); i++) {
                            isBlocked = false;
                            for (let key in black_pieces) {
                                if (black_pieces[key] === String.fromCharCode(i) + selected_loc_array[1] && String.fromCharCode(i) !== position_array[0]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                                else if (white_pieces[key] === String.fromCharCode(i) + selected_loc_array[1] && String.fromCharCode(i) !== selected_loc_array[0]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                            }

                            if (isBlocked) {
                                break;
                            }
                        }
                        if (!isBlocked) {
                            isLegal = true;
                        }
                    }
                } else if (selected_loc_array[1] < position_array[1]) {
                    // if selected piece is more to the right than the selected tile
                    if (selected_loc_array[0].charCodeAt(0) > position_array[0].charCodeAt(0)) {
                        for (let i = 0; i <= 8; i++) {
                            isBlocked = false;
                            let checkRow = selected_loc_array[1] + i;
                            let checkColumn = String.fromCharCode(selected_loc_array[0].charCodeAt(0) - i);
                            for (let key in white_pieces) {
                                if (white_pieces[key] === checkColumn + checkRow && white_pieces[key] !== selected_piece_loc) {
                                    isBlocked = true;
                                    break;
                                } else if (black_pieces[key] === checkColumn + checkRow && black_pieces[key] !== selection) {
                                    isBlocked = true;
                                    break;
                                }
                            }

                            if (isBlocked === true) {
                                break;
                            }

                            if (selection === checkColumn + checkRow && !isBlocked) {
                                isLegal = true;
                                break;
                            }
                        }
                    } else if (selected_loc_array[0].charCodeAt(0) < position_array[0].charCodeAt(0)) {
                        for (let i = 0; i <= 8; i++) {
                            isBlocked = false;
                            let checkRow = selected_loc_array[1] + i;
                            let checkColumn = String.fromCharCode(selected_loc_array[0].charCodeAt(0) + i);
                            for (let key in white_pieces) {
                                if (white_pieces[key] === checkColumn + checkRow && white_pieces[key] !== selected_piece_loc) {
                                    isBlocked = true;
                                    break;
                                } else if (black_pieces[key] === checkColumn + checkRow && black_pieces[key] !== selection) {
                                    isBlocked = true;
                                    break;
                                }
                            }

                            if (isBlocked === true) {
                                break;
                            }

                            if (selection === checkColumn + checkRow && !isBlocked) {
                                isLegal = true;
                                break;
                            }
                        }
                    }
                } else if (selected_loc_array[1] > position_array[1]) {
                    if (selected_loc_array[0].charCodeAt(0) > position_array[0].charCodeAt(0)) {
                        for (let i = 0; i <= 8; i++) {
                            isBlocked = false;
                            let checkRow = selected_loc_array[1] - i;
                            let checkColumn = String.fromCharCode(selected_loc_array[0].charCodeAt(0) - i);
                            for (let key in white_pieces) {
                                if (white_pieces[key] === checkColumn + checkRow && white_pieces[key] !== selected_piece_loc) {
                                    isBlocked = true;
                                    break;
                                } else if (black_pieces[key] === checkColumn + checkRow && black_pieces[key] !== selection) {
                                    isBlocked = true;
                                    break;
                                }
                            }

                            if (isBlocked === true) {
                                break;
                            }

                            if (selection === checkColumn + checkRow && !isBlocked) {
                                isLegal = true;
                                break;
                            }
                        }
                    } else if (selected_loc_array[0].charCodeAt(0) < position_array[0].charCodeAt(0)) {
                        for (let i = 0; i <= 8; i++) {
                            isBlocked = false;
                            let checkRow = selected_loc_array[1] - i;
                            let checkColumn = String.fromCharCode(selected_loc_array[0].charCodeAt(0) + i);
                            for (let key in white_pieces) {
                                if (white_pieces[key] === checkColumn + checkRow && white_pieces[key] !== selected_piece_loc) {
                                    isBlocked = true;
                                    break;
                                } else if (black_pieces[key] === checkColumn + checkRow && black_pieces[key] !== selection) {
                                    isBlocked = true;
                                    break;
                                }
                            }

                            if (isBlocked === true) {
                                break;
                            }

                            if (selection === checkColumn + checkRow && !isBlocked) {
                                isLegal = true;
                                break;
                            }
                        }
                    }
                }
            }
            else if (selected_color === "black") {
                if (position_array[0] === selected_loc_array[0]) {

                    if (position_array[1] < selected_loc_array[1]) {
                        for (let i = selected_loc_array[1]; i >= position_array[1]; i--) {
                            isBlocked = false;
                            for (let key in white_pieces) {
                                if (white_pieces[key] === selected_loc_array[0] + i && i !== position_array[1]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                                else if (black_pieces[key] === selected_loc_array[0] + i && i !== selected_loc_array[1]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                            }
                            if (isBlocked) {
                                break;
                            }
                        }
                        if (!isBlocked) {
                            isLegal = true;
                        }
                    }

                    else if (position_array[1] > selected_loc_array[1]) {
                        for (let i = selected_loc_array[1]; i <= position_array[1]; i++) {
                            isBlocked = false;
                            for (let key in white_pieces) {
                                if (white_pieces[key] === selected_loc_array[0] + i && i !== position_array[1]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                                else if (black_pieces[key] === selected_loc_array[0] + i && i !== selected_loc_array[1]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                            }
                            if (isBlocked) {
                                break;
                            }
                        }
                        if (!isBlocked) {
                            isLegal = true;
                        }
                    }
                }
                else if (position_array[1] === selected_loc_array[1]) {
                    if (position_array[0].charCodeAt(0) < selected_loc_array[0].charCodeAt(0)) {
                        for (let i = selected_loc_array[0].charCodeAt(0); i >= position_array[0].charCodeAt(0); i--) {
                            isBlocked = false;
                            for (let key in white_pieces) {
                                if (white_pieces[key] === String.fromCharCode(i) + selected_loc_array[1] && String.fromCharCode(i) !== position_array[0]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                                else if (black_pieces[key] === String.fromCharCode(i) + selected_loc_array[1] && String.fromCharCode(i) !== selected_loc_array[0]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                            }

                            if (isBlocked) {
                                break;
                            }
                        }
                        if (!isBlocked) {
                            isLegal = true;
                        }
                    }
                    else if (position_array[0].charCodeAt(0) > selected_loc_array[0].charCodeAt(0)) {
                        for (let i = selected_loc_array[0].charCodeAt(0); i <= position_array[0].charCodeAt(0); i++) {
                            isBlocked = false;
                            for (let key in white_pieces) {
                                if (white_pieces[key] === String.fromCharCode(i) + selected_loc_array[1] && String.fromCharCode(i) !== position_array[0]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                                else if (black_pieces[key] === String.fromCharCode(i) + selected_loc_array[1] && String.fromCharCode(i) !== selected_loc_array[0]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                            }

                            if (isBlocked) {
                                break;
                            }
                        }
                        if (!isBlocked) {
                            isLegal = true;
                        }
                    }
                } else if (selected_loc_array[1] < position_array[1]) {
                    // if selected piece is more to the right than the selected tile
                    if (selected_loc_array[0].charCodeAt(0) > position_array[0].charCodeAt(0)) {
                        for (let i = 0; i <= 8; i++) {
                            isBlocked = false;
                            let checkRow = selected_loc_array[1] + i;
                            let checkColumn = String.fromCharCode(selected_loc_array[0].charCodeAt(0) - i);
                            for (let key in black_pieces) {
                                if (black_pieces[key] === checkColumn + checkRow && black_pieces[key] !== selected_piece_loc) {
                                    isBlocked = true;
                                    break;
                                } else if (white_pieces[key] === checkColumn + checkRow && white_pieces[key] !== selection) {
                                    isBlocked = true;
                                    break;
                                }
                            }

                            if (isBlocked === true) {
                                break;
                            }

                            if (selection === checkColumn + checkRow && !isBlocked) {
                                isLegal = true;
                                break;
                            }
                        }
                    } else if (selected_loc_array[0].charCodeAt(0) < position_array[0].charCodeAt(0)) {
                        for (let i = 0; i <= 8; i++) {
                            isBlocked = false;
                            let checkRow = selected_loc_array[1] + i;
                            let checkColumn = String.fromCharCode(selected_loc_array[0].charCodeAt(0) + i);
                            for (let key in black_pieces) {
                                if (black_pieces[key] === checkColumn + checkRow && black_pieces[key] !== selected_piece_loc) {
                                    isBlocked = true;
                                    break;
                                } else if (white_pieces[key] === checkColumn + checkRow && white_pieces[key] !== selection) {
                                    isBlocked = true;
                                    break;
                                }
                            }

                            if (isBlocked === true) {
                                break;
                            }

                            if (selection === checkColumn + checkRow && !isBlocked) {
                                isLegal = true;
                                break;
                            }
                        }
                    }
                } else if (selected_loc_array[1] > position_array[1]) {
                    if (selected_loc_array[0].charCodeAt(0) > position_array[0].charCodeAt(0)) {
                        for (let i = 0; i <= 8; i++) {
                            isBlocked = false;
                            let checkRow = selected_loc_array[1] - i;
                            let checkColumn = String.fromCharCode(selected_loc_array[0].charCodeAt(0) - i);
                            for (let key in black_pieces) {
                                if (black_pieces[key] === checkColumn + checkRow && black_pieces[key] !== selected_piece_loc) {
                                    isBlocked = true;
                                    break;
                                } else if (white_pieces[key] === checkColumn + checkRow && white_pieces[key] !== selection) {
                                    isBlocked = true;
                                    break;
                                }
                            }

                            if (isBlocked === true) {
                                break;
                            }

                            if (selection === checkColumn + checkRow && !isBlocked) {
                                isLegal = true;
                                break;
                            }
                        }
                    } else if (selected_loc_array[0].charCodeAt(0) < position_array[0].charCodeAt(0)) {
                        for (let i = 0; i <= 8; i++) {
                            isBlocked = false;
                            let checkRow = selected_loc_array[1] - i;
                            let checkColumn = String.fromCharCode(selected_loc_array[0].charCodeAt(0) + i);
                            for (let key in black_pieces) {
                                if (black_pieces[key] === checkColumn + checkRow && black_pieces[key] !== selected_piece_loc) {
                                    isBlocked = true;
                                    break;
                                } else if (white_pieces[key] === checkColumn + checkRow && white_pieces[key] !== selection) {
                                    isBlocked = true;
                                    break;
                                }
                            }

                            if (isBlocked === true) {
                                break;
                            }

                            if (selection === checkColumn + checkRow && !isBlocked) {
                                isLegal = true;
                                break;
                            }
                        }
                    }
                }
            }
            break;

        case "king":
            if (selected_color === "white") {
                let canmovehorizontal = Math.abs(selected_loc_array[0].charCodeAt(0) - position_array[0].charCodeAt(0));
                let canmovevertical = Math.abs(selected_loc_array[1] - position_array[1]);

                if ((canmovehorizontal === 1 || canmovehorizontal === 0) && (canmovevertical === 1 || canmovevertical === 0)) {
                    isLegal = true;

                    if (!kingMovementCheck) {
                        for (let key in black_pieces) {
                            isBlocked = false;
                            saved_piece_loc = selected_piece_loc;
                            selected_piece_loc = black_pieces[key];
                            saved_piece = selected_piece;
                            selected_piece = key;
                            saved_color = selected_color;
                            selected_color = "black";
                            
                            if (checkMove(selection, "white", true)) {
                                isBlocked = true;
                                isLegal = false;
                                break;
                            } else {
                                isLegal = true;
                                selected_piece_loc = saved_piece_loc;
                                selected_piece = saved_piece;
                                selected_color = saved_color;
                            }
                        }

                        if (!isBlocked) {
                            isLegal = true;
                            white_king_moved = true;
                        }
                    }
                }
                else if (canmovevertical === 0 && canmovehorizontal === 2 && !white_king_moved) {
                    if (position_array[0].charCodeAt(0) < selected_piece_loc[0].charCodeAt(0)) {
                        for (let key in black_pieces) {
                            isBlocked = false;
                            if (black_pieces[key] === "d1" || black_pieces[key] === "c1" || black_pieces[key] === "b1") {
                                isBlocked = true;
                                break;
                            } else if (white_pieces[key] === "d1" || white_pieces[key] === "c1" || white_pieces[key] === "b1") {
                                isBlocked = true;
                                break;
                            }
                        }
                        if (!isBlocked && !white_rook_1_moved) {
                            isLegal = true;
                            white_king_moved = true;
                            white_pieces["rook1"] = "d1";
                        }
                    } else {
                        for (let key in black_pieces) {
                            isBlocked = false;
                            if (black_pieces[key] === "f1" || black_pieces[key] === "g1") {
                                isBlocked = true;
                                break;
                            } else if (white_pieces[key] === "f1" || white_pieces[key] === "g1") {
                                isBlocked = true;
                                break;
                            }
                        }
                        if (!isBlocked && !white_rook_2_moved) {
                            isLegal = true;
                            white_king_moved = true;
                            white_pieces["rook2"] = "f1";
                        }
                    }
                }

            } else if (selected_color === "black") {
                let canmovehorizontal = Math.abs(selected_loc_array[0].charCodeAt(0) - position_array[0].charCodeAt(0));
                let canmovevertical = Math.abs(selected_loc_array[1] - position_array[1]);

                if ((canmovehorizontal === 1 || canmovehorizontal === 0) && (canmovevertical === 1 || canmovevertical === 0)) {
                    isLegal = true;

                    if (!kingMovementCheck) {
                        for (let key in white_pieces) {
                            isBlocked = false;
                            saved_piece_loc = selected_piece_loc;
                            selected_piece_loc = white_pieces[key];
                            saved_piece = selected_piece;
                            selected_piece = key;
                            saved_color = selected_color;
                            selected_color = "white";
                            
                            if (checkMove(selection, "black", true)) {
                                isBlocked = true;
                                isLegal = false;
                                break;
                            } else {
                                isLegal = true;
                                selected_piece_loc = saved_piece_loc;
                                selected_piece = saved_piece;
                                selected_color = saved_color;
                            }
                        }

                        if (!isBlocked) {
                            isLegal = true;
                            black_king_moved = true;
                        }
                    }
                }
                else if (canmovevertical === 0 && canmovehorizontal === 2 && !black_king_moved) {
                    if (position_array[0].charCodeAt(0) < selected_piece_loc[0].charCodeAt(0)) {
                        for (let key in white_pieces) {
                            isBlocked = false;
                            if (white_pieces[key] === "d8" || white_pieces[key] === "c8" || white_pieces[key] === "b8") {
                                isBlocked = true;
                                break;
                            } else if (black_pieces[key] === "d8" || black_pieces[key] === "c8" || black_pieces[key] === "b8") {
                                isBlocked = true;
                                break;
                            }
                        }
                        if (!isBlocked && !black_rook_1_moved) {
                            isLegal = true;
                            black_king_moved = true;
                            black_pieces["rook1"] = "d8";
                        }
                    } else {
                        for (let key in white_pieces) {
                            isBlocked = false;
                            if (white_pieces[key] === "f8" || white_pieces[key] === "g8") {
                                isBlocked = true;
                                break;
                            } else if (black_pieces[key] === "f8" || black_pieces[key] === "g8") {
                                isBlocked = true;
                                break;
                            }
                        }
                        if (!isBlocked && !black_rook_2_moved) {
                            isLegal = true;
                            black_king_moved = true;
                            black_pieces["rook2"] = "f8";
                        }
                    }
                }
            }

        default:
            break;
    }

    return isLegal;
}

function changeTurn() {
    if (turn === "white") {
        turn = "black";
        document.getElementById("turn_img1").src = "../img/pieces/king_b.png";
        document.getElementById("turn_img2").src = "../img/pieces/king_b.png";
        document.getElementById("turn_text").innerText = "Black to move";
    } else {
        turn = "white";
        document.getElementById("turn_img1").src = "../img/pieces/king_w.png";
        document.getElementById("turn_img2").src = "../img/pieces/king_w.png";
        document.getElementById("turn_text").innerText = "White to move";
    }
}

let white_pieces = {
    pawn1: "a2",
    pawn2: "b2",
    pawn3: "c2",
    pawn4: "d2",
    pawn5: "e2",
    pawn6: "f2",
    pawn7: "g2",
    pawn8: "h2",
    rook1: "a1",
    rook2: "h1",
    knight1: "b1",
    knight2: "g1",
    bishop1: "c1",
    bishop2: "f1",
    queen1: "d1",
    king1: "e1"
};

let black_pieces = {
    pawn1: "a7",
    pawn2: "b7",
    pawn3: "c7",
    pawn4: "d7",
    pawn5: "e7",
    pawn6: "f7",
    pawn7: "g7",
    pawn8: "h7",
    rook1: "a8",
    rook2: "h8",
    knight1: "b8",
    knight2: "g8",
    bishop1: "c8",
    bishop2: "f8",
    queen1: "d8",
    king1: "e8"
};

generateBoard();