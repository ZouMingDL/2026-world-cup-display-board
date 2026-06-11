import { fetchAllTeams, fetchAllMatches, getTeamId, getTeamChineseName } from './fetchWorldCupData';
import { fifaRankings } from '../data/fifaRankings';
import { playerDatabase } from '../data/playerDatabase';
import { Team, Player, WorldCupDataset, QualifierNode, Formation, FormationPlayer, TeamHistoryStats } from '../types/worldCup';

const TEAM_HISTORY: Record<string, TeamHistoryStats> = {
  ARG: { appearances: 18, matchesPlayed: 88, wins: 49, draws: 16, losses: 23 },
  FRA: { appearances: 16, matchesPlayed: 73, wins: 39, draws: 14, losses: 20 },
  ENG: { appearances: 16, matchesPlayed: 74, wins: 32, draws: 22, losses: 20 },
  BRA: { appearances: 22, matchesPlayed: 114, wins: 76, draws: 19, losses: 19 },
  BEL: { appearances: 14, matchesPlayed: 51, wins: 21, draws: 10, losses: 20 },
  NED: { appearances: 11, matchesPlayed: 55, wins: 27, draws: 14, losses: 14 },
  POR: { appearances: 8, matchesPlayed: 35, wins: 17, draws: 6, losses: 12 },
  ESP: { appearances: 16, matchesPlayed: 66, wins: 30, draws: 17, losses: 19 },
  CRO: { appearances: 7, matchesPlayed: 31, wins: 13, draws: 8, losses: 10 },
  ITA: { appearances: 18, matchesPlayed: 83, wins: 45, draws: 21, losses: 17 },
  GER: { appearances: 20, matchesPlayed: 109, wins: 67, draws: 20, losses: 22 },
  JPN: { appearances: 7, matchesPlayed: 25, wins: 7, draws: 6, losses: 12 },
  MAR: { appearances: 6, matchesPlayed: 23, wins: 8, draws: 6, losses: 9 },
  USA: { appearances: 11, matchesPlayed: 37, wins: 9, draws: 8, losses: 20 },
  URU: { appearances: 14, matchesPlayed: 57, wins: 25, draws: 13, losses: 19 },
  COL: { appearances: 6, matchesPlayed: 22, wins: 9, draws: 5, losses: 8 },
  MEX: { appearances: 17, matchesPlayed: 60, wins: 16, draws: 15, losses: 29 },
  SEN: { appearances: 3, matchesPlayed: 12, wins: 5, draws: 3, losses: 4 },
  ECU: { appearances: 4, matchesPlayed: 14, wins: 5, draws: 3, losses: 6 },
  AUS: { appearances: 6, matchesPlayed: 18, wins: 4, draws: 4, losses: 10 },
  KOR: { appearances: 11, matchesPlayed: 38, wins: 8, draws: 11, losses: 19 },
  SRB: { appearances: 13, matchesPlayed: 49, wins: 18, draws: 10, losses: 21 },
  SUI: { appearances: 12, matchesPlayed: 40, wins: 14, draws: 11, losses: 15 },
  TUN: { appearances: 6, matchesPlayed: 18, wins: 3, draws: 5, losses: 10 },
  NGA: { appearances: 6, matchesPlayed: 21, wins: 6, draws: 5, losses: 10 },
  PAR: { appearances: 8, matchesPlayed: 27, wins: 7, draws: 6, losses: 14 },
  CZE: { appearances: 9, matchesPlayed: 33, wins: 12, draws: 6, losses: 15 },
  SWE: { appearances: 12, matchesPlayed: 46, wins: 16, draws: 13, losses: 17 },
  TUR: { appearances: 2, matchesPlayed: 10, wins: 5, draws: 1, losses: 4 },
  IRN: { appearances: 6, matchesPlayed: 18, wins: 3, draws: 4, losses: 11 },
  RSA: { appearances: 3, matchesPlayed: 9, wins: 2, draws: 3, losses: 4 },
  QAT: { appearances: 1, matchesPlayed: 3, wins: 0, draws: 1, losses: 2 },
  UKR: { appearances: 1, matchesPlayed: 5, wins: 2, draws: 1, losses: 2 },
  GRE: { appearances: 3, matchesPlayed: 12, wins: 5, draws: 2, losses: 5 },
  CAN: { appearances: 2, matchesPlayed: 6, wins: 0, draws: 2, losses: 4 },
  CIV: { appearances: 3, matchesPlayed: 9, wins: 3, draws: 1, losses: 5 },
  SCO: { appearances: 9, matchesPlayed: 28, wins: 5, draws: 5, losses: 18 },
  BOS: { appearances: 1, matchesPlayed: 3, wins: 1, draws: 0, losses: 2 },
  HAI: { appearances: 1, matchesPlayed: 3, wins: 0, draws: 1, losses: 2 },
  CUR: { appearances: 0, matchesPlayed: 0, wins: 0, draws: 0, losses: 0 },
  CPV: { appearances: 0, matchesPlayed: 0, wins: 0, draws: 0, losses: 0 },
  KSA: { appearances: 6, matchesPlayed: 19, wins: 4, draws: 3, losses: 12 },
};

