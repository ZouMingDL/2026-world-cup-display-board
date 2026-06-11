import { FIFARanking } from '../types/worldCup';

export const fifaRankings: FIFARanking[] = [
  { rank: 1, teamId: 'ARG', teamName: '阿根廷', points: 1858.25, change: 0 },
  { rank: 2, teamId: 'FRA', teamName: '法国', points: 1832.48, change: 0 },
  { rank: 3, teamId: 'ENG', teamName: '英格兰', points: 1811.34, change: 1 },
  { rank: 4, teamId: 'BRA', teamName: '巴西', points: 1789.67, change: -1 },
  { rank: 5, teamId: 'BEL', teamName: '比利时', points: 1758.92, change: 0 },
  { rank: 6, teamId: 'NED', teamName: '荷兰', points: 1742.15, change: 2 },
  { rank: 7, teamId: 'POR', teamName: '葡萄牙', points: 1738.54, change: -1 },
  { rank: 8, teamId: 'ESP', teamName: '西班牙', points: 1725.89, change: -1 },
  { rank: 9, teamId: 'CRO', teamName: '克罗地亚', points: 1712.34, change: 0 },
  { rank: 10, teamId: 'ITA', teamName: '意大利', points: 1698.76, change: 0 },
  { rank: 11, teamId: 'GER', teamName: '德国', points: 1685.23, change: 1 },
  { rank: 12, teamId: 'JPN', teamName: '日本', points: 1672.45, change: 2 },
  { rank: 13, teamId: 'MAR', teamName: '摩洛哥', points: 1658.91, change: -2 },
  { rank: 14, teamId: 'USA', teamName: '美国', points: 1645.67, change: -1 },
  { rank: 15, teamId: 'URU', teamName: '乌拉圭', points: 1632.34, change: 0 },
  { rank: 16, teamId: 'COL', teamName: '哥伦比亚', points: 1618.89, change: 1 },
  { rank: 17, teamId: 'MEX', teamName: '墨西哥', points: 1605.45, change: -1 },
  { rank: 18, teamId: 'SEN', teamName: '塞内加尔', points: 1592.12, change: 0 },
  { rank: 19, teamId: 'ECU', teamName: '厄瓜多尔', points: 1578.78, change: 1 },
  { rank: 20, teamId: 'AUS', teamName: '澳大利亚', points: 1565.34, change: -1 },
  { rank: 21, teamId: 'KOR', teamName: '韩国', points: 1552.01, change: 0 },
  { rank: 22, teamId: 'SRB', teamName: '塞尔维亚', points: 1538.67, change: 0 },
  { rank: 23, teamId: 'SUI', teamName: '瑞士', points: 1525.23, change: 1 },
  { rank: 24, teamId: 'TUN', teamName: '突尼斯', points: 1511.89, change: -1 },
  { rank: 25, teamId: 'NGA', teamName: '尼日利亚', points: 1498.45, change: 0 },
  { rank: 26, teamId: 'PAR', teamName: '巴拉圭', points: 1485.12, change: 1 },
  { rank: 27, teamId: 'CZE', teamName: '捷克', points: 1471.78, change: 2 },
  { rank: 28, teamId: 'SWE', teamName: '瑞典', points: 1458.34, change: -2 },
  { rank: 29, teamId: 'TUR', teamName: '土耳其', points: 1445.01, change: -1 },
  { rank: 30, teamId: 'IRN', teamName: '伊朗', points: 1431.67, change: 0 },
  { rank: 31, teamId: 'RSA', teamName: '南非', points: 1418.23, change: 0 },
  { rank: 32, teamId: 'QAT', teamName: '卡塔尔', points: 1404.89, change: 0 },
  { rank: 33, teamId: 'UKR', teamName: '乌克兰', points: 1391.45, change: 0 },
  { rank: 34, teamId: 'GRE', teamName: '希腊', points: 1378.12, change: 0 },
  { rank: 35, teamId: 'CAN', teamName: '加拿大', points: 1364.78, change: 0 },
  { rank: 36, teamId: 'CIV', teamName: '科特迪瓦', points: 1351.34, change: 0 },
  { rank: 37, teamId: 'SCO', teamName: '苏格兰', points: 1338.01, change: 0 },
  { rank: 38, teamId: 'BOS', teamName: '波黑', points: 1324.67, change: 0 },
  { rank: 39, teamId: 'HAI', teamName: '海地', points: 1311.23, change: 0 },
  { rank: 40, teamId: 'CUR', teamName: '库拉索', points: 1297.89, change: 0 },
  { rank: 41, teamId: 'CPV', teamName: '佛得角', points: 1284.45, change: 0 },
  { rank: 42, teamId: 'KSA', teamName: '沙特阿拉伯', points: 1271.12, change: 0 },
];

export function getTeamRanking(teamId: string): FIFARanking | undefined {
  return fifaRankings.find(r => r.teamId === teamId);
}

export function getRankingByPosition(rank: number): FIFARanking | undefined {
  return fifaRankings.find(r => r.rank === rank);
}
