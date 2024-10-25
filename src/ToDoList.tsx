import { useState, useEffect } from 'react';
import './ToDoList.css'; 

const ToDoList: React.FC = () => {

    interface Item {
        text: string;
        isCompleted: boolean;
    }

    const [items, setItems] = useState<Item[]>(() => {
        return JSON.parse(localStorage.getItem('items') || '[]');
    });

    enum FilterType { all, pending, completed };

    const [filter, setFilter] = useState<FilterType>(FilterType.pending);

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
        const newItem: Item = { text: (document.getElementById("itemTextBox") as HTMLInputElement).value, 
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
    
    const deleteItem = (index: number): void => {
        setItems(items.filter((_, i) => i !== index));
    }
    
    const toggleCompletion = (index: number): void => {
        setItems(prevItems => prevItems.map((item, i) => i === index ? { ...item, isCompleted: !item.isCompleted } : item));    
    }

    const updateFilter = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        return setFilter(FilterType[event.target.value as keyof typeof FilterType]);
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
            {filterItems().map((item: Item, index: number) =>
                <li key={index}>
                    <input
                        type="checkbox" 
                        checked={item.isCompleted}
                        onChange={() => toggleCompletion(index)}
                    />
                    <span className={item.isCompleted ? "completed-item" : ""}> {item.text} </span>
                    <button onClick={() => deleteItem(index)}>❌</button>
                </li>
            )}
        </div>
    </div>
    );
}

export default ToDoList