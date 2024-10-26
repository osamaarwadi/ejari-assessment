import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './ToDoList.css'; 

const ToDoList: React.FC = () => {

    interface Item {
        id: string;
        text: string;
        isCompleted: boolean;
    }

    const [items, setItems] = useState<Item[]>(() => {
        return JSON.parse(localStorage.getItem('items') || '[]');
    });

    enum FilterType { all, pending, completed };

    const [filter, setFilter] = useState<FilterType>(FilterType.all);

    const filterItems = (): Item[] => {
        switch (filter) {
            case FilterType.all:
                return items;
            case FilterType.pending:
                return items.filter(item => !item.isCompleted);
            case FilterType.completed:
                return items.filter(item => item.isCompleted);
        }
    }

    const addItem = (): void => {
        const newItem: Item = { id: uuidv4(),
                                text: (document.getElementById("itemTextBox") as HTMLInputElement).value, 
                                isCompleted: false };
        if (newItem.text !== "") {
            setItems(prevItems => [...prevItems, newItem]);
        }
        else {
            console.log("Please enter a task.");
        }
        (document.getElementById("itemTextBox") as HTMLInputElement).value = "";
    }

    useEffect(() => {
        localStorage.setItem('items', JSON.stringify(items));
    }, [items]);
    
    const deleteItem = (id: string): void => {
        setItems(items.filter((item) => item.id !== id));
    }
    
    const toggleCompletion = (id: string): void => {
        setItems(prevItems => prevItems.map((item) => item.id === id ? { ...item, isCompleted: !item.isCompleted } : item));    
    }

    const updateFilter = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        setFilter(FilterType[event.target.value as keyof typeof FilterType]);
    }

    return (
    <div>
        <div>
            <input type="text" id="itemTextBox"></input>
            <button onClick={addItem}>Add item</button>
        </div>
        <div>
            <label htmlFor="filter">Filter: </label>
            <select name="filter" onChange={(e) => updateFilter(e)}>
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
                        checked={item.isCompleted}
                        onChange={() => toggleCompletion(item.id)}
                    />
                    <span className={item.isCompleted ? "completed-item" : ""}> {item.text} </span>
                    <button onClick={() => deleteItem(item.id)}>❌</button>
                </li>
            )}
            </ul>
        </div>
    </div>
    );
}

export default ToDoList