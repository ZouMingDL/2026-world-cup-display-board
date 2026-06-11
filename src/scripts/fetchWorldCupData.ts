import { getWorldCup2026Events, searchTeam } from '../services/api';
import { TheSportsDBEvent, TheSportsDBTeam } from '../types/worldCup';

export interface WorldCupTeam {
  id: string;
  name: string;
  shortName: string;
  badge: string;
  logo: string;
  league: string;
}

export interface WorldCupMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamBadge: string;
  awayTeamBadge: string;
  date: string;
  time: string;
  venue: string;
  country: string;
  round: string;
  status: string;
  homeScore: string | null;
  awayScore: string | null;
}

const TEAM_NAME_MAP: Record<string, string> = {
  'Argentina': '阿根廷',
  'France': '法国',
  'England': '英格兰',
  'Brazil': '巴西',
  'Belgium': '比利时',
  'Netherlands': '荷兰',
  'Portugal': '葡萄牙',
  'Spain': '西班牙',
  'Croatia': '克罗地亚',
  'Italy': '意大利',
  'Germany': '德国',
  'Japan': '日本',
  'Morocco': '摩洛哥',
  'USA': '美国',
  'United States': '美国',
  'Uruguay': '乌拉圭',
  'Colombia': '哥伦比亚',
  'Mexico': '墨西哥',
  'Senegal': '塞内加尔',
  'Ecuador': '厄瓜多尔',
  'Australia': '澳大利亚',
  'South Korea': '韩国',
  'Serbia': '塞尔维亚',
  'Switzerland': '瑞士',
  'Tunisia': '突尼斯',
  'Nigeria': '尼日利亚',
  'Paraguay': '巴拉圭',
  'Czech Republic': '捷克',
  'Sweden': '瑞典',
  'Turkey': '土耳其',
  'Iran': '伊朗',
  'South Africa': '南非',
  'Qatar': '卡塔尔',
  'Ukraine': '乌克兰',
  'Greece': '希腊',
  'Canada': '加拿大',
  'Ivory Coast': '科特迪瓦',
  'Scotland': '苏格兰',
  'Bosnia-Herzegovina': '波黑',
  'Haiti': '海地',
  'Curaçao': '库拉索',
  'Cape Verde': '佛得角',
  'Saudi Arabia': '沙特阿拉伯',
  'Cameroon': '喀麦隆',
  'Ghana': '加纳',
  'Jamaica': '牙买加',
  'New Zealand': '新西兰',
  'Panama': '巴拿马',
  'Indonesia': '印度尼西亚',
  'Algeria': '阿尔及利亚',
  'Angola': '安哥拉',
  'Bolivia': '玻利维亚',
  'Burkina Faso': '布基纳法索',
  'Chile': '智利',
  'China': '中国',
  'Costa Rica': '哥斯达黎加',
  'Cuba': '古巴',
  'DR Congo': '刚果民主共和国',
  'Guatemala': '危地马拉',
  'Guinea': '几内亚',
  'Honduras': '洪都拉斯',
  'Iraq': '伊拉克',
  'Ireland': '爱尔兰',
  'Israel': '以色列',
  'Kenya': '肯尼亚',
  'Kosovo': '科索沃',
  'Lebanon': '黎巴嫩',
  'Libya': '利比亚',
  'Madagascar': '马达加斯加',
  'Mali': '马里',
  'Mauritania': '毛里塔尼亚',
  'Moldova': '摩尔多瓦',
  'Montenegro': '黑山',
  'Mozambique': '莫桑比克',
  'Namibia': '纳米比亚',
  'Niger': '尼日尔',
  'North Macedonia': '北马其顿',
  'Norway': '挪威',
  'Oman': '阿曼',
  'Palestine': '巴勒斯坦',
  'Peru': '秘鲁',
  'Poland': '波兰',
  'Romania': '罗马尼亚',
  'Russia': '俄罗斯',
  'Rwanda': '卢旺达',
  'Sierra Leone': '塞拉利昂',
  'Slovakia': '斯洛伐克',
  'Slovenia': '斯洛文尼亚',
  'Somalia': '索马里',
  'Sudan': '苏丹',
  'Syria': '叙利亚',
  'Tanzania': '坦桑尼亚',
  'Thailand': '泰国',
  'Uganda': '乌干达',
  'United Arab Emirates': '阿联酋',
  'Uzbekistan': '乌兹别克斯坦',
  'Venezuela': '委内瑞拉',
  'Zambia': '赞比亚',
  'Zimbabwe': '津巴布韦',
};

