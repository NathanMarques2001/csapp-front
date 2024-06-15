import { useEffect, useState } from "react";
import "./style.css";
import Api from "../../utils/api";
import Navbar from "../../componetes/navbar";

export default function Contratos() {
    const api = new Api("http://localhost:8080");
    const [response, setResponse] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.get('/contratos');
                setResponse(data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, [api]);

    return (
        <div>
            <Navbar />
            <h1>CONTRATOS:</h1>
            <pre>{JSON.stringify(response)}</pre>
        </div>
    );
}
