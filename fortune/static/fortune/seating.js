addEventListener("DOMContentLoaded", function() {
    load_seats(42)
    console.log("Script loaded!");
    document.querySelector('#add-room').addEventListener('click', add_room);
    document.querySelector('#edit-room').addEventListener('click', edit_room);
    document.querySelectorAll(".classname").forEach(el => {el.addEventListener('click', () => populate_seats(el));
    });
    document.querySelector('#Partners').addEventListener('click', partner_button);
    document.querySelector('#random').addEventListener('click', random_student);
    document.querySelector('#edit-room').addEventListener('click', edit_room);
    this.document.querySelector('#shuffle').addEventListener('click', shuffle_seating);
});
const room = document.querySelector('#classroom-view')

function load_seats(class_size) {
    /* generate a series of boxes iside classroom div then add logic to generate new rows acording to classroom ResizeObserverSize. 
    in top have a "Class size of __" thing amd make capable of changing the number then adapting seating based on that.
    */
   
    for (let i = 1 ; i <= class_size; i ++) {
        
        const deskContainer = document.createElement('div');
        deskContainer.className = 'col-2';
       
        const desk = document.createElement('div');
        desk.className = 'text-center shadow-sm desk ';
        desk.id = `desk-${i}`

        const deskBody = document.createElement('div');
        deskBody.className = 'card-body p-3';

        const student = document.createElement('p');
        student.className = 'card-text mb-0';
        student.textContent = i;

        deskBody.appendChild(student);
        desk.appendChild(deskBody);
        deskContainer.appendChild(desk);
        room.appendChild(deskContainer);
    
        desk.addEventListener('click', absentent_toggle);
    


    let studentCount = document.querySelector("#student-count");
    studentCount.innerHTML = `students: X of ${class_size}`;

    }
}

function populate_seats(classroom) {
    const roomID = classroom.dataset.id;
    console.log("populate_seats called with:", classroom);
    console.log("classroom.dataset.id:", roomID);
    fetch(`/get-class/${roomID}`)
        .then(response => response.json())
        .then(data => {
            room.innerHTML = '';
            const currentRoom = document.querySelector('#current-room h2');
        if (currentRoom) {
            currentRoom.textContent = `Class: ${classroom.textContent}`;
        }
            const students = data.students;
            const maxPosition = students.length > 0
                ? Math.max(...students.map(s => s.position || 0))
                : 0;
    load_seats(maxPosition);

        students.forEach((student) => {
            const studentDesk = document.getElementById(`desk-${student.position}`);   
            if (studentDesk) {
                console.log(`${student} is sitting at desk ${studentDesk.id}`)
                const body = studentDesk.querySelector('.card-body');    
                body.innerHTML = `<p class="card-text mb-0">${student.name}</p> <p>${student.number}</p>`;
                studentDesk.dataset.student = true;
                studentDesk.dataset.studentName = student.name;
                studentDesk.dataset.studentNumber = student.number;
                }
            
            });
        })
        const desks = document.querySelectorAll('.desk');
        desks.forEach(desk => {
            if (!desk.dataset.student) {
                const body = desk.querySelector('.card-body');
                body.innerHTML = ''
            }
        })

        .catch(error => {
            console.error('Error fetching class data:', error);
        });
}



function add_room() {
    countDiv = document.getElementById('set-room-size');
    currentRoomInput = document.getElementById('current-room-input');
    btnDiv = document.getElementById('btn-div');

    if (btnDiv) {
        btnDiv.innerHTML = ''
    };
    if (currentRoomInput) {
        currentRoomInput.remove()
    };
    if (countDiv) {
        countDiv.remove();
    };

    room.innerHTML = '';

    counter();
    name_form();

    const roomName = document.createElement('input');
    roomName.id = 'room-name';
    const classroom = document.querySelector('#current-room');
    classroom.querySelector('h2').innerHTML = `Class name: `;
    classroom.appendChild(roomName);
    
    const submitBtn = document.createElement('button')
    submitBtn.className = 'btn btn-primary'
    submitBtn.id = 'submit-new'
    submitBtn.innerText = "Submit new class list"
    btnDiv.appendChild(submitBtn)

   
    submitBtn.addEventListener('click', save_class);
}

function save_class() {
    const desks = document.querySelectorAll('.desk');
    const roomName = document.getElementById('room-name') || document.getElementById('room-name-input');
    let students = [];
    const className = roomName.value.trim();
    if (!className) {
        alert("What class is this? please add a classroom name");
        return;
    }

    desks.forEach((desk, index) => {
        const nameInput = desk.getElementsByClassName('student-name')[0];
        const numInput = desk.getElementsByClassName('student-number')[0];
        const studNameVal = nameInput.value?.trim();
        const studNumVal = numInput.value?.trim();
        

        if (studNameVal && studNumVal && !isNaN(studNumVal)) {
            students.push({
                name: studNameVal,
                number: parseInt(studNumVal),
                position: index + 1
            });
        }
    });

    console.log("staging new room. class: ", className, "students: ", students, );

    fetch('/save-class', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            class_name: className,
            students: students
        })
    }) .then(response => {
        if (response.ok) {
            alert("Class saved successfully!");
            location.reload();
        } else {
            alert("Something went wrong.");
        }
    });
}
 

function name_form() {
    const desks = document.querySelectorAll('.desk');
    desks.forEach(desk => {
        console.log('found a desk!')
        const body = desk.querySelector('.card-body');

        const studentInput = document.createElement('input');
        studentInput.className = 'student-name form-control';
        studentInput.placeholder = 'Name';
        body.appendChild(studentInput);

        const studentNumber = document.createElement('input');
        studentNumber.className = 'student-number form-control';
        studentNumber.placeholder = 'Student number';
        body.appendChild(studentNumber);

        
    });
} 

function counter(startSize = 42) {
    currentSize = startSize;

    const counter = document.createElement('div');
    counter.id = 'set-room-size';
    counter.className = 'd-flex align-items-center justify-content-center gap-3 my-3';

    const minusBtn = document.createElement('button');
    minusBtn.className = 'btn btn-outline-secondary';
    minusBtn.id = 'minusBtn';
    minusBtn.textContent = '-';

    const studentCount = document.createElement('span');
    studentCount.className = 'fs-4';
    studentCount.id = 'student-counter';
    studentCount.textContent = currentSize;

    const plusBtn = document.createElement('button');
    plusBtn.id = 'plusBtn';
    plusBtn.className = 'btn btn-outline-secondary';
    plusBtn.textContent = '+';

    counter.appendChild(minusBtn);
    counter.appendChild(studentCount);
    counter.appendChild(plusBtn);

    document.getElementById('student-count').appendChild(counter)

    const minSize = 1;
    const maxSize = 46;

    plusBtn.addEventListener('click', () => {
        if (currentSize < maxSize) {
            currentSize++;
            studentCount.textContent = currentSize
            room.innerHTML = ''
            load_seats(currentSize)
        };
    });

    minusBtn.addEventListener('click', () => {
        if (currentSize > minSize) {
            currentSize--;
            studentCount.textContent = currentSize
            room.innerHTML = ''
            load_seats(currentSize)
        };
    });

    load_seats(currentSize);
    
}
 
function expand_desk(desk) {
    if (desk.classList.contains('expanded')) {
        desk.classList.remove('expanded');
    } else {
        desk.classList.toggle('expanded');
    }
} 


function edit_room(){
    const desks = document.querySelectorAll('.desk');
        desks.forEach(desk => {
            console.log('found a desk!');
            const body = desk.querySelector('.card-body');
            const existingName = desk.dataset.studentName || '';
            const existingNumber = desk.dataset.studentNumber || '';
            body.innerHTML = '';

            const studentInput = document.createElement('input');
            studentInput.className = 'student-name form-control';
            studentInput.value = existingName;
            studentInput.placeholder = 'Name';
            body.appendChild(studentInput);

            const studentNumber = document.createElement('input');
            studentNumber.className = 'student-number form-control';
            studentNumber.value = existingNumber;
            studentNumber.placeholder = 'Number';
            body.appendChild(studentNumber);
        });

    countDiv = document.getElementById('set-room-size');
    if (countDiv) {
        countDiv.remove();
    };

    const classroom = document.querySelector('#current-room');
    const currentRoomHeader = classroom.querySelector('h2'); 
    const currentRoomName = currentRoomHeader.textContent.replace('Class: ', '').replace('Class name: ', '').trim();
    currentRoomHeader.innerHTML = 'Class name: ';

    const prevRoomNameInput = document.getElementById('room-name-input');
    if (!prevRoomNameInput) {
    
        const roomName = document.createElement('input');
        roomName.id = 'room-name-input';
        roomName.value = currentRoomName;
        roomName.className = 'form-control d-inline-block w-auto ms-2';
        currentRoomHeader.appendChild(roomName);

        classroom.querySelector('h2').innerHTML = `Class name: `;
        classroom.appendChild(roomName);
    }

    const btnDiv = document.getElementById('btn-div');
    if (btnDiv) {btnDiv.innerHTML = ''}
    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn btn-primary';
    submitBtn.id = 'submit-new';
    submitBtn.innerText = "Save changes";
    btnDiv.appendChild(submitBtn);

    submitBtn.addEventListener('click', save_class);
}

function partner_button() {
  
    const desks = Array.from(document.querySelectorAll('.desk')).filter(desk => desk.dataset.student === "true" && desk.dataset.absent !== "true");
    if (desks.length < 2) {
        alert("Not enough students to pair!");
        return;
    }

 
    for (let i = desks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [desks[i], desks[j]] = [desks[j], desks[i]];
    }

   
   const colors = [
    "#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff",
    "#bdb2ff", "#ffc6ff", "#fffffc", "#e0aaff", "#b5ead7", "#ffdac1",
    "#c7ceea", "#f6dfeb", "#f7b7a3", "#f1c0e8", "#b5ead7", "#caffbf",
    "#f9c74f", "#90be6d", "#43aa8b", "#577590", "#f28482", "#bc6c25"
];
   
    const flashColors = [
        "#f72585", "#b5179e", "#7209b7", "#560bad", "#480ca8", "#3a0ca3",
        "#4361ee", "#4cc9f0", "#4895ef", "#00b4d8", "#48cae4", "#90e0ef"
    ];

    document.querySelectorAll('.desk').forEach(desk => {
        desk.style.backgroundColor = "";
    });

    const duration = 1000 + Math.random() * 2000; 
    const intervalTime = 80;
    const cycles = Math.floor(duration / intervalTime);
    let count = 0;

    const interval = setInterval(() => {
        desks.forEach(desk => {
            
            desk.style.backgroundColor = flashColors[Math.floor(Math.random() * flashColors.length)];
        });
        count++;
        if (count >= cycles) {
            clearInterval(interval);

            for (let i = desks.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [desks[i], desks[j]] = [desks[j], desks[i]];
            }

            desks.forEach(desk => desk.style.backgroundColor = "");

        for (let i = 0; i < desks.length; i += 2) {
            const color = colors[Math.floor(i / 2) % colors.length];
            desks[i].style.backgroundColor = color;
            if (desks[i + 1]) {
                desks[i + 1].style.backgroundColor = color;
            } else {
            
                desks[i].style.backgroundColor = "#cccccc";
            }
        }
        }
    }, intervalTime);
}

function random_student() {
    
    const desks = Array.from(document.querySelectorAll('.desk')).filter(desk => desk.dataset.student === "true" && desk.dataset.absent !== "true");
    if (desks.length === 0) {
        alert("No students to choose from!");
        return;
    }

 
    desks.forEach(desk => {
        desk.style.backgroundColor = "";
    });

 
    const randomIndex = Math.floor(Math.random() * desks.length);


    let current = 0;
    let prev = null;
    const highlightColor = "#ffd700";
    const cycleColor = "#b5ead7";
    const duration = 1000 + Math.random() * 2000;
    const intervalTime = 80;
    const cycles = Math.floor(duration / intervalTime);
    let count = 0;

    const interval = setInterval(() => {
       
        if (prev !== null) desks[prev].style.backgroundColor = "";
        desks[current].style.backgroundColor = cycleColor;
        prev = current;
        current = (current + 1) % desks.length;
        count++;
        if (count >= cycles) {
            clearInterval(interval);
        
            desks[prev].style.backgroundColor = "";
            
            desks[randomIndex].style.backgroundColor = highlightColor;
        }
    }, intervalTime);
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        for (let cookie of document.cookie.split(';')) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function shuffle_seating() {
    // Get all desks with students
    const desks = Array.from(document.querySelectorAll('.desk'));
    seatCount = desks.length;
    if (seatCount < 2) {
        alert("Not enough students to shuffle!");
        return;
    }

    // Shuffle desks
    for (let i = seatCount - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [desks[i], desks[j]] = [desks[j], desks[i]];
    }

    // Prepare new seating data
    const shuffledStudents = desks.map((desk, idx) => ({
        name: desk.dataset.studentName,
        number: desk.dataset.studentNumber,
        position: idx + 1 // new seat position
    }));

    // Update the DOM to reflect new seating
    room.innerHTML = '';
    load_seats(seatCount);
    shuffledStudents.forEach(student => {
        if (!student.name) return; 
        const studentDesk = document.getElementById(`desk-${student.position}`);
        console.log(`Placing ${student.name} at desk-${student.position}`);
        if (studentDesk) {
            const body = studentDesk.querySelector('.card-body');
            body.innerHTML = `<p class="card-text mb-0">${student.name}</p> <p>${student.number}</p>`;
            studentDesk.dataset.student = true;
            studentDesk.dataset.studentName = student.name;
            studentDesk.dataset.studentNumber = student.number;
        }
    });
    
    edit_room();
    
    
    
}

function absentent_toggle(event) {
    const desk = event.currentTarget;
    if (desk.dataset.student !== "true") return;

    if (desk.dataset.absent === "true") {
        desk.dataset.absent="false";

    } else {
        desk.dataset.absent="true";
        
    }
}