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

// Function to generate the chess board dynamically
function generateBoard() {
    // Clear the existing board
    document.getElementById("board").innerHTML = "";

    // Loop through rows (from 8 to 1)
    for (let i = 8; i > 0; i--) {
        // Loop through columns (from a to h)
        for (let j = 0; j < 8; j++) {
            // Calculate the ASCII code for the current column character
            let charCode = 97 + j;
            // Convert the ASCII code to the corresponding character
            charCode = String.fromCharCode(charCode);

            // Create a new tile element
            let tile = document.createElement('div');
            tile.className = "tile";
            tile.innerHTML = "";

            let is_white = false;
            let is_black = false;

            // Check if the tile should be white or black based on its position
            if ((i + j) % 2 === 0) {
                tile.style.backgroundColor = "green";
            } else {
                tile.style.backgroundColor = "beige";
            }

            // Check if there is a white piece at the current position
            for (let key in white_pieces) {
                if (white_pieces[key] === charCode + i) {
                    let cutkey = key.slice(0, -1);
                    
                    // Create a new piece element for the white piece
                    let piece = document.createElement('div');
                    piece.className = "piece";
                    piece.style.backgroundImage = 'url("../img/pieces/' + cutkey + '_w.png")'

                    // Add click event listener for selecting the piece if it's white's turn
                    if (turn === "white") {
                        piece.addEventListener('click', function() {
                            piece.style.filter = "brightness(150%)";
                            selectPiece(charCode + i, "white");
                        });
                    } else if (turn === "black")  {
                        // Add click event listener for moving the piece if it's black's turn
                        piece.addEventListener('click', function() {
                            moveTo(charCode + i, "white");
                        });
                    }

                    tile.appendChild(piece);
                    is_white = true;
                    break;
                }
            }

            // Check if there is a black piece at the current position
            for (let key in black_pieces) {
                if (black_pieces[key] === charCode + i) {
                    let cutkey = key.slice(0, -1);
                    
                    // Create a new piece element for the black piece
                    let piece = document.createElement('div');
                    piece.className = "piece";
                    piece.style.backgroundImage = 'url("../img/pieces/' + cutkey + '_b.png")'

                    // Add click event listener for selecting the piece if it's black's turn
                    if (turn === "black") {
                        piece.addEventListener('click', function() {
                            selectPiece(charCode + i, "black");
                        });
                    } else if (turn === "white") {
                        // Add click event listener for moving the piece if it's white's turn
                        piece.addEventListener('click', function() {
                            moveTo(charCode + i, "black");
                        });
                    }

                    tile.appendChild(piece);
                    is_black = true;
                    break;
                }
            }

            // If there is no piece on the current tile, and a piece is selected
            // add click event listener for moving the selected piece
            if (!is_white && !is_black) {
                if (selected_piece !== "") {
                    tile.addEventListener('click', function() {
                        moveTo(charCode + i, "");
                    });
                }
            }

            // Add row indicator (numbers) for the last row
            if (j === 0) {
                let row_indicator = document.createElement('div');
                row_indicator.className = "row_indicator"
                row_indicator.innerText = i;
                
                tile.appendChild(row_indicator);
            }

            // Add column indicator (letters) for the bottom row
            if (i === 1) {
                let column_indicator = document.createElement('div');
                column_indicator.className = "column_indicator";
                column_indicator.innerHTML = charCode;

                tile.appendChild(column_indicator);
            }

            // Highlight the tile if it matches the selected piece location
            if (selected_piece_loc === charCode + i) {
                tile.style.backgroundColor = "yellow";
            }

            // Append the tile to the board
            document.getElementById('board').appendChild(tile);
        }
    }
}