const TEAM_BEST_RECORD: Record<string, string> = {
  ARG: '三届冠军 (1978, 1986, 2022)',
  FRA: '两届冠军 (1998, 2018)',
  ENG: '一届冠军 (1966)',
  BRA: '五届冠军 (1958, 1962, 1970, 1994, 2002)',
  BEL: '季军 (2018)',
  NED: '亚军 (1974, 1978, 2010)',
  POR: '季军 (1966)',
  ESP: '冠军 (2010)',
  CRO: '亚军 (2018)',
  ITA: '四届冠军 (1934, 1938, 1982, 2006)',
  GER: '四届冠军 (1954, 1974, 1990, 2014)',
  JPN: '16强 (2002, 2010, 2018, 2022)',
  MAR: '第四名 (2022)',
  USA: '季军 (1930)',
  URU: '两届冠军 (1930, 1950)',
  COL: '八强 (2014)',
  MEX: '八强 (1970, 1986)',
  SEN: '八强 (2002)',
  ECU: '16强 (2006, 2022)',
  AUS: '16强 (2006, 2022)',
  KOR: '第四名 (2002)',
  SRB: '16强 (2018)',
  SUI: '八强 (1934, 1938, 1954)',
  TUN: '小组赛 (1978, 1998, 2002, 2006, 2018, 2022)',
  NGA: '16强 (1994, 1998, 2014)',
  PAR: '八强 (2010)',
  CZE: '亚军 (1934)',
  SWE: '亚军 (1958)',
  TUR: '季军 (2002)',
  IRN: '小组赛 (1978, 1998, 2006, 2014, 2018, 2022)',
  RSA: '小组赛 (2010)',
  QAT: '小组赛 (2022)',
  UKR: '八强 (2006)',
  GRE: '16强 (2014)',
  CAN: '小组赛 (1986, 2022)',
  CIV: '小组赛 (2006, 2010, 2014)',
  SCO: '小组赛 (1954, 1958, 1974, 1978, 1982, 1986, 1990, 1998)',
  BOS: '小组赛 (2014)',
  HAI: '小组赛 (1974)',
  CUR: '未参赛',
  CPV: '未参赛',
  KSA: '16强 (1994)',
};

const TEAM_REGION: Record<string, string> = {
  ARG: '南美洲',
  FRA: '欧洲',
  ENG: '欧洲',
  BRA: '南美洲',
  BEL: '欧洲',
  NED: '欧洲',
  POR: '欧洲',
  ESP: '欧洲',
  CRO: '欧洲',
  ITA: '欧洲',
  GER: '欧洲',
  JPN: '亚洲',
  MAR: '非洲',
  USA: '北中美及加勒比海',
  URU: '南美洲',
  COL: '南美洲',
  MEX: '北中美及加勒比海',
  SEN: '非洲',
  ECU: '南美洲',
  AUS: '亚洲',
  KOR: '亚洲',
  SRB: '欧洲',
  SUI: '欧洲',
  TUN: '非洲',
  NGA: '非洲',
  PAR: '南美洲',
  CZE: '欧洲',
  SWE: '欧洲',
  TUR: '欧洲',
  IRN: '亚洲',
  RSA: '非洲',
  QAT: '亚洲',
  UKR: '欧洲',
  GRE: '欧洲',
  CAN: '北中美及加勒比海',
  CIV: '非洲',
  SCO: '欧洲',
  BOS: '欧洲',
  HAI: '北中美及加勒比海',
  CUR: '北中美及加勒比海',
  CPV: '非洲',
  KSA: '亚洲',
};

