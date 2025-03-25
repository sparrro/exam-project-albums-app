import "./InputFieldList.css";
import { useState } from "react";

function InputFieldList() {

    const [fields, setFields] = useState([{id: Date.now(), value: ""}]);

    const addField = () => {
        setFields([...fields, {id: Date.now(), value: ""}]);
    }

    const removeField = (id: number) => {
        setFields(fields.filter((field) => field.id !== id));
    }

    const handleInputChange = (id: number, newValue: string) => {
        setFields(fields.map(field => 
            field.id === id ? {...field, value: newValue} : field
        ));
    }

    return(
        <section className="tag-input-list">
            <ul>
                {fields.map((field) => (
                    <li key={field.id}>
                        <input
                        type="text"
                        value={field.value}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        />
                        <button onClick={() => removeField(field.id)}>-</button>
                    </li>
                ))}
            </ul>
            <button onClick={addField}>+</button>
        </section>
    );
}

export default InputFieldList;