// Function to select a chess piece and update the board
function selectPiece(selection, color) {
    // Check if the selected piece belongs to white
    if (color === "white") {
        // Loop through white pieces to find the selected piece
        for (let key in white_pieces) {
            if (white_pieces[key] === selection) {
                // Update the selected piece location and piece key
                selected_piece_loc = selection;
                selected_piece = key;
                break; // Stop searching once the piece is found
            } 
        }
    }
    // If the selected piece belongs to black
    else {
        // Loop through black pieces to find the selected piece
        for (let key in black_pieces) {
            if (black_pieces[key] === selection) {
                // Update the selected piece location and piece key
                selected_piece_loc = selection;
                selected_piece = key;
                break; // Stop searching once the piece is found
            } 
        }
    }

    // Update the selected color
    selected_color = color;

    // Regenerate the board to reflect the selection
    generateBoard();
}

// Function to move a selected chess piece to a new position
function moveTo(selection, color) {
    // Variable to store the piece key to move to
    let piece_to_move_to;

    // Check if the selected color is different from the current color and if the move is valid
    if (selected_color !== color && checkMove(selection, color) === true) {
        // If the color of the piece to move is white
        if (color === "white") {
            // Loop through white pieces to find the selected position
            for (let key in white_pieces) {
                if (white_pieces[key] === selection) {
                    piece_to_move_to = key;
                    break; // Stop searching once the position is found
                }
            }
        } 
        // If the color of the piece to move is black
        else if (color === "black") {
            // Loop through black pieces to find the selected position
            for (let key in black_pieces) {
                if (black_pieces[key] === selection) {
                    piece_to_move_to = key;
                    break; // Stop searching once the position is found
                }
            }
        } 
        // If no piece is found at the selected position
        else {
            piece_to_move_to = selection;
        }

        // Move the piece to the new position based on the selected color
        if (selected_color === "white" && color !== "white") {
            if (color === "black") {
                // Remove the black piece at the new position and update white piece's position
                black_pieces[piece_to_move_to] = "x";
                white_pieces[selected_piece] = selection;
            } 
            else {
                // Update white piece's position
                white_pieces[selected_piece] = piece_to_move_to;
            }
        } 
        else if (selected_color === "black" && color !== "black") {
            if (color === "white") {
                // Remove the white piece at the new position and update black piece's position
                white_pieces[piece_to_move_to] = "x";
                black_pieces[selected_piece] = selection;
            } 
            else {
                // Update black piece's position
                black_pieces[selected_piece] = piece_to_move_to;
            }
        }

        // Play move audio and change turn
        move_audio.play();
        changeTurn();
    }
    
    // Reset selected_piece, piece_to_move, and selected_piece_loc
    selected_piece = "";
    piece_to_move = "";
    selected_piece_loc = "";

    // Regenerate the board to reflect the move
    generateBoard();
}

