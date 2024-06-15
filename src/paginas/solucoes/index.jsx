import { useEffect, useState } from "react";
import "./style.css";
import Api from "../../utils/api";

export default function Solucoes() {
    const api = new Api("http://localhost:8080");
    const [response, setResponse] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.get('/produtos');
                setResponse(data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, [api]);

    return (
        <div>
            <h1>SOLUÇÕES:</h1>
            <pre>{JSON.stringify(response)}</pre>
        </div>
    );
}
