import { TheSportsDBTeam, TheSportsDBEvent } from '../types/worldCup';

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';

const cache = new Map<string, unknown>();

async function fetchWithCache<T>(url: string): Promise<T> {
  if (cache.has(url)) {
    return cache.get(url) as T;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    cache.set(url, data);
    return data;
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    throw error;
  }
}

export async function searchTeam(teamName: string): Promise<TheSportsDBTeam[]> {
  const data = await fetchWithCache<{ teams: TheSportsDBTeam[] | null }>(
    `${BASE_URL}/searchteams.php?t=${encodeURIComponent(teamName)}`
  );
  return data.teams || [];
}

export async function getWorldCup2026Events(): Promise<TheSportsDBEvent[]> {
  const data = await fetchWithCache<{ events: TheSportsDBEvent[] }>(
    `${BASE_URL}/eventsseason.php?id=4429&s=2026`
  );
  return data.events || [];
}

export async function getTeamById(teamId: string): Promise<TheSportsDBTeam | null> {
  const data = await fetchWithCache<{ teams: TheSportsDBTeam[] | null }>(
    `${BASE_URL}/lookupteam.php?id=${teamId}`
  );
  return data.teams?.[0] || null;
}

export async function getEventsByTeam(teamId: string): Promise<TheSportsDBEvent[]> {
  const data = await fetchWithCache<{ events: TheSportsDBEvent[] }>(
    `${BASE_URL}/eventslast.php?id=${teamId}`
  );
  return data.events || [];
}
