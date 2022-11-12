import React, { useState, useEffect } from 'react'
import './assets/scss/app.scss'
import { useForm } from "react-hook-form";

function Home() {
    const newTask = {
        name: '',
        description: '',
        endDate: '',
        priority: '',
        completed: false,
        visibleDescription: false
    }
    
    const getForm = () => {
        const storedValues = localStorage.getItem("form");
        if (!storedValues)
          return {
            tasks:[],
            newTask,
            editMode: false,
            activeTabId: 0
          };   
        return JSON.parse(storedValues);
    };

    const [state, setState] = useState(getForm);

    const { register, handleSubmit } = useForm();

    const handleChange = e => {
        const { name, value } = e.target

        setState(prev => ({
            ...prev,
            newTask:{
                ...prev.newTask,
                [name]: value
            }
        }))
    };

    const handleAdd = () => {
        setEditMode(false)
        if(state.editMode){
            const { tasks } = state

            const updatedTasks = tasks.map((task, i) => {
                if(Number(state.editMode) === i){
                    task = state.newTask
                }
                
                return task
            })
    
            setState(prev => ({
                ...prev,
                tasks: updatedTasks,
                newTask
            }))
            
            return
        }
        setState(prev => ({
            ...prev,
            tasks: [
                prev.newTask,
                ...prev.tasks
            ],
            newTask
        }))
    }

    const toggleDescription = index => {
        const { tasks } = state

        const updatedTasks = tasks.map((task, i) => {
            if(index === i){
                task.visibleDescription = !task.visibleDescription
            }

            return task
        })

        setState(prev => ({
            ...prev,
            tasks: updatedTasks,
            newTask
        }))
    }

    const handleRemove = index => {
        const { tasks } = state

        const updatedTasks = tasks.filter((task, i) => {
            return index !== i
        })

        setState(prev => ({
            ...prev,
            tasks: updatedTasks,
            newTask
        }))
    }

    const handleEdit = index => {
        setEditMode(String(index))
        const { tasks } = state

        const currentElement = tasks[index]

        setState(prev => ({
            ...prev,
            newTask: currentElement
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
            newTask
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

    const isSubmittable = (data) => (data?true:false)

    return(
        <div className="container">
            <div className="col">
                <form onChange={handleChange} onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        <p className="labels">Task: </p>
                        <input 
                            type="text" 
                            placeholder="Task name..." 
                            name="name"
                            onChange={handleChange}
                            value={state.newTask.name}
                            required
                        />
                    </div>
                    <div className="row">
                        <p className="labels">Description:</p>
                        <textarea 
                            placeholder="Description..." 
                            name="description"
                            onChange={handleChange}
                            value={state.newTask.description}
                        />  
                    </div>  
                    <div className="row">
                        <label className="prioritylabel">Priority:</label>
                        <div className="selectoptions">
                            <select 
                                id="priority"
                                name="priority"
                                onChange={handleChange}
                                value={state.newTask.priority}
                                required
                            >
                                <option value="" hidden>Select...</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select> 
                        </div>
                    </div> 
                    <div className="row">
                        <p className="labels">Deadline:</p>
                        <input 
                            type="date" 
                            name="endDate"
                            onChange={handleChange}
                            value={state.newTask.endDate}
                        />
                    </div>
                    <div className="row">
                    <input type="submit" onClick={handleAdd} disabled={!isSubmittable(state.newTask.name && state.newTask.description && state.newTask.endDate && state.newTask.priority)} value={state.editMode ? 'Save' : 'Add'}></input>
                    </div>
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
                                    <b onClick={() => {
                                        toggleDescription(i)
                                    }}>
                                        {task.name}
                                    </b>
                                </div>
                                <div className="options">
                                    <span className="edit" onClick={() => {
                                        handleEdit(i)
                                    }}>
                                        {'[Edit]'}
                                    </span>
                                    <span className="delete" onClick={() => {
                                        handleRemove(i)
                                    }}>
                                        {'[Delete]'}
                                    </span>
                                </div>
                            </div>
                        {task.visibleDescription ?
                                <p className="row">
                                    {task.description}
                                </p>
                                :
                                <>
                                </>   
                            }
                        </li>
                    )}
                </ul>
            </div>
        </div>     
    )
}

export default Home;