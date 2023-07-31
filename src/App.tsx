import {useEffect, useState} from "react";
import axios from "axios";

type Todo = {
    id: string;
    description: string;
    status: string;
}

type TodoCardProps = {
    todo: Todo,
    setTodos: (todos: Todo[]) => void,
    todos: Todo[]
}

function TodoCard(props: TodoCardProps) {
    const todo = props.todo;
    const setTodos = props.setTodos;
    const todos = props.todos;

    return (
        <li>
            Description: {todo.description}<br/>
            Status: {todo.status}<br/>
            {todo.status !== "DONE" ? (
                <button onClick={() => {
                    let status = todo.status;

                    if (status === "OPEN") {
                        status = "IN_PROGRESS";
                    } else if (status === "IN_PROGRESS") {
                        status = "DONE";
                    }

                    axios({
                        url: "/api/todo/" + todo.id,
                        method: "put",
                        data: {
                            id: todo.id,
                            description: todo.description,
                            status: status
                        }
                    });

                    setTodos(todos.map(t => t.id === todo.id ? {
                        id: todo.id,
                        description: todo.description,
                        status: status
                    } : t));
                }}>NEXT</button>
            ) : null}

            {todo.status === "DONE" ? (
                <button onClick={() => {
                    axios({
                        url: "/api/todo/" + todo.id,
                        method: "delete",
                    });

                    setTodos(todos.filter(t => t.id !== todo.id));
                }}>DELETE</button>
            ) : null}
        </li>
    );
}

function App() {
    const [todos, setTodos] = useState<undefined | Todo[]>();

    useEffect(() => {
        axios({
            url: "/api/todo",
            method: "get"
        }).then(function (response) {
            setTodos(response.data);
        });
    }, []);

    return (
        <div>
            <h1>Todos:</h1>

            {todos === undefined ? <p>Loading...</p> : (
                todos.length === 0 ? <p>No todos!</p> : (
                    <ul>
                        {todos.map(todo => <TodoCard key={todo.id} todo={todo} setTodos={(todos: Todo[]) => setTodos(todos)} todos={todos}/>)}
                    </ul>
                )
            )}
        </div>
    )
}

export default App
