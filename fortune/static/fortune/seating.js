addEventListener("DOMContentLoaded", function() {
    load_seats(42)
    console.log("Script loaded!");
    
});

function load_seats(class_size) {
    /* generate a series of boxes iside classroom div then add logic to generate new rows acording to classroom ResizeObserverSize. 
    in top have a "Class size of __" thing amd make capable of changing the number then adapting seating based on that.
    */
   const room = document.querySelector('#classroom-view')
    for (let i = 1 ; i <= class_size; i ++) {
        const col = document.createElement('div');
        col.className = 'col-2 mb-3';

        const desk = document.createElement('div');
        desk.className = 'card text-center shadow-sm';

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


    let studentCount = document.querySelector("#student-count")
    studentCount.innerhtml = `students: X of ${class_size}`

}