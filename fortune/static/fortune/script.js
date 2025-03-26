addEventListener("DOMContentLoaded", function() {
    const gameBoard = document.getElementById("game-board");
    
    
    const puzzPieces = gameBoard.querySelectorAll("div");
    const welcomePuzz = document.getElementById("game-board").dataset.puzzle;

    const gameToggle = document.getElementById("game-toggle")
    
    
    populate_board(welcomePuzz, puzzPieces)
    gameToggle.addEventListener("click", () =>{
        play_game(puzzPieces);
        gameToggle.style.display = 'none'
    })
    

});

function populate_board(sentence, puzzPieces) {
    const letters = sentence.split("");
    //populate with letters for puzzle sentence
    puzzPieces.forEach((piece, index) => {
        
        const h4 = piece.querySelector('h4');
        if (h4) {
            h4.textContent = index < letters.length ? letters[index] : "";
            h4.style.color = "white" ;

        }
        if (h4.textContent === " " || h4.textContent === "") {
            piece.style.backgroundColor = "gray"
        }
    });
}

function make_guess(gamePieces, puzzPieces) {
    return new Promise((resolve) => {
        let pointCount = 0;

        function guess(){
            const guessedLetter = this.dataset.letter;
            let correctGuess = false;
            gamePiece = this

            puzzPieces.forEach((piece, index) =>{
                setTimeout(() => {
                    const wagh = piece.querySelector('h4');
                    if (wagh && guessedLetter === wagh.textContent.toLowerCase()) {
                        piece.style.backgroundColor = "gold"
                        wagh.style.color = "black";
                        wagh.style.fontWeight = "bold"; 
                        wagh.style.fontSize = "1.5rem";
                        pointCount += 1;
                        correctGuess = true;
                    }     
                    if (index === puzzPieces.length - 1) {
                        gamePiece.style.backgroundColor = correctGuess ? "blue" : "red";
                        resolve(pointCount);
                    }
                }, index * 50);          
            });
            gamePieces.forEach((gp) => gp.removeEventListener("click", guess));
        };
        gamePieces.forEach((gamePiece) =>{
            gamePiece.addEventListener("click", guess);
        });
    });
    
}

function vowel_guess(vowelPieces, puzzPieces) {
    
    return new Promise((resolve) => {
        let deduction = 500
        function guess(){
            const guessedLetter = this.dataset.vowel;
            let correctGuess = false;
            let pointCount = 0;
            gamePiece = this

            console.log(`Guessed vowel: ${guessedLetter}`);
            
            puzzPieces.forEach((piece, index) =>{
                setTimeout(() => {
                    const vowel = piece.querySelector('h4');
                    if (vowel && guessedLetter === vowel.textContent.toLowerCase()) {
                        console.log(`Checking puzzle piece: ${vowel.textContent.toLowerCase()}`)
                        piece.style.backgroundColor = "gold"
                        vowel.style.color = "black";
                        vowel.style.fontWeight = "bold"; 
                        vowel.style.fontSize = "1.5rem";
                        pointCount += 1;
                        correctGuess = true;
                    }
                    if (index === puzzPieces.length - 1) {
                        gamePiece.style.backgroundColor = correctGuess ? "blue" : "red";
                    }
                }, index * 50);
                                
            });
            console.log(correctGuess)
            vowelPieces.forEach((vp) => vp.removeEventListener("click", guess));
            resolve(deduction);
        };

        vowelPieces.forEach((vowelPiece) =>{
            vowelPiece.addEventListener("click", guess);
        });
    })
}

function solve_puz(puzzPieces) {
    puzzPieces.forEach((piece) => {
        console.log('checking piece');
        const letter = piece.querySelector('h4');
        letter.style.color = 'black';
    });

}


function wheel_spinner(){
    return new Promise((resolve) => {
        const points = ["Lose a Turn","5000", "250", "500","1000", "600", "700", "2500", "Lose Points","10,000", "Lose a Turn", "5000", "250", "500","1000", "600", "700", "2500", "Lose Points", "10,000"];
        const wheel_div = document.getElementById('game-wheel-container');
        wheel_div.style.display ='block';
        const wheel_canvas = document.getElementById("game-wheel");
        const ctx = wheel_canvas.getContext("2d");
        const result = document.getElementById("result");

        const spinSound = new Audio("{% static 'sounds/roulette_spin.mp3' %}");
        const stopSound = new Audio("{% static 'sounds/roulette_stop.mp3' %}");

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
            ctx.save();
            ctx.rotate(currentAngle);
            ctx.beginPath();
            ctx.moveTo(centerX * 0.85, -centerY - 20);  // Position of the arrow
            ctx.lineTo(centerX * 0.95, -centerY - 40); // Arrow tip
            ctx.lineTo(centerX * 0.75, -centerY - 40); // Arrow base
            ctx.closePath();
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.restore();
        } 
        

        function animate_wheel() {
            if (!spinning) return;
            currentAngle += spinVelocity;
            spinVelocity *= friction
            
            draw_wheel();

            if (spinVelocity < 0.002) {
                spinning = false;
                spinSound.pause();
                stopSound.play()

                var degrees = currentAngle * 180 / Math.PI + 90;
                var help = spaces_angle * 180 / Math.PI;
                var answer = Math.floor((360 - degrees % 360)/help)
                result.textContent = points[answer];
                wheel_div.addEventListener('click', () => {
                    wheel_div.style.display = 'none';
                }, {once: true});
                resolve(result.textContent);
            } 
            requestAnimationFrame(animate_wheel);
        }
        
        function spin() {
            if (spinning) return;
            spinVelocity = Math.random() * 0.3 + 0.2;
            spinning = true;
            spinSound.currentTime = 0;
            animate_wheel();
        }
        
        
        draw_wheel()
        document.getElementById("game-wheel").addEventListener("click", spin, {once: true});
        return;
        
    });
}

