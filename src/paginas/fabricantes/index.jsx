import { useEffect, useState } from "react";
import "./style.css";
import Api from "../../utils/api";

export default function Fabricantes() {
    const api = new Api("http://20.186.19.140:80/api");
    const [response, setResponse] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.get('/fabricantes');
                setResponse(data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, [api]);

    return (
        <div>
            <h1>FABRICANTES:</h1>
            <pre>{JSON.stringify(response)}</pre>
        </div>
    );
}
