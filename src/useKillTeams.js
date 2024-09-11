import { useState, useEffect } from 'react';
import axios from 'axios';

// Custom hook for fetching Kill Team data
export const useKillTeams = () => {
  const [killTeams, setKillTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchKillTeams = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://raw.githubusercontent.com/vjosset/killteamjson/main/compendium.json', {
        responseType: 'json',
        responseEncoding: 'utf8',
        validateStatus: () => true,
      });

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = response.data;

      if (!Array.isArray(data)) {
        throw new Error('Data structure is not as expected: root should be an array');
      }

      const teams = data.flatMap(faction => 
        faction.killteams ? faction.killteams.map(team => ({
          ...team,
          factionName: faction.factionname
        })) : []
      );
      
      if (teams.length === 0) {
        throw new Error('No kill teams found in the data');
      }

      setKillTeams(teams);
    } catch (error) {
      setError(`Error fetching kill teams: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKillTeams();
  }, []);

  useEffect(() => {
    fetchKillTeams();
  }, []);

  return { killTeams, isLoading, error, fetchKillTeams };
};