const TEAM_ID_MAP: Record<string, string> = {
  'Argentina': 'ARG',
  'France': 'FRA',
  'England': 'ENG',
  'Brazil': 'BRA',
  'Belgium': 'BEL',
  'Netherlands': 'NED',
  'Portugal': 'POR',
  'Spain': 'ESP',
  'Croatia': 'CRO',
  'Italy': 'ITA',
  'Germany': 'GER',
  'Japan': 'JPN',
  'Morocco': 'MAR',
  'USA': 'USA',
  'United States': 'USA',
  'Uruguay': 'URU',
  'Colombia': 'COL',
  'Mexico': 'MEX',
  'Senegal': 'SEN',
  'Ecuador': 'ECU',
  'Australia': 'AUS',
  'South Korea': 'KOR',
  'Serbia': 'SRB',
  'Switzerland': 'SUI',
  'Tunisia': 'TUN',
  'Nigeria': 'NGA',
  'Paraguay': 'PAR',
  'Czech Republic': 'CZE',
  'Sweden': 'SWE',
  'Turkey': 'TUR',
  'Iran': 'IRN',
  'South Africa': 'RSA',
  'Qatar': 'QAT',
  'Ukraine': 'UKR',
  'Greece': 'GRE',
  'Canada': 'CAN',
  'Ivory Coast': 'CIV',
  'Scotland': 'SCO',
  'Bosnia-Herzegovina': 'BOS',
  'Haiti': 'HAI',
  'Curaçao': 'CUR',
  'Cape Verde': 'CPV',
  'Saudi Arabia': 'KSA',
};

export function getTeamId(englishName: string): string {
  return TEAM_ID_MAP[englishName] || englishName.substring(0, 3).toUpperCase();
}

export function getTeamChineseName(englishName: string): string {
  return TEAM_NAME_MAP[englishName] || englishName;
}

export async function fetchAllTeams(): Promise<WorldCupTeam[]> {
  const events = await getWorldCup2026Events();
  const teamMap = new Map<string, WorldCupTeam>();

  for (const event of events) {
    if (!teamMap.has(event.strHomeTeam)) {
      teamMap.set(event.strHomeTeam, {
        id: getTeamId(event.strHomeTeam),
        name: getTeamChineseName(event.strHomeTeam),
        shortName: event.strHomeTeam,
        badge: event.strHomeTeamBadge,
        logo: event.strHomeTeamBadge,
        league: event.strLeague,
      });
    }
    if (!teamMap.has(event.strAwayTeam)) {
      teamMap.set(event.strAwayTeam, {
        id: getTeamId(event.strAwayTeam),
        name: getTeamChineseName(event.strAwayTeam),
        shortName: event.strAwayTeam,
        badge: event.strAwayTeamBadge,
        logo: event.strAwayTeamBadge,
        league: event.strLeague,
      });
    }
  }

  return Array.from(teamMap.values());
}

export async function fetchAllMatches(): Promise<WorldCupMatch[]> {
  const events = await getWorldCup2026Events();

  return events.map(event => ({
    id: event.idEvent,
    homeTeam: getTeamChineseName(event.strHomeTeam),
    awayTeam: getTeamChineseName(event.strAwayTeam),
    homeTeamBadge: event.strHomeTeamBadge,
    awayTeamBadge: event.strAwayTeamBadge,
    date: event.dateEvent,
    time: event.strTime,
    venue: event.strVenue,
    country: event.strCountry,
    round: event.intRound,
    status: event.strStatus,
    homeScore: event.intHomeScore,
    awayScore: event.intAwayScore,
  }));
}

export async function fetchTeamDetails(teamName: string): Promise<TheSportsDBTeam | null> {
  const teams = await searchTeam(teamName);
  return teams[0] || null;
}
