const addBtn = document.getElementById('add')
const target = document.getElementById('notes-container')
const toggleScrollable = document.getElementById('toggleScrollable')

const notes = JSON.parse(localStorage.getItem('notes'))

if(notes) {
    notes.forEach(note => addNewNote(note))
}

toggleScrollable.addEventListener('click', () => target.classList.toggle('scrollable'))
addBtn.addEventListener('click', () => addNewNote())
function addNewNote(text = '') {
    const note = document.createElement('div')
    note.classList.add('note')

    note.innerHTML = `
    <div class="tools">
        <button class="save"><i class="fas fa-save"></i></button>
        <button class="edit"><i class="fas fa-edit"></i></button>
        <button class="delete"><i class="fas fa-trash-alt"></i></button>
    </div>
	
    <div class="notepad">
		<div class="note-display ${text ? "" : "hidden"}"></div>
		<textarea class="${text ? "hidden" : ""}"></textarea>
    </div>
    `

    const editBtn = note.querySelector('.edit')
    const deleteBtn = note.querySelector('.delete')
    const saveBtn = note.querySelector('.save')
    const noteDisplay = note.querySelector('.note-display')
    const textArea = note.querySelector('textarea')

    textArea.value = text
    noteDisplay.innerHTML = marked(text)

    deleteBtn.addEventListener('click', () => {
        note.remove()
        updateNotesLS()
    })

    editBtn.addEventListener('click', () => {
        noteDisplay.classList.toggle('hidden')
        textArea.classList.toggle('hidden')
    })

    saveBtn.addEventListener('click', () => {
        //noteDisplay.classList.toggle('hidden')
        //textArea.classList.toggle('hidden')
    })

    textArea.addEventListener('input', (e) => {
        const { value } = e.target
        noteDisplay.innerHTML = marked(value)
        updateNotesLS()
    })

    if(target) target.appendChild(note); else document.body.appendChild(note);
}

function updateNotesLS() {
    const notesText = document.querySelectorAll('textarea')
    const notes = []

    notesText.forEach(note => notes.push(note.value))
    localStorage.setItem('notes', JSON.stringify(notes))
}

/* ----------------------------------------------------- */
const form = document.getElementById('form')
const input = document.getElementById('input')
const todosUL = document.getElementById('todos')

const todos = JSON.parse(localStorage.getItem('todos'))

if(todos) {
    todos.forEach(todo => addTodo(todo))
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    addTodo()
})

function addTodo(todo) {
    let todoText = input.value

    if(todo) {
        todoText = todo.text
    }

    if(todoText) {
        const todoEl = document.createElement('li')
        if(todo && todo.completed) {
            todoEl.classList.add('completed')
        }

        todoEl.innerText = todoText

        todoEl.addEventListener('click', () => {
            todoEl.classList.toggle('completed')
            updateTodoLS()
        }) 

        todoEl.addEventListener('contextmenu', (e) => {
            e.preventDefault()

            todoEl.remove()
            updateTodoLS()
        }) 

        todosUL.appendChild(todoEl)

        input.value = ''

        updateTodoLS()
    }
}

function updateTodoLS() {
    todosEl = document.querySelectorAll('li')

    const todos = []

    todosEl.forEach(todoEl => {
        todos.push({
            text: todoEl.innerText,
            completed: todoEl.classList.contains('completed')
        })
    })

    localStorage.setItem('todos', JSON.stringify(todos))
}
