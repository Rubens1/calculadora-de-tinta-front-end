import axios from "axios";
import { useState } from "react";

export default function Form() {
    const [walls, setWalls] = useState([
        { height: 0, width: 0, doors: 0, windows: 0 },
        { height: 0, width: 0, doors: 0, windows: 0 },
        { height: 0, width: 0, doors: 0, windows: 0 },
        { height: 0, width: 0, doors: 0, windows: 0 }
    ]);

    const [result, setResult] = useState(null);

    function handleChange(e, index) {
        const { name, value } = e.target;
        const updatedWalls = [...walls];
        updatedWalls[index][name] = parseFloat(value);
        setWalls(updatedWalls);
    }

    function calculatePaint(e) {
        e.preventDefault();
        axios.post('http://localhost:5500/calculate', { 
            walls: walls.map(wall => ({ height: wall.height, width: wall.width })), 
            doors: walls.map(wall => wall.doors),
            windows: walls.map(wall => wall.windows)
        })
        .then(response => {
            setResult(response.data);
        })
        .catch(error => console.error('Error:', error));
    }

    return (
        <div className="form-digital">
            <div className="container">
                <h1>Calculadora de Tinta</h1>
                <form onSubmit={(e) => calculatePaint(e)}>
                    {walls.map((wall, index) => (
                        <div key={index} className="form-inputs">
                            <div className="title">
                                <h2>Parede {index + 1}</h2>
                            </div>
                            <div className="container-inputs">
                                <div className="inputs">
                                    <label htmlFor={`height${index}`}>Altura (m):</label>
                                    <input 
                                        type="number" 
                                        id={`height${index}`} 
                                        name="height" 
                                        value={wall.height} 
                                        onChange={(e) => handleChange(e, index)} 
                                        required 
                                    />
                                    <label htmlFor={`width${index}`}>Largura (m):</label>
                                    <input 
                                        type="number" 
                                        id={`width${index}`} 
                                        name="width" 
                                        value={wall.width} 
                                        onChange={(e) => handleChange(e, index)} 
                                        required 
                                    />
                                </div>
                                <div className="inputs">
                                    <label htmlFor={`doors${index}`}>Portas:</label>
                                    <input 
                                        type="number" 
                                        id={`doors${index}`} 
                                        name="doors" 
                                        value={wall.doors} 
                                        onChange={(e) => handleChange(e, index)} 
                                        required 
                                    />
                                    <label htmlFor={`windows${index}`}>Janelas:</label>
                                    <input 
                                        type="number" 
                                        id={`windows${index}`} 
                                        name="windows" 
                                        value={wall.windows} 
                                        onChange={(e) => handleChange(e, index)} 
                                        required 
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button type="submit">Calcular</button>
                </form>
                {result && (
                    <div className="result">
                        <p>Área total: {result.totalArea.toFixed(2)} m²</p>
                        <p>Tinta necessária: {result.paintNeeded.toFixed(2)} litros</p>
                        <p>Latas sugeridas:</p>
                        <ul>
                            {result.cans.map((can, index) => (
                                <li key={index}>{can.count} latas de {can.size}L</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
