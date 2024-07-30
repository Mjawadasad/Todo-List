import inquirer from 'inquirer';
import * as fs from 'fs';

const filePath = 'todos.json';

interface Todo {
  id: number;
  task: string;
  completed: boolean;
}

let todos: Todo[] = [];

// Load existing todos from file
function loadTodos() {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    todos = JSON.parse(data);
  }
}

// Save todos to file
function saveTodos() {
  fs.writeFileSync(filePath, JSON.stringify(todos, null, 2));
}

// Add a new todo
async function addTodo() {
  const { task } = await inquirer.prompt({
    type: 'input',
    name: 'task',
    message: 'Enter the task:',
  });

  const newTodo: Todo = {
    id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
    task,
    completed: false,
  };

  todos.push(newTodo);
  saveTodos();
  console.log('Task added!');
  mainMenu();
}

// List all todos
function listTodos() {
  if (todos.length === 0) {
    console.log('No tasks found.');
  } else {
    todos.forEach(todo => {
      console.log(`${todo.id}: ${todo.task} [${todo.completed ? '✓' : '✗'}]`);
    });
  }
  mainMenu();
}

// Mark a todo as completed
async function completeTodo() {
  const { id } = await inquirer.prompt({
    type: 'input',
    name: 'id',
    message: 'Enter the task ID to mark as completed:',
  });

  const todo = todos.find(todo => todo.id === parseInt(id));
  if (todo) {
    todo.completed = true;
    saveTodos();
    console.log('Task completed!');
  } else {
    console.log('Task not found.');
  }
  mainMenu();
}

// Main menu
async function mainMenu() {
  const answers = await inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      'Add a new task',
      'List all tasks',
      'Complete a task',
      'Exit',
    ],
  });

  switch (answers.action) {
    case 'Add a new task':
      addTodo();
      break;
    case 'List all tasks':
      listTodos();
      break;
    case 'Complete a task':
      completeTodo();
      break;
    case 'Exit':
      console.log('Goodbye!');
      process.exit();
  }
}

// Load existing todos and start the app
loadTodos();
mainMenu();