function play_game(puzzPieces) {
    const playerBoard = document.getElementById("player-board")
    const scoreBoard = document.getElementById("score-board")
    const gamePieces = document.querySelectorAll('#game-pieces div')

    function player_query() {
        playerBoard.querySelector('h4').textContent = "How many players?"
        
        for (let i = 1; i < 7; i ++ ) {
            const newButton = document.createElement('button')
            newButton.setAttribute('class', 'col')
            newButton.setAttribute('id', `select-${i}`)
            newButton.textContent = `${i} teams`
            playerBoard.appendChild(newButton)
        };

        playerBoard.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', function(event) { set_players(event); });
        });

        function set_players(event) {
            const selectedTeams = parseInt(event.target.textContent);
            
            for (let i = 1; i <= selectedTeams; i ++ ) {
                const playerCard = document.createElement("div");
                playerCard.setAttribute('class', 'row');
                playerCard.setAttribute('id', `team-${i}`)
                playerCard.style.margin = '0.2%'
                const playerTitle = document.createElement('h6');
                playerTitle.setAttribute('class', 'col');
                playerTitle.textContent = `Team ${i}`;
                const points = document.createElement('h6');
                points.classList.add('col', 'point-counter')
                points.textContent = 'Points: 0';
                const playButton = document.createElement("button");
                playButton.setAttribute('id', `start-${i}`);
                playButton.textContent = 'start turn';
                playerCard.appendChild(playerTitle);
                scoreBoard.appendChild(playerCard);
                playerCard.appendChild(points);
                playerCard.appendChild(playButton);
                playButton.addEventListener("click", () => game_turn(playerCard));
                playerCard.style.minHeight = "12.5%"
                playerCard.style.maxHeight = "40%"
            };
            playerBoard.textContent = ""
            playerBoard.style.display = "none"
        };        
    }    

    async function game_turn(player) {
        const pointHeading = player.querySelector(".point-counter")
        const pointStartText = (pointHeading.textContent);
        const pointStart = parseInt(pointStartText.replace('Points: ', ''))
        const buttonDiv = document.getElementById('button-div')

        player.style.border = "2px solid yellow"
        const startButton = player.querySelector('button')
        startButton.style.display = 'none'

        const spinButton = document.createElement('button')
        
        spinButton.setAttribute('id', 'wheel-spin')
        spinButton.textContent = 'spin the wheel'
        buttonDiv.appendChild(spinButton)
        const buyVowelButton = document.createElement('button')
        const solveButton = document.createElement('button')
        solveButton.setAttribute('id', 'solve-btn')
        solveButton.textContent = 'Solved'
        buttonDiv.appendChild(solveButton)

        if (pointStart >= 500) {
            const buyVowelButton = document.createElement('button')
          
            buyVowelButton.setAttribute('id', 'buy-vowel')
            buyVowelButton.textContent = 'Buy a vowel?'
            buttonDiv.appendChild(buyVowelButton)

            buyVowelButton.addEventListener('click', async () =>{
                const vowelPieceDiv = document.getElementById('vowel-pieces')
                const vowelPieces = vowelPieceDiv.querySelectorAll('div')
                
                buyVowelButton.remove()
                spinButton.remove()
                solveButton.remove()
                let deduction = await vowel_guess(vowelPieces, puzzPieces)
                
                let subbedPoints = pointStart - deduction;
                pointHeading.textContent = `Points: ${subbedPoints}`;
                end_turn(player);
            });

        } 

        spinButton.addEventListener('click', async () =>{
            spinButton.remove()
            buyVowelButton.remove()
            solveButton.remove()
            const result = await wheel_spinner();

            if(result === 'Lose a Turn') {
                alert("Luck's not yours today, you loose a turn");
                
            } else if(result === 'Lose Points') {
                alert("How unfortunate, you're loosing points and your turn")
                pointHeading.textContent = 'Points: 0'
                
            } else {
                const newPoints = document.createElement('h2');
                newPoints.setAttribute('id', 'new-points')
                newPoints.textContent = `Playing for: ${result}`
                player.appendChild(newPoints) 
                const letterCount = await make_guess(gamePieces, puzzPieces);
                let modifier = parseInt(letterCount)
                resultPoints = parseInt(result.replace(',', ''))
                console.log(`modifier: ${modifier}`)
                console.log(`Point start: ${pointStart}`)
                console.log(`result point: ${resultPoints}`)
                const finalPoints = pointStart + resultPoints * modifier; 
                console.log(`final points: ${finalPoints}`)
                pointHeading.textContent = `Points: ${finalPoints}`;
            }  
            end_turn(player); 
        }); 

        solveButton.addEventListener('click', () =>{
            spinButton.remove();
            buyVowelButton.remove();
            solve_puz(puzzPieces);
                
            let solvePoints = pointStart + 20000
            pointHeading.textContent = `Points: ${solvePoints}`
        });

    }

    player_query();
}

function end_turn(player) {
    console.log('ending turn')
    player.style.borderColor = "transparent"
    const newPointsElement = player.querySelector('#new-points');
    const byeSpin = document.getElementById("wheel-spin");
    const byeVowel = document.getElementById('buy-vowel')

    if (newPointsElement) {
        newPointsElement.remove();  
    }
    if (byeSpin) {
        byeSpin.remove();
    };

    if (byeVowel) {
        byeVowel.remove();
    };

    player.querySelector('button').style.display = 'block'
}