// Function to check if a move is legal
function checkMove(selection, color, kingMovementCheck) {
    // Variable to track if the move is legal
    let isLegal = false;

    // Get the type of the selected piece
    let piece = selected_piece.slice(0, -1);

    // Convert selection and selected_piece_loc into arrays for easier manipulation
    let position_array = selection.split("");
    position_array[1] = parseInt(position_array[1]); // Convert row number to integer
    let selected_loc_array = selected_piece_loc.split("");
    selected_loc_array[1] = parseInt(selected_loc_array[1]); // Convert row number to integer

    // Switch statement to handle different piece types
    switch (piece) {
        // Case for pawn pieces
        case "pawn":
            // If the selected piece is white
            if (selected_color === "white") {
                // If the pawn is moving straight ahead (no capture)
                if (position_array[0] === selected_loc_array[0]) {
                    // If moving one square forward
                    if (position_array[1] == selected_loc_array[1] + 1 && color === "") {
                        isLegal = true;
                    } 
                    // If moving two squares forward from the starting position
                    else if (position_array[1] == selected_loc_array[1] + 2 && selected_loc_array[1] === 2 && color === "") {
                        // Check if there are any pieces blocking the path
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
                // If the pawn is capturing diagonally
                else if (position_array[0].charCodeAt(0) === selected_loc_array[0].charCodeAt(0) + 1 || position_array[0].charCodeAt(0) === selected_loc_array[0].charCodeAt(0) - 1) {
                    // Check if there's a black piece to capture
                    if (color === "black" && selected_loc_array[1] + 1 === position_array[1]) {
                        isLegal = true;
                    }
                }
            } 
            // If the selected piece is black
            else {
                // If the pawn is moving straight ahead (no capture)
                if (position_array[0] === selected_loc_array[0]) {
                    // If moving one square forward
                    if (position_array[1] == selected_loc_array[1] - 1 && color === "") {
                        isLegal = true;
                    } 
                    // If moving two squares forward from the starting position
                    else if (position_array[1] == selected_loc_array[1] - 2 && selected_loc_array[1] === 7 && color === "") {
                        // Check if there are any pieces blocking the path
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
                // If the pawn is capturing diagonally
                else if (position_array[0].charCodeAt(0) === selected_loc_array[0].charCodeAt(0) + 1 || position_array[0].charCodeAt(0) === selected_loc_array[0].charCodeAt(0) - 1) {
                    // Check if there's a white piece to capture
                    if (color === "white" && selected_loc_array[1] - 1 === position_array[1]) {
                        isLegal = true;
                    }
                }
            }
            break;

        // Case for knight pieces
        case "knight":
            // If the selected piece is white
            if (selected_color === "white") {
                // If the knight is moving in an L-shape (two squares in one direction and one square in the perpendicular direction)
                if (selected_loc_array[0].charCodeAt(0) + 1 === position_array[0].charCodeAt(0) || selected_loc_array[0].charCodeAt(0) - 1 === position_array[0].charCodeAt(0)) {
                    if (selected_loc_array[1] + 2 === position_array[1] || selected_loc_array[1] - 2 === position_array[1]) {
                        // Check if the destination is empty or contains an opponent's piece
                        if (color === "black" || color === "") {
                            isLegal = true;
                        }
                    }
                }
                // If the knight is moving in an L-shape (one square in one direction and two squares in the perpendicular direction)
                else if (selected_loc_array[0].charCodeAt(0) + 2 === position_array[0].charCodeAt(0) || selected_loc_array[0].charCodeAt(0) - 2 === position_array[0].charCodeAt(0)) {
                    if (selected_loc_array[1] + 1 === position_array[1] || selected_loc_array[1] - 1 === position_array[1]) {
                        // Check if the destination is empty or contains an opponent's piece
                        if (color === "black" || color === "") {
                            isLegal = true;
                        }
                    }
                }
            }
            // If the selected piece is black
            else if (selected_color === "black") {
                // If the knight is moving in an L-shape (two squares in one direction and one square in the perpendicular direction)
                if (selected_loc_array[0].charCodeAt(0) + 1 === position_array[0].charCodeAt(0) || selected_loc_array[0].charCodeAt(0) - 1 === position_array[0].charCodeAt(0)) {
                    if (selected_loc_array[1] + 2 === position_array[1] || selected_loc_array[1] - 2 === position_array[1]) {
                        // Check if the destination is empty or contains an opponent's piece
                        if (color === "white" || color === "") {
                            isLegal = true;
                        }
                    }
                }
                // If the knight is moving in an L-shape (one square in one direction and two squares in the perpendicular direction)
                else if (selected_loc_array[0].charCodeAt(0) + 2 === position_array[0].charCodeAt(0) || selected_loc_array[0].charCodeAt(0) - 2 === position_array[0].charCodeAt(0)) {
                    if (selected_loc_array[1] + 1 === position_array[1] || selected_loc_array[1] - 1 === position_array[1]) {
                        // Check if the destination is empty or contains an opponent's piece
                        if (color === "white" || color === "") {
                            isLegal = true;
                        }
                    }
                }
            }
            break;

        // Case for rook pieces
        case "rook":
            // If the selected piece is white
            if (selected_color === "white") {
                // If the rook is moving vertically
                if (position_array[0] === selected_loc_array[0]) {
                    // If the rook is moving upwards
                    if (position_array[1] < selected_loc_array[1]) {
                        // Check for obstacles along the path
                        for (let i = selected_loc_array[1]; i >= position_array[1]; i--) {
                            isBlocked = false;
                            // Check for black pieces blocking the path
                            for (let key in black_pieces) {
                                if (black_pieces[key] === selected_loc_array[0] + i && i !== position_array[1]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                                // Check for white pieces blocking the path
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
                    // If the rook is moving downwards
                    else if (position_array[1] > selected_loc_array[1]) {
                        // Check for obstacles along the path
                        for (let i = selected_loc_array[1]; i <= position_array[1]; i++) {
                            isBlocked = false;
                            // Check for black pieces blocking the path
                            for (let key in black_pieces) {
                                if (black_pieces[key] === selected_loc_array[0] + i && i !== position_array[1]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                                // Check for white pieces blocking the path
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
                // If the rook is moving horizontally
                else if (position_array[1] === selected_loc_array[1]) {
                    // If the rook is moving leftwards
                    if (position_array[0].charCodeAt(0) < selected_loc_array[0].charCodeAt(0)) {
                        // Check for obstacles along the path
                        for (let i = selected_loc_array[0].charCodeAt(0); i >= position_array[0].charCodeAt(0); i--) {
                            isBlocked = false;
                            // Check for black pieces blocking the path
                            for (let key in black_pieces) {
                                if (black_pieces[key] === String.fromCharCode(i) + selected_loc_array[1] && String.fromCharCode(i) !== position_array[0]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                                // Check for white pieces blocking the path
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
                    // If the rook is moving rightwards
                    else if (position_array[0].charCodeAt(0) > selected_loc_array[0].charCodeAt(0)) {
                        // Check for obstacles along the path
                        for (let i = selected_loc_array[0].charCodeAt(0); i <= position_array[0].charCodeAt(0); i++) {
                            isBlocked = false;
                            // Check for black pieces blocking the path
                            for (let key in black_pieces) {
                                if (black_pieces[key] === String.fromCharCode(i) + selected_loc_array[1] && String.fromCharCode(i) !== position_array[0]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                                // Check for white pieces blocking the path
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

                // If the move is legal, mark the corresponding rook as moved
                if (isLegal) {
                    if (selected_piece === "rook1") {
                        white_rook_1_moved = true;
                    } else {
                        white_rook_2_moved = true;
                    }
                }
            }
            // If the selected piece is black
            else if (selected_color === "black") {
                // If the rook is moving vertically
                if (position_array[0] === selected_loc_array[0]) {
                    // If the rook is moving upwards
                    if (position_array[1] < selected_loc_array[1]) {
                        // Check for obstacles along the path
                        for (let i = selected_loc_array[1]; i >= position_array[1]; i--) {
                            isBlocked = false;
                            // Check for white pieces blocking the path
                            for (let key in white_pieces) {
                                if (white_pieces[key] === selected_loc_array[0] + i && i !== position_array[1]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                                // Check for black pieces blocking the path
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
                    // If the rook is moving downwards
                    else if (position_array[1] > selected_loc_array[1]) {
                        // Check for obstacles along the path
                        for (let i = selected_loc_array[1]; i <= position_array[1]; i++) {
                            isBlocked = false;
                            // Check for white pieces blocking the path
                            for (let key in white_pieces) {
                                if (white_pieces[key] === selected_loc_array[0] + i && i !== position_array[1]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                                // Check for black pieces blocking the path
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
                // If the rook is moving horizontally
                else if (position_array[1] === selected_loc_array[1]) {
                    // If the rook is moving leftwards
                    if (position_array[0].charCodeAt(0) < selected_loc_array[0].charCodeAt(0)) {
                        // Check for obstacles along the path
                        for (let i = selected_loc_array[0].charCodeAt(0); i >= position_array[0].charCodeAt(0); i--) {
                            isBlocked = false;
                            // Check for white pieces blocking the path
                            for (let key in white_pieces) {
                                if (white_pieces[key] === String.fromCharCode(i) + selected_loc_array[1] && String.fromCharCode(i) !== position_array[0]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                                // Check for black pieces blocking the path
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
                    // If the rook is moving rightwards
                    else if (position_array[0].charCodeAt(0) > selected_loc_array[0].charCodeAt(0)) {
                        // Check for obstacles along the path
                        for (let i = selected_loc_array[0].charCodeAt(0); i <= position_array[0].charCodeAt(0); i++) {
                            isBlocked = false;
                            // Check for white pieces blocking the path
                            for (let key in white_pieces) {
                                if (white_pieces[key] === String.fromCharCode(i) + selected_loc_array[1] && String.fromCharCode(i) !== position_array[0]) {
                                    isBlocked = true;
                                    break; // Exit the loop since we found a blocking piece
                                }
                                // Check for black pieces blocking the path
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

                // If the move is legal, mark the corresponding rook as moved
                if (isLegal) {
                    if (selected_piece === "rook1") {
                        black_rook_1_moved = true;
                    } else {
                        black_rook_2_moved = true;
                    }
                }
            }
            break;

        // Case for bishop pieces
        case "bishop":
            // If the selected piece is white
            if (selected_color === "white") {
                // If selected piece is lower than selected tile
                if (selected_loc_array[1] < position_array[1]) {
                    // If selected piece is more to the right than the selected tile
                    if (selected_loc_array[0].charCodeAt(0) > position_array[0].charCodeAt(0)) {
                        // Check diagonally upwards and leftwards
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
                    } 
                    // If selected piece is more to the left than the selected tile
                    else if (selected_loc_array[0].charCodeAt(0) < position_array[0].charCodeAt(0)) {
                        // Check diagonally upwards and rightwards
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
                } 
                // If selected piece is higher than selected tile
                else if (selected_loc_array[1] > position_array[1]) {
                    // If selected piece is more to the right than the selected tile
                    if (selected_loc_array[0].charCodeAt(0) > position_array[0].charCodeAt(0)) {
                        // Check diagonally downwards and leftwards
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
                    } 
                    // If selected piece is more to the left than the selected tile
                    else if (selected_loc_array[0].charCodeAt(0) < position_array[0].charCodeAt(0)) {
                        // Check diagonally downwards and rightwards
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
            // If the selected piece is black
            else if (selected_color === "black") {
                // If selected piece is lower than selected tile
                if (selected_loc_array[1] < position_array[1]) {
                    // If selected piece is more to the right than the selected tile
                    if (selected_loc_array[0].charCodeAt(0) > position_array[0].charCodeAt(0)) {
                        // Check diagonally upwards and leftwards
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
                    } 
                    // If selected piece is more to the left than the selected tile
                    else if (selected_loc_array[0].charCodeAt(0) < position_array[0].charCodeAt(0)) {
                        // Check diagonally upwards and rightwards
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
                } 
                // If selected piece is higher than selected tile
                else if (selected_loc_array[1] > position_array[1]) {
                    // If selected piece is more to the right than the selected tile
                    if (selected_loc_array[0].charCodeAt(0) > position_array[0].charCodeAt(0)) {
                        // Check diagonally downwards and leftwards
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
                    } 
                    // If selected piece is more to the left than the selected tile
                    else if (selected_loc_array[0].charCodeAt(0) < position_array[0].charCodeAt(0)) {
                        // Check diagonally downwards and rightwards
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

        // Bishop and rook combined
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

        // Case for king pieces
        case "king":
            // If the selected piece is white
            if (selected_color === "white") {
                // Calculate horizontal and vertical movement distance
                let canmovehorizontal = Math.abs(selected_loc_array[0].charCodeAt(0) - position_array[0].charCodeAt(0));
                let canmovevertical = Math.abs(selected_loc_array[1] - position_array[1]);

                // Check if the move is legal for king (one square in any direction)
                if ((canmovehorizontal === 1 || canmovehorizontal === 0) && (canmovevertical === 1 || canmovevertical === 0)) {
                    isLegal = true;

                    // If kingMovementCheck is false, check if the move puts the king in check
                    if (!kingMovementCheck) {
                        for (let key in black_pieces) {
                            isBlocked = false;
                            saved_piece_loc = selected_piece_loc;
                            selected_piece_loc = black_pieces[key];
                            saved_piece = selected_piece;
                            selected_piece = key;
                            saved_color = selected_color;
                            selected_color = "black";
                            
                            // Check if the move puts the king in check
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

                        // If the move doesn't put the king in check, it's legal
                        if (!isBlocked) {
                            isLegal = true;
                            white_king_moved = true;
                        }
                    }
                } 
                // If the king wants to perform castling
                else if (canmovevertical === 0 && canmovehorizontal === 2 && !white_king_moved) {
                    // If castling to the left (queenside)
                    if (position_array[0].charCodeAt(0) < selected_piece_loc[0].charCodeAt(0)) {
                        // Check if the squares between the king and rook are clear
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
                        // If the squares are clear and the rook hasn't moved, perform castling
                        if (!isBlocked && !white_rook_1_moved) {
                            isLegal = true;
                            white_king_moved = true;
                            white_pieces["rook1"] = "d1";
                        }
                    } 
                    // If castling to the right (kingside)
                    else {
                        // Check if the squares between the king and rook are clear
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
                        // If the squares are clear and the rook hasn't moved, perform castling
                        if (!isBlocked && !white_rook_2_moved) {
                            isLegal = true;
                            white_king_moved = true;
                            white_pieces["rook2"] = "f1";
                        }
                    }
                }
            } 
            // If the selected piece is black
            else if (selected_color === "black") {
                // Calculate horizontal and vertical movement distance
                let canmovehorizontal = Math.abs(selected_loc_array[0].charCodeAt(0) - position_array[0].charCodeAt(0));
                let canmovevertical = Math.abs(selected_loc_array[1] - position_array[1]);

                // Check if the move is legal for king (one square in any direction)
                if ((canmovehorizontal === 1 || canmovehorizontal === 0) && (canmovevertical === 1 || canmovevertical === 0)) {
                    isLegal = true;

                    // If kingMovementCheck is false, check if the move puts the king in check
                    if (!kingMovementCheck) {
                        for (let key in white_pieces) {
                            isBlocked = false;
                            saved_piece_loc = selected_piece_loc;
                            selected_piece_loc = white_pieces[key];
                            saved_piece = selected_piece;
                            selected_piece = key;
                            saved_color = selected_color;
                            selected_color = "white";
                            
                            // Check if the move puts the king in check
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

                        // If the move doesn't put the king in check, it's legal
                        if (!isBlocked) {
                            isLegal = true;
                            black_king_moved = true;
                        }
                    }
                } 
                // If the king wants to perform castling
                else if (canmovevertical === 0 && canmovehorizontal === 2 && !black_king_moved) {
                    // If castling to the left (queenside)
                    if (position_array[0].charCodeAt(0) < selected_piece_loc[0].charCodeAt(0)) {
                        // Check if the squares between the king and rook are clear
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
                        // If the squares are clear and the rook hasn't moved, perform castling
                        if (!isBlocked && !black_rook_1_moved) {
                            isLegal = true;
                            black_king_moved = true;
                            black_pieces["rook1"] = "d8";
                        }
                    } 
                    // If castling to the right (kingside)
                    else {
                        // Check if the squares between the king and rook are clear
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
                        // If the squares are clear and the rook hasn't moved, perform castling
                        if (!isBlocked && !black_rook_2_moved) {
                            isLegal = true;
                            black_king_moved = true;
                            black_pieces["rook2"] = "f8";
                        }
                    }
                }
            }
            break;

        default:
            break;
    }

    return isLegal;
}

function changeTurn() {
    // If the current turn is white, switch to black
    if (turn === "white") {
        turn = "black";
        // Update the turn indicator images to black king
        document.getElementById("turn_img1").src = "../img/pieces/king_b.png";
        document.getElementById("turn_img2").src = "../img/pieces/king_b.png";
        // Update the turn indicator text
        document.getElementById("turn_text").innerText = "Black to move";
    } 
    // If the current turn is black, switch to white
    else {
        turn = "white";
        // Update the turn indicator images to white king
        document.getElementById("turn_img1").src = "../img/pieces/king_w.png";
        document.getElementById("turn_img2").src = "../img/pieces/king_w.png";
        // Update the turn indicator text
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