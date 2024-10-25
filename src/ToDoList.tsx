import { useState, useEffect } from 'react';

const ToDoList: React.FC = () => {

    const [items, setItems] = useState<string[]>(() => {
        return JSON.parse(localStorage.getItem('items') || '[]');
    });

    const addItem = (): void => {
        const newItem: string = (document.getElementById("itemTextBox") as HTMLInputElement).value;
        if (newItem !== "") {
            setItems(i => [...i, newItem]);
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
    
    return (
    <div>
        <div>
            <input type="text" id="itemTextBox"></input>
            <button onClick={addItem}>Add item</button>
        </div>
        <div>
            {items.map((item, index) =>
                <li key={index}>
                    {item}
                    <button onClick={() => deleteItem(index)}>❌</button>
                </li>
                
            )}
        </div>
    </div>
    );
}

export default ToDoList