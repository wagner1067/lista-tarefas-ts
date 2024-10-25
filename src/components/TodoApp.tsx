import { useEffect, useState } from 'react'
import './TodoApp.css'
import { useTheme } from '../ThemeContext'

interface TodoItem {
    id: string
    texto: string
    completado: boolean
}

const TodoApp = () => {
    const chaveTarefasMemoria = "tarefas"
    const { theme, toggleTheme } = useTheme()
    const [todos, setTodos] = useState<TodoItem[]>([])
    const [newTodo, setNewTodo] = useState<string>("")
    const [estaCarregado, setEstaCarregado] = useState<boolean>(false)

    const adicionarTarefa = (): void => {
        if (newTodo !== "") {
            const newId = crypto.randomUUID()
            const newTodoItem: TodoItem = {
                id: newId,
                texto: newTodo,
                completado: false
            }
            setTodos([...todos, newTodoItem])
            setNewTodo("")
        }
    }

    const removerTarefas = (id: string): void => {
        const tarefasAtualizada = todos.filter((todo) => todo.id !== id)
        setTodos(tarefasAtualizada)
    }

    const marcaCompleto = (id: string): void => {
        const updatedTodos = todos.map((todo) => {
            if (todo.id === id) {
                return { ...todo, completado: !todo.completado }
            }
            return todo
        })
        setTodos(updatedTodos)
    }

    const obterTarefasCompletas = (): TodoItem[] => {
        return todos.filter(todo => todo.completado)
    }

    useEffect(() => {
        if (estaCarregado) {
            localStorage.setItem(chaveTarefasMemoria, JSON.stringify(todos))
        }
    }, [todos, estaCarregado])

    useEffect(() => {
        const tarefasMemoria = localStorage.getItem(chaveTarefasMemoria);

        if (tarefasMemoria) {
            setTodos(JSON.parse(tarefasMemoria))
        }

        setEstaCarregado(true)
    }, [])

    return (
        <div className={`app ${theme}`}>
            <div className={`container ${theme}`}>
                <h1>Lista de Tarefas - {obterTarefasCompletas().length} / {todos.length}</h1>
                <div className='input-container'>
                    <input type='text' value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
                    <button onClick={adicionarTarefa}>Adicionar Tarefa</button>
                </div>
                <ol>
                    {
                        todos.map((todo) => (
                            <li key={todo.id}>
                                <input type='checkbox' checked={todo.completado} onChange={() => marcaCompleto(todo.id)} />
                                <span style={{ textDecoration: todo.completado ? 'line-through' : 'none' }}>{todo.texto}</span>
                                <button onClick={() => removerTarefas(todo.id)}>Remover</button>
                            </li>
                        ))
                    }
                </ol>
                <button onClick={toggleTheme}>
                    Alternar para Tema {theme === "light" ? "Escuro" : "Claro"}
                </button>
            </div>
        </div>
    );
};

export default TodoApp;