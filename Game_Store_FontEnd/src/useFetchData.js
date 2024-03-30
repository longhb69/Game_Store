import axios from 'axios';
import { useState, useEffect } from 'react';

export default function useFetchData(url, authToken = null) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [publisher, setPublisher] = useState(null);
    const [categories, setCategories] = useState(null);
    const [next, setNext] = useState(null);
    const [pre, setPre] = useState(null);
    const fetchData = async (url) => {
        setLoading(true)
        const headers = authToken ? {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + authToken, 
            },
        } : {};
        axios.get(url, headers).then((response) => {
            if(response.data.games) {
                setData(response.data.games)
            }
            else {
                if(response.data.results) {
                    setData((prevData) => [...prevData,...response.data.results])
                    setNext(response.data.next)
                    setPre(response.data.pre)
                } else {
                    setData(response.data)
                }
            }
            if(response.data.publisher) setPublisher(response.data.publisher.name)
            if(response.data.categories) setCategories(response.data.categories)
        })
        .catch((err) => {
            setError(err);
        }).finally(() => {
            setLoading(false);
        })
    }

    useEffect(() => {
        fetchData(url);
    }, [url]);

    const refetch = (url, authToken = null) => {
        fetchData(url, authToken);
    };
    return {data, loading, error, refetch, next, pre, publisher,categories};
}


// In a React application, you can apply the Command Pattern concept to organize and decouple data fetching logic. 
// While React itself doesn't explicitly implement the Command Pattern, you can create components or custom hooks that encapsulate the logic for fetching data. 
// These components or hooks can act as "commands" that you can use in different parts of your application.