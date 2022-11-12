import React, { useState, useEffect } from 'react'
import './assets/scss/app.scss'
import { useForm } from "react-hook-form";


import 'reactjs-popup/dist/index.css';

function Home() {
    const newTodo = {
        task: '',
    }
    
    const getForm = () => {
        const storedValues = localStorage.getItem("form");
        if (!storedValues)
          return {
            tasks:[],
            editMode: false,
            activeTabId: 0
          };
        return JSON.parse(storedValues);
    };

    const [state, setState] = useState(getForm);

    const { handleSubmit } = useForm();

    const handleChange = e => {
        const { name, value } = e.target

        setState(prev => ({
            ...prev,
            newTodo:{
                ...prev.newTodo,
                [name]: value
            }
        }))
    };

    const handleRemove = index => {
        const { tasks } = state

        const updatedTasks = tasks.filter((task, i) => {
            return index !== i
        })

        setState(prev => ({
            ...prev,
            tasks: updatedTasks,
            newTodo
        }))
    }

    const handleEdit = index => {
        setEditMode(String(index))
        const { tasks } = state

        const currentElement = tasks[index]

        setState(prev => ({
            ...prev,
            newTodo: currentElement
        }))
    }

    const setEditMode = (editMode = false) => {
        setState(prev => ({
            ...prev,
            editMode
        }))
    }

    const handleComplete = (e, index) => {
        const { checked } = e.target
        const { tasks } = state

        const updatedTasks = tasks.map((task, i) => {
            if(index === i){
                task.completed = checked
            }

            return task
        })

        setState(prev => ({
            ...prev,
            tasks: updatedTasks,
            newTodo
        }))
    }

    const handleSetActiveTab = activeTabId => {
        setState(prev => ({
            ...prev,
            activeTabId
        }))
    }

    const isItemVisible = isCompleted => {
        if(state.activeTabId === 0) {
            return true
        } else if(state.activeTabId === 1 && isCompleted){
            return true
        }else if (state.activeTabId === 2 && !isCompleted){
            return true
        }

        return false
    }

    const getTasks = () => {
        const { tasks } = state

        const updatedTasks = tasks.filter(task => {
            return isItemVisible(task.completed)
        })

        return updatedTasks
    }

    const onSubmit = async (data) => {
        console.log(data);
    };
    
    useEffect(() => {
        localStorage.setItem("form", JSON.stringify(state));
    }, [state]);

    return(
        <div className="container">
            <div className="col">
                <form id="form" onChange={handleChange} onSubmit={handleSubmit(onSubmit)}>
                    
                </form>
                    
                <ul className="tabs row">
                    <li className={state.activeTabId === 0 ? 'active' : ''} onClick={() => {
                        handleSetActiveTab(0)
                    }}>
                        <b>All</b>
                    </li>
                    <li className={state.activeTabId === 1 ? 'active' : ''} onClick={() => {
                        handleSetActiveTab(1)
                    }}>
                        <b>Completed</b>
                    </li>
                    <li className={state.activeTabId === 2 ? 'active' : ''} onClick={() => {
                        handleSetActiveTab(2)
                    }}>
                        <b>In Progress</b>
                    </li>
                </ul>
                <ul className="list">
                    {getTasks().map((task, i) => 
                        <li key={i}>
                            <div className="row">
                                <div>
                                    <input type="checkbox" checked={task.completed} onChange={e => {
                                        handleComplete(e, i)
                                    }} />
                                        <p>{task.name}</p>
                                        <p>{task.description}</p>
                                        <p>{task.priority}</p>
                                        <p>{task.endDate}</p>
                                    
                                </div>
                                <div className="options">
                                    <span className="edit" onClick={() => {
                                        handleEdit(i)
                                    }}>
                                        {'[AddTask]'}
                                    </span>
                                    <span className="delete" onClick={() => {
                                        handleRemove(i)
                                    }}>
                                        {'[Delete]'}
                                    </span>
                                </div>
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        </div>     
    )
}

export default Home;