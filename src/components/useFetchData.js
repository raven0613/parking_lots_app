import { useState, useEffect } from 'react';

export function useFetchData (getData, time) {
    const [data, setData] = useState(null)
    const [isFetching, setIsFetching] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchData () {
            try {
                if (!getData) return
                setIsFetching(true)
                const response = await getData()

                if (!response) return
                setData(response)
            
                setIsFetching(false)
            } 
            catch (error) {
                setIsFetching(false)
                console.log(error)
                setError(error)
            }
        }
        fetchData()
        
        const interval = setInterval(() => {
            fetchData()
        }, time)

        return () => {
            setIsFetching(false)
            clearInterval(interval)
        }
    }, [getData, time])
    return { data, isFetching, error }
}