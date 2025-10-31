import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { v4 as uuidv4 } from 'uuid';
import toast, { Toaster } from "react-hot-toast";

function App() {

  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showFinished, setshowFinished] = useState(true);
  const [darkMode, setDarkMode] = useState(false); // ✅ Dark mode

  useEffect(() => {
    let todoString = localStorage.getItem("todos");
    if (todoString) {
      let todos = JSON.parse(todoString);
      setTodos(todos);
    }

    let theme = localStorage.getItem("theme");
    if (theme === "dark") setDarkMode(true);
  }, []);

  const saveToLS = (newTodos) => {
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const toggleFinished = () => {
    setshowFinished(!showFinished);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  const handleEdit = (id) => {
    let t = todos.filter(i => i.id === id);
    setTodo(t[0].todo);

    let newTodos = todos.filter(item => item.id !== id);
    setTodos(newTodos);
    saveToLS(newTodos);

    toast("Edit mode enabled ✏️", { icon: "🟣" });
  };

  const handleDelete = (id) => {
    let newTodos = todos.filter(item => item.id !== id);
    setTodos(newTodos);
    saveToLS(newTodos);

    toast.error("Todo deleted ❌");
  };

  const handleAdd = () => {
    if (todo.length <= 3) return;

    let newTodos = [...todos, { id: uuidv4(), todo, isCompleted: false }];
    setTodos(newTodos);
    setTodo("");
    saveToLS(newTodos);

    toast.success("Todo added ✅");
  };

  const handleCheckbox = (id) => {
    let newTodos = todos.map(item =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );

    setTodos(newTodos);
    saveToLS(newTodos);
  };

  const progress =
    todos.length === 0
      ? 0
      : Math.round((todos.filter(t => t.isCompleted).length / todos.length) * 100);

  return (
    <>
      <Navbar />

      <Toaster />

      <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-violet-100"} mx-3 md:container md:mx-auto my-5 rounded-xl p-5 min-h-[80vh] md:w-[35%]`}>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="bg-black text-white px-4 py-1 rounded-full text-xs float-right"
        >
          {darkMode ? "light side ☀️" : "dark side 🌙"}
        </button>

        <h1 className='font-bold text-center text-3xl mb-4'>personal to do list</h1>

        {/* Progress Bar */}
        <div className="w-full bg-gray-300 rounded-full h-3 mb-4">
          <div
            className="bg-violet-700 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p>{progress}% tasks completed</p>

        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className='text-2xl font-bold'>add a new to do</h2>

          <div className="flex">
            <input
              onChange={(e) => setTodo(e.target.value)}
              value={todo}
              type="text"
              className='w-full rounded-full px-5 py-1 text-black'
              placeholder='Enter task...'
            />
            <button
              onClick={handleAdd}
              disabled={todo.length <= 3}
              className='bg-violet-800 mx-2 rounded-full hover:bg-violet-950 disabled:bg-violet-500 p-4 py-2 text-sm font-bold text-white'>
              save it
            </button>
          </div>
        </div>

        <input
          className='my-4'
          id='show'
          onChange={toggleFinished}
          type="checkbox"
          checked={showFinished}
        />
        <label className='mx-2' htmlFor="show">Show completed tasks</label>

        <div className='h-[1px] bg-black opacity-30 w-[90%] mx-auto my-2'></div>

        <h2 className='text-2xl font-bold mb-3'>your todos</h2>

        <div className="todos">
          {todos.length === 0 && <div className='m-5'>No Todos to display</div>}

          {todos.map(item => {
            return (
              (showFinished || !item.isCompleted) &&
              <div key={item.id} className="todo flex my-3 justify-between">
                <div className='flex gap-5'>
                  <input type="checkbox" checked={item.isCompleted} onChange={() => handleCheckbox(item.id)} />
                  <div className={`${item.isCompleted ? "line-through" : ""}`}>{item.todo}</div>
                </div>
                <div className="buttons flex h-full">
                  <button onClick={() => handleEdit(item.id)} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'>
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'>
                    <AiFillDelete />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  )
}

export default App;
