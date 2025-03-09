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

    function wheel_spinner(){
        const points = ["Lose a Turn","5000", "250", "500","1000", "600", "700", "2500", "Lose Points","10,000", "Lose a Turn", "5000", "250", "500","1000", "600", "700", "2500", "Lose Points", "10,000"];

        const wheel_canvas = document.getElementById("game-wheel");
        const ctx = wheel_canvas.getContext("2d");
        const result = document.getElementById("result");

        const spaces = points.length;
        const spaces_angle = (2 * Math.PI) / spaces;
        

        const wheelSize = Math.min(window.innerWidth, window.innerHeight) * 0.4;
        const centerX = wheelSize / 2;
        const centerY = wheelSize / 2;

        let currentAngle = 0;
        let spinning = false;
        let spinVelocity = 0;
        let friction = 0.99;

        function draw_wheel() {
            wheel_canvas.width = wheelSize;
            wheel_canvas.height = wheelSize;
            ctx.clearRect(0, 0, wheel_canvas.width, wheel_canvas.height);
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(currentAngle);
            

            for (let i = 0; i < spaces; i++) {
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.arc(0, 0, centerX * 0.95, i * spaces_angle, (i + 1) * spaces_angle);
                ctx.fillStyle = i % 2 === 0 ? "#ffcc00" : "#ff6600";
                ctx.fill();
                ctx.stroke();
                ctx.closePath();

                ctx.save();
                ctx.translate(0, 0);
                ctx.rotate(i * spaces_angle + spaces_angle / 2);
                ctx.fillStyle = "black";
                ctx.font = `${centerX * 0.1}px arial`;
                ctx.textAlign = "left";
                ctx.fillText(points[i], centerX * 0.35, 5);
                ctx.restore();
            };
        } 
        
        function animate_wheel() {
            if (!spinning) return;

            currentAngle += spinVelocity;
            spinVelocity *= friction

            if (spinVelocity <0.01) {
                spinning = false;
                determine_result();
            }
            draw_wheel();
            requestAnimationFrame(animate_wheel);
        }
        
        function spin() {
            if (spinning) return;
            spinVelocity = Math.random() * 0.3 + 0.2;
            spinning = true;
            animate_wheel();
        }

        function determine_result() {
            // Normalize the angle so it's between 0 and 2*PI
            let normalizedAngle = (currentAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        
            // Calculate the angle of the 12 o'clock position (top of the wheel)
            let topSliceAngle = Math.PI / 2;
        
            // Determine the angle difference from the top of the wheel (12 o'clock position)
            let angleDifference = normalizedAngle - topSliceAngle;
        
            // If the angle difference is negative, adjust to ensure it's positive
            if (angleDifference < 0) {
                angleDifference += 2 * Math.PI;
            }
        
            // Determine the index of the slice based on the angle difference
            let selectedIndex = Math.floor(angleDifference / spaces_angle);
        
            // Ensure the result is within bounds
            selectedIndex = selectedIndex % points.length;
        
            // Update the result text to display the slice at the 12 o'clock position
            result.textContent = `Result: ${points[selectedIndex]}`;
        }
        
        //if inde = ???? & velocity < 0.01 stop wheel

        document.getElementById("waaaah").addEventListener("click", spin);

        draw_wheel()
    }
         
    
    wheel_spinner()

});
