addEventListener("DOMContentLoaded", function() {
    const gameBoard = document.getElementById("game-board");
    const gamePieces = document.querySelectorAll('#game-pieces div')
    
    const puzzPieces = gameBoard.querySelectorAll("div");
    const welcomePuzz = document.getElementById("game-board").dataset.puzzle;

    function populate_board(sentence) {
        const letters = sentence.split("");
        //populate with letters for puzzle sentence
        puzzPieces.forEach((piece, index) => {
            
            const h4 = piece.querySelector('h4');
            if (h4) {
                h4.textContent = index < letters.length ? letters[index] : "";
                h4.style.color = "white" ;

            }
            if (h4.textContent === " " || h4.textContent === "") {
                piece.style.backgroundColor = "black"
            }
        });
    
    };
    
    function make_guess() {
        gamePieces.forEach((gamePiece) =>{
            gamePiece.addEventListener("click", function() {
                puzzPieces.forEach((piece) =>{
                    const wagh = piece.querySelector('h4')
                    if (wagh && gamePiece.dataset.letter === wagh.textContent.toLowerCase()) {
                       wagh.style.color = "black";
                    }
                });
            });
        });
    };
    


    populate_board(welcomePuzz)
    make_guess()

});
