import { useState, useEffect } from 'react';

const ToDoList: React.FC = () => {

    interface Item {
        text: string;
        isCompleted: boolean;
    }

    const [items, setItems] = useState<Item[]>(() => {
        return JSON.parse(localStorage.getItem('items') || '[]');
    });

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
        setItems(prevItems => 
            prevItems.map((item, i) => 
              i === index ? { ...item, isCompleted: !item.isCompleted } : item
            )
          );    
    }

    return (
    <div>
        <div>
            <input type="text" id="itemTextBox"></input>
            <button onClick={addItem}>Add item</button>
        </div>
        <div>
            {items.map((item: Item, index: number) =>
                <li key={index}>
                    <input  
                        type="checkbox" 
                        checked={item.isCompleted}
                        onChange={() => toggleCompletion(index)}
                    />
                    <span>{item.text}</span>
                    <button onClick={() => deleteItem(index)}>❌</button>
                </li>
                
            )}
        </div>
    </div>
    );
}

export default ToDoList