function generateQualifierRoad(teamId: string): QualifierNode[] {
  const roads: Record<string, QualifierNode[]> = {
    ARG: [
      { stage: '南美区第1轮', opponent: '厄瓜多尔', score: '1-0', status: 'win', desc: '梅西标志性任意球破门，阿根廷全取三分' },
      { stage: '南美区第6轮', opponent: '巴西', score: '1-0', status: 'win', desc: '客场历史性击破桑巴军团主场' },
      { stage: '南美区第12轮', opponent: '秘鲁', score: '1-0', status: 'win', desc: '劳塔罗凌空斩制胜，提前锁定出线' },
      { stage: '南美区第16轮', opponent: '智利', score: '3-0', status: 'win', desc: '多点开花，强势宣告进军2026' },
    ],
    FRA: [
      { stage: '欧洲区A组', opponent: '荷兰', score: '4-0', status: 'win', desc: '姆巴佩双响，法国闪击郁金香' },
      { stage: '欧洲区A组', opponent: '爱尔兰', score: '1-0', status: 'win', desc: '帕瓦尔世界波，惊险客场取胜' },
      { stage: '欧洲区A组', opponent: '直布罗陀', score: '14-0', status: 'win', desc: '刷新法国队历史最大比分纪录' },
      { stage: '欧洲区A组', opponent: '荷兰', score: '2-1', status: 'win', desc: '姆巴佩梅开二度，客场出线' },
    ],
    ENG: [
      { stage: '欧洲区C组', opponent: '意大利', score: '2-1', status: 'win', desc: '赖斯建功，凯恩加冕射手王' },
      { stage: '欧洲区C组', opponent: '乌克兰', score: '2-0', status: 'win', desc: '凯恩与萨卡接连进球' },
      { stage: '欧洲区C组', opponent: '北马其顿', score: '7-0', status: 'win', desc: '萨卡帽子戏法，三狮军团大捷' },
      { stage: '欧洲区C组', opponent: '意大利', score: '3-1', status: 'win', desc: '凯恩双响，主场逆转苦主' },
    ],
    BRA: [
      { stage: '南美区第1轮', opponent: '玻利维亚', score: '5-1', status: 'win', desc: '罗德里戈双响，内马尔破门加冕射手王' },
      { stage: '南美区第2轮', opponent: '秘鲁', score: '1-0', status: 'win', desc: '马尔基尼奥斯读秒绝杀' },
      { stage: '南美区第8轮', opponent: '厄瓜多尔', score: '1-0', status: 'win', desc: '罗德里戈劲射制胜' },
      { stage: '南美区第14轮', opponent: '智利', score: '2-1', status: 'win', desc: '恩里克尾声绝杀锁定名额' },
    ],
    JPN: [
      { stage: '亚洲区第二阶段', opponent: '缅甸', score: '5-0', status: 'win', desc: '上田绮世帽子戏法' },
      { stage: '亚洲区第三阶段', opponent: '中国', score: '7-0', status: 'win', desc: '三笘薰多点闪击，创造队史最大比分' },
      { stage: '亚洲区第三阶段', opponent: '巴林', score: '5-0', status: 'win', desc: '客场顶住噪音干扰' },
      { stage: '亚洲区第三阶段', opponent: '沙特阿拉伯', score: '2-0', status: 'win', desc: '首次客场击退沙特' },
    ],
    POR: [
      { stage: '欧洲区J组', opponent: '波黑', score: '3-0', status: 'win', desc: 'B费双响，光明球场高歌猛进' },
      { stage: '欧洲区J组', opponent: '冰岛', score: '1-0', status: 'win', desc: 'C罗第200场里程碑绝杀' },
      { stage: '欧洲区J组', opponent: '斯洛伐克', score: '3-2', status: 'win', desc: 'C罗双响锁定胜局' },
      { stage: '欧洲区J组', opponent: '冰岛', score: '2-0', status: 'win', desc: '十战全胜历史最高分出线' },
    ],
  };

  return roads[teamId] || [
    { stage: '预选赛', opponent: '-', score: '-', status: 'win', desc: '成功晋级2026年世界杯' },
  ];
}

function generateFormation(teamId: string): Formation {
  const formations: Record<string, Formation> = {
    ARG: {
      name: '4-3-3',
      positions: [
        { positionId: 'GK', role: '门将', playerName: '达米安·马丁内斯', coord: { x: 50, y: 88 } },
        { positionId: 'LCB', role: '左中卫', playerName: '罗梅罗', coord: { x: 35, y: 72 } },
        { positionId: 'RCB', role: '右中卫', playerName: '奥塔门迪', coord: { x: 65, y: 72 } },
        { positionId: 'LB', role: '左后卫', playerName: '塔利亚菲科', coord: { x: 18, y: 65 } },
        { positionId: 'RB', role: '右后卫', playerName: '莫利纳', coord: { x: 82, y: 65 } },
        { positionId: 'DM', role: '防守中场', playerName: '恩佐·费尔南德斯', coord: { x: 50, y: 50 } },
        { positionId: 'LCM', role: '左中场', playerName: '麦卡利斯特', coord: { x: 32, y: 40 } },
        { positionId: 'RCM', role: '右中场', playerName: '德保罗', coord: { x: 68, y: 40 } },
        { positionId: 'LW', role: '左边锋', playerName: '阿尔瓦雷斯', coord: { x: 22, y: 20 } },
        { positionId: 'RW', role: '右边锋', playerName: '梅西', coord: { x: 78, y: 20 } },
        { positionId: 'CF', role: '中锋', playerName: '劳塔罗·马丁内斯', coord: { x: 50, y: 15 } },
      ],
    },
    FRA: {
      name: '4-2-3-1',
      positions: [
        { positionId: 'GK', role: '门将', playerName: '迈尼昂', coord: { x: 50, y: 88 } },
        { positionId: 'LCB', role: '左中卫', playerName: '萨利巴', coord: { x: 35, y: 72 } },
        { positionId: 'RCB', role: '右中卫', playerName: '于帕梅卡诺', coord: { x: 65, y: 72 } },
        { positionId: 'LB', role: '左后卫', playerName: '特奥·埃尔南德斯', coord: { x: 18, y: 65 } },
        { positionId: 'RB', role: '右后卫', playerName: '孔德', coord: { x: 82, y: 65 } },
        { positionId: 'LDM', role: '左防守中场', playerName: '楚阿梅尼', coord: { x: 38, y: 52 } },
        { positionId: 'RDM', role: '右防守中场', playerName: '卡马文加', coord: { x: 62, y: 52 } },
        { positionId: 'LAM', role: '左前腰', playerName: '姆巴佩', coord: { x: 22, y: 32 } },
        { positionId: 'CAM', role: '前腰', playerName: '格列兹曼', coord: { x: 50, y: 32 } },
        { positionId: 'RAM', role: '右前腰', playerName: '登贝莱', coord: { x: 78, y: 32 } },
        { positionId: 'CF', role: '中锋', playerName: '图拉姆', coord: { x: 50, y: 15 } },
      ],
    },
    ENG: {
      name: '4-2-3-1',
      positions: [
        { positionId: 'GK', role: '门将', playerName: '皮克福德', coord: { x: 50, y: 88 } },
        { positionId: 'LCB', role: '左中卫', playerName: '斯通斯', coord: { x: 35, y: 72 } },
        { positionId: 'RCB', role: '右中卫', playerName: '盖伊', coord: { x: 65, y: 72 } },
        { positionId: 'LB', role: '左后卫', playerName: '卢克·肖', coord: { x: 18, y: 65 } },
        { positionId: 'RB', role: '右后卫', playerName: '沃克', coord: { x: 82, y: 65 } },
        { positionId: 'LDM', role: '左防守中场', playerName: '赖斯', coord: { x: 38, y: 52 } },
        { positionId: 'RDM', role: '右防守中场', playerName: '梅努', coord: { x: 62, y: 52 } },
        { positionId: 'LAM', role: '左前腰', playerName: '福登', coord: { x: 22, y: 32 } },
        { positionId: 'CAM', role: '前腰', playerName: '贝林厄姆', coord: { x: 50, y: 32 } },
        { positionId: 'RAM', role: '右前腰', playerName: '萨卡', coord: { x: 78, y: 32 } },
        { positionId: 'CF', role: '中锋', playerName: '凯恩', coord: { x: 50, y: 15 } },
      ],
    },
    BRA: {
      name: '4-3-3',
      positions: [
        { positionId: 'GK', role: '门将', playerName: '阿利松', coord: { x: 50, y: 88 } },
        { positionId: 'LCB', role: '左中卫', playerName: '加布里埃尔', coord: { x: 35, y: 72 } },
        { positionId: 'RCB', role: '右中卫', playerName: '马尔基尼奥斯', coord: { x: 65, y: 72 } },
        { positionId: 'LB', role: '左后卫', playerName: '特莱斯', coord: { x: 18, y: 65 } },
        { positionId: 'RB', role: '右后卫', playerName: '达尼洛', coord: { x: 82, y: 65 } },
        { positionId: 'DM', role: '防守中场', playerName: '布鲁诺·吉马良斯', coord: { x: 50, y: 50 } },
        { positionId: 'LCM', role: '左中场', playerName: '帕奎塔', coord: { x: 32, y: 40 } },
        { positionId: 'RCM', role: '右中场', playerName: '卡塞米罗', coord: { x: 68, y: 40 } },
        { positionId: 'LW', role: '左边锋', playerName: '维尼修斯', coord: { x: 22, y: 20 } },
        { positionId: 'RW', role: '右边锋', playerName: '拉菲尼亚', coord: { x: 78, y: 20 } },
        { positionId: 'CF', role: '中锋', playerName: '恩德里克', coord: { x: 50, y: 15 } },
      ],
    },
    POR: {
      name: '4-3-3',
      positions: [
        { positionId: 'GK', role: '门将', playerName: '迪奥戈·科斯塔', coord: { x: 50, y: 88 } },
        { positionId: 'LCB', role: '左中卫', playerName: '鲁本·迪亚斯', coord: { x: 35, y: 72 } },
        { positionId: 'RCB', role: '右中卫', playerName: '安东尼奥·席尔瓦', coord: { x: 65, y: 72 } },
        { positionId: 'LB', role: '左后卫', playerName: '努诺·门德斯', coord: { x: 18, y: 65 } },
        { positionId: 'RB', role: '右后卫', playerName: '坎塞洛', coord: { x: 82, y: 65 } },
        { positionId: 'DM', role: '防守中场', playerName: '帕利尼亚', coord: { x: 50, y: 50 } },
        { positionId: 'LCM', role: '左中场', playerName: '维蒂尼亚', coord: { x: 32, y: 40 } },
        { positionId: 'RCM', role: '右中场', playerName: 'B·费尔南德斯', coord: { x: 68, y: 40 } },
        { positionId: 'LW', role: '左边锋', playerName: '莱奥', coord: { x: 22, y: 20 } },
        { positionId: 'RW', role: '右边锋', playerName: 'B·席尔瓦', coord: { x: 78, y: 20 } },
        { positionId: 'CF', role: '中锋', playerName: 'C罗', coord: { x: 50, y: 15 } },
      ],
    },
    JPN: {
      name: '3-4-2-1',
      positions: [
        { positionId: 'GK', role: '门将', playerName: '权田修一', coord: { x: 50, y: 88 } },
        { positionId: 'LCB', role: '左中卫', playerName: '町田浩树', coord: { x: 30, y: 72 } },
        { positionId: 'CCB', role: '中中卫', playerName: '板仓滉', coord: { x: 50, y: 74 } },
        { positionId: 'RCB', role: '右中卫', playerName: '谷口彰悟', coord: { x: 70, y: 72 } },
        { positionId: 'LMF', role: '左前卫', playerName: '三笘薰', coord: { x: 15, y: 50 } },
        { positionId: 'RMF', role: '右前卫', playerName: '堂安律', coord: { x: 85, y: 50 } },
        { positionId: 'LCM', role: '后腰', playerName: '守田英正', coord: { x: 38, y: 58 } },
        { positionId: 'RCM', role: '后腰', playerName: '远藤航', coord: { x: 62, y: 58 } },
        { positionId: 'LAM', role: '左前腰', playerName: '南野拓实', coord: { x: 33, y: 32 } },
        { positionId: 'RAM', role: '右前腰', playerName: '久保建英', coord: { x: 67, y: 32 } },
        { positionId: 'CF', role: '中锋', playerName: '上田绮世', coord: { x: 50, y: 15 } },
      ],
    },
  };

  return formations[teamId] || {
    name: '4-4-2',
    positions: [
      { positionId: 'GK', role: '门将', playerName: '门将', coord: { x: 50, y: 88 } },
      { positionId: 'LCB', role: '左中卫', playerName: '中后卫', coord: { x: 35, y: 72 } },
      { positionId: 'RCB', role: '右中卫', playerName: '中后卫', coord: { x: 65, y: 72 } },
      { positionId: 'LB', role: '左后卫', playerName: '左后卫', coord: { x: 18, y: 65 } },
      { positionId: 'RB', role: '右后卫', playerName: '右后卫', coord: { x: 82, y: 65 } },
      { positionId: 'LM', role: '左中场', playerName: '中场', coord: { x: 25, y: 45 } },
      { positionId: 'CM1', role: '中场', playerName: '中场', coord: { x: 40, y: 40 } },
      { positionId: 'CM2', role: '中场', playerName: '中场', coord: { x: 60, y: 40 } },
      { positionId: 'RM', role: '右中场', playerName: '中场', coord: { x: 75, y: 45 } },
      { positionId: 'LW', role: '左边锋', playerName: '前锋', coord: { x: 30, y: 20 } },
      { positionId: 'RW', role: '右边锋', playerName: '前锋', coord: { x: 70, y: 20 } },
    ],
  };
}

function convertPlayerToFullPlayer(dbPlayer: any): Player {
  return {
    ...dbPlayer,
    ability: {
      pace: Math.floor(Math.random() * 30 + 60),
      shooting: Math.floor(Math.random() * 30 + 50),
      passing: Math.floor(Math.random() * 30 + 55),
      dribbling: Math.floor(Math.random() * 30 + 55),
      defending: Math.floor(Math.random() * 30 + 40),
      physical: Math.floor(Math.random() * 30 + 55),
    },
    matchStats: {
      appearances: Math.floor(Math.random() * 10 + 5),
      goals: Math.floor(Math.random() * 8),
      assists: Math.floor(Math.random() * 6),
      keyPasses: Number((Math.random() * 3 + 0.5).toFixed(1)),
      interceptions: Number((Math.random() * 2 + 0.2).toFixed(1)),
      rating: Number((Math.random() * 2 + 6.5).toFixed(2)),
    },
  };
}

export async function generateWorldCupData(): Promise<WorldCupDataset> {
  console.log('正在获取世界杯数据...');

  const teams: Team[] = [];
  const allPlayers: Player[] = [];

  for (const ranking of fifaRankings) {
    const teamId = ranking.teamId;

    const team: Team = {
      id: teamId,
      name: ranking.teamName,
      logoUrl: `https://flagcdn.com/w160/${teamId.toLowerCase()}.png`,
      region: TEAM_REGION[teamId] || '未知',
      strengthRank: ranking.rank,
      bestRecord: TEAM_BEST_RECORD[teamId] || '未获得过名次',
      historyStats: TEAM_HISTORY[teamId] || { appearances: 0, matchesPlayed: 0, wins: 0, draws: 0, losses: 0 },
      qualifierRoad: generateQualifierRoad(teamId),
      formation: generateFormation(teamId),
    };

    teams.push(team);

    const teamPlayers = playerDatabase.filter(p => p.teamId === teamId);
    for (const dbPlayer of teamPlayers) {
      const fullPlayer = convertPlayerToFullPlayer(dbPlayer);
      allPlayers.push(fullPlayer);
    }
  }

  console.log(`已生成 ${teams.length} 支球队和 ${allPlayers.length} 名球员数据`);

  return { teams, players: allPlayers };
}
