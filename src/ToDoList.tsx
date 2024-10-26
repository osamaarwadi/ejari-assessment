import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import './ToDoList.css'; 

const ToDoList: React.FC = () => {

    interface Item {
        id: string;
        title: string;
        completed: boolean;
    }

    enum FilterType { all, pending, completed };

    const [items, setItems] = useState<Item[]>(() => {
        return JSON.parse(localStorage.getItem('items') || '[]');    
    });

    const [filter, setFilter] = useState<FilterType>(FilterType.all);

    useEffect(() => {
        if (!isLoaded.current) {
            loadPlaceholderItems();
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('items', JSON.stringify(items));
    }, [items]);
    
    const inputRef = useRef<HTMLInputElement>(null);
    const isLoaded = useRef<boolean>(localStorage.getItem('initialLoadStatus') === "done");

    const loadPlaceholderItems = async(): Promise<void> => {
        try {
            const response = await axios.get('https://jsonplaceholder.typicode.com/users/1/todos');
            const newItems: Item[] = response.data.map((item: Item) => ({
                id: item.id,
                title: item.title,
                completed: item.completed,
            }));
            setItems(newItems);
            localStorage.setItem('items', JSON.stringify(newItems));
            localStorage.setItem('initialLoadStatus', "done");
        } catch (err) {
            console.log(err);
        }
    }

    const addItem = (): void => {
        const newItem: Item = { id: uuidv4(),
                                title: inputRef.current?.value || "", 
                                completed: false };
        if (newItem.title !== "") {
            setItems(prevItems => [...prevItems, newItem]);
        }
        else {
            console.log("Please enter a task.");
        }
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    const deleteItem = (id: string): void => {
        setItems(items.filter((item) => item.id !== id));
    }
    
    const toggleCompletion = (id: string): void => {
        setItems(prevItems => prevItems.map((item) => item.id === id ? { ...item, completed: !item.completed } : item));    
    }

    const filterItems = (): Item[] => {
        switch (filter) {
            case FilterType.all:
                return items;
            case FilterType.pending:
                return items.filter(item => !item.completed);
            case FilterType.completed:
                return items.filter(item => item.completed);
        }
    }

    const updateFilter = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        setFilter(FilterType[event.target.value as keyof typeof FilterType]);
    }

    return (
    <div>
        <div>
            <input type="text" ref={ inputRef }></input>
            <button onClick={addItem}>Add item</button>
        </div>
        <div>
            <label htmlFor="filter">Filter: </label>
            <select id="filter" onChange={(e) => updateFilter(e)}>
                <option value="all">Show All</option>
                <option value="pending">Pending only</option>
                <option value="completed">Completed only</option>
            </select>
        </div>
        <div>
            <ul>
            {filterItems().map((item: Item) =>
                <li key={item.id}>
                    <input
                        type="checkbox" 
                        checked={item.completed}
                        onChange={() => toggleCompletion(item.id)}
                    />
                    <span className={item.completed ? "completed-item" : ""}> {item.title} </span>
                    <button onClick={() => deleteItem(item.id)}>❌</button>
                </li>
            )}
            </ul>
        </div>
    </div>
    );
}

export default ToDoList