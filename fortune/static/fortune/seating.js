addEventListener("DOMContentLoaded", function() {
    load_seats(42)
    console.log("Script loaded!");
    document.querySelector('#add-room').addEventListener('click', add_room)
    document.querySelector('#edit-room').addEventListener('click', edit_room)
    document.querySelectorAll('.classroom').forEach(el => {el.addEventListener('click', load_room)});
    document.querySelectorAll(".classname").forEach(el => {el.addEventListener('click', () => populate_seats(el));
    });
});
const room = document.querySelector('#classroom-view')

function load_seats(class_size) {
    /* generate a series of boxes iside classroom div then add logic to generate new rows acording to classroom ResizeObserverSize. 
    in top have a "Class size of __" thing amd make capable of changing the number then adapting seating based on that.
    */
   
    for (let i = 1 ; i <= class_size; i ++) {
        

        const desk = document.createElement('div');
        desk.className = 'card text-center shadow-sm desk col-2 mb-2';
        desk.id = `desk-${i}`

        const deskBody = document.createElement('div');
        deskBody.className = 'card-body p-3';

        const student = document.createElement('p');
        student.className = 'card-text mb-0';
        student.textContent = i;

        deskBody.appendChild(student);
        desk.appendChild(deskBody);
        
        room.appendChild(desk);
    
        desk.addEventListener('click', () => {
            const tag = event.target.tagName.toLowerCase();
            if (tag === 'input' || tag === 'textarea') {
                return;
            } else {expand_desk(desk); }
            });
    }
    


    //let studentCount = document.querySelector("#student-count");
    //studentCount.innerHTML = `students: X of ${class_size}`;

}

function populate_seats(classroom) {
    const roomID = classroom.dataset.id;
    console.log("populate_seats called with:", classroom);
    console.log("classroom.dataset.id:", roomID);
    fetch(`/get-class/${roomID}`)
        .then(response => response.json())
        .then(data => {
            room.innerHTML = '';
            const students = data.students;
            const maxPosition = students.length > 0
                ? Math.max(...students.map(s => s.position || 0))
                : 0;
    load_seats(maxPosition);

            students.forEach((student) => {
                const desk = document.getElementById(`desk-${student.position + 1}`);
                if (desk && desk.id == student.position) {
                    const body = desk.querySelector('.card-body');
                    body.innerHTML = `<p class="card-text mb-0">${student.name}, ${student.number}</p>`;
                }
            });
        })
        .catch(error => {
            console.error('Error fetching class data:', error);
        });
}


/* change so each card expands and becomes a form so can input student info that way?*/
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

    const desks = document.querySelectorAll('.desk');
    const roomName = document.createElement('input');
    roomName.id = 'current-room-input'
    const classroom = document.querySelector('#current-room');
    classroom.querySelector('h2').innerHTML = `Class name: `;
    classroom.appendChild(roomName);
    const studentCount = document.querySelector('#student-count');
    
    const submitBtn = document.createElement('button')
    submitBtn.className = 'btn btn-primary'
    submitBtn.id = 'submit-new'
    submitBtn.innerText = "Submit new class list"
    btnDiv.appendChild(submitBtn)

   
    submitBtn.addEventListener('click', () => {
        students = [];
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
            /*const name = desk.dataset.studentName;
            const number = desk.dataset.studentNumber; */

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
        
            /*desk.addEventListener('click', function(){


            if (desk.classList.contains('expanded')) {
            
                desk.appendChild(studentInput);
                desk.appendChild(studentNumber);
            
            } else {
                
                const studNameVal = body.querySelector('.student-name')?.value.trim();
                const studNumVal = body.querySelector('.student-number')?.value.trim();

                desk.dataset.studentName = studNameVal;
                desk.dataset.studentNumber = studNumVal;

                
                desk.querySelector(".card-text").innerHTML = `${studNameVal}, ${studNumVal}`


               
                
            }
    
            
        });*/

        
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
    name_form();
    
}
function expand_desk(desk) {
    if (desk.classList.contains('expanded')) {
        desk.classList.remove('expanded');
    } else {
        desk.classList.toggle('expanded');
    }
}
function edit_room(){

}

function load_room(){

    load_seats
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
