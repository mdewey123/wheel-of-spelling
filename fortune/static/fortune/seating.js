addEventListener("DOMContentLoaded", function() {
    load_seats(42)
    console.log("Script loaded!");
    document.querySelector('#add-room').addEventListener('click', add_room)
    
});
const room = document.querySelector('#classroom-view')

function load_seats(class_size) {
    /* generate a series of boxes iside classroom div then add logic to generate new rows acording to classroom ResizeObserverSize. 
    in top have a "Class size of __" thing amd make capable of changing the number then adapting seating based on that.
    */
   
    for (let i = 1 ; i <= class_size; i ++) {
        const col = document.createElement('div');
        col.className = 'col-2 mb-3';

        const desk = document.createElement('div');
        desk.className = 'card text-center shadow-sm desk';
        desk.id = `desk-${i}`

        const deskBody = document.createElement('div');
        deskBody.className = 'card-body p-3';

        const student = document.createElement('p');
        student.className = 'card-text mb-0';
        student.textContent = i;

        deskBody.appendChild(student);
        desk.appendChild(deskBody);
        col.appendChild(desk);
        room.appendChild(col);
    }


    let studentCount = document.querySelector("#student-count");
    studentCount.innerhtml = `students: X of ${class_size}`;

}

function add_room() {
    room.innerHTML = ''
    counter();
    const desks = document.querySelectorAll('.desk');
    const roomName = document.createElement('input');
    const classroom = document.querySelector('#current-room');
    classroom.querySelector('h2').innerHTML = `Class name: `;
    classroom.appendChild(roomName);

    const studentCount = document.querySelector('#student-count');

    desks.forEach(desk => {
        const input = document.createElement('input');
        desk.appendChild = input;
    });
}

function counter(startSize = 42) {
    currentSize = startSize;

    const counter = document.createElement('div');
    counter.id = 'student-count';
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

    document.querySelector('#student-count').appendChild(counter)

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