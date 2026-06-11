export interface Ability {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface MatchStats {
  appearances: number;
  goals: number;
  assists: number;
  keyPasses: number;
  interceptions: number;
  rating: number;
  cleanSheets?: number;
  passSuccess?: number;
  tackles?: number;
  distance?: number;
  recentRatings?: number[];
}

export interface Player {
  id: string;
  name: string;
  englishName: string;
  avatarUrl: string;
  teamId: string;
  teamName: string;
  age: number;
  position: 'FW' | 'MF' | 'DF' | 'GK';
  positionName: string;
  club: string;
  marketValue: number;
  commercialValue: number;
  isStar: boolean;
  shirtNumber: number;
  ability: Ability;
  matchStats: MatchStats;
}

export interface QualifierNode {
  stage: string;
  opponent: string;
  score: string;
  status: 'win' | 'draw' | 'loss';
  desc: string;
}

export interface FormationPlayer {
  positionId: string;
  role: string;
  playerName: string;
  coord: { x: number; y: number };
}

export interface Formation {
  name: string;
  positions: FormationPlayer[];
}

export interface TeamHistoryStats {
  appearances: number;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
}

export interface Team {
  id: string;
  name: string;
  logoUrl: string;
  region: string;
  strengthRank: number;
  bestRecord: string;
  historyStats: TeamHistoryStats;
  qualifierRoad: QualifierNode[];
  formation: Formation;
}

export interface WorldCupDataset {
  teams: Team[];
  players: Player[];
}

export interface TheSportsDBTeam {
  idTeam: string;
  strTeam: string;
  strTeamShort: string;
  strBadge: string;
  strLogo: string;
  strSport: string;
  strLeague: string;
  idLeague: string;
}

export interface TheSportsDBEvent {
  idEvent: string;
  strEvent: string;
  strEventAlternate: string;
  strSeason: string;
  idLeague: string;
  strLeague: string;
  strHomeTeam: string;
  strAwayTeam: string;
  idHomeTeam: string;
  idAwayTeam: string;
  intRound: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strTimestamp: string;
  dateEvent: string;
  strTime: string;
  strVenue: string;
  strCountry: string;
  strHomeTeamBadge: string;
  strAwayTeamBadge: string;
  strStatus: string;
}

export interface FIFARanking {
  rank: number;
  teamId: string;
  teamName: string;
  points: number;
  change: number;
}

export interface PlayerDatabase {
  id: string;
  name: string;
  englishName: string;
  teamId: string;
  teamName: string;
  age: number;
  position: 'FW' | 'MF' | 'DF' | 'GK';
  positionName: string;
  club: string;
  marketValue: number;
  commercialValue: number;
  isStar: boolean;
  shirtNumber: number;
  avatarUrl?: string;
}
