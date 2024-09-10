import { useState, useEffect } from 'react';

// Custom hook for fetching Kill Team data
export const useKillTeams = () => {
  const [killTeams, setKillTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchKillTeams = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://raw.githubusercontent.com/vjosset/killteamjson/main/compendium.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
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

  return { killTeams, isLoading, error, fetchKillTeams };
};
