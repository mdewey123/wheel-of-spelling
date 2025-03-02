addEventListener("DOMContentLoaded", function() {
    const gameBoard = document.getElementById("game-board");
    const welcomePuzz = this.document.getElementById("game-board").dataset.puzzle;

    function populate_board(sentence) {
        const puzzPieces = gameBoard.querySelectorAll("div");
        const letters = sentence.split("");
    
        //populate with letters for puzzle sentence
        puzzPieces.forEach((piece, index) => {
            
            const h4 = piece.querySelector('h4');
            if (h4) {
                h4.textContent = index < letters.length ? letters[index] : "";
            }
            h4.style.color = "white"
        });
    
    };
    
    populate_board(welcomePuzz)

});




function make_guess() {

};