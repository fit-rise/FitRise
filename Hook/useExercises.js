import { useState, useEffect } from 'react';
import axios from 'axios';

const useExercises = (type) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises', {
          params: { 
            type: type,
            language:'ko',
            limit:'30',
          },
          headers: { 
            'X-RapidAPI-Key': 'c77c44f3demsh76b07e577878210p1cafecjsnba5f1c286597',
            'X-RapidAPI-Host': 'exercises-by-api-ninjas.p.rapidapi.com'
          }
        });
        setExercises(response.data);
      } catch (error) {
        setError(error);
        console.log(error);
      }
      setLoading(false);
    };

    fetchData();
  }, [type]);

  return { exercises, loading, error };
};

export default useExercises;
