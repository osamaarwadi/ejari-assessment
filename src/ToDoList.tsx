import { useState } from 'react';

const ToDoList: React.FC = () => {

    const [items, setItems] = useState<string[]>(["Item 1", "Item 2", "Item 3"]);

    const addItem = (): void => {
        const _newItem: string = (document.getElementById("itemTextBox") as HTMLInputElement).value;
        if (_newItem !== "") {
            setItems(i => [...i, _newItem]);
        }
        else {
            console.log("Please enter a task.")
        }
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
                </li> 
            )}
        </div>
    </div>
    );
}

export default ToDoList