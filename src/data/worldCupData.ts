export interface Ability {
  pace: number;      // 速度
  shooting: number;  // 射门
  passing: number;   // 传球
  dribbling: number; // 盘带
  defending: number; // 防守
  physical: number;  // 身体
}

export interface MatchStats {
  appearances: number;     // 出场次数
  goals: number;           // 进球数
  assists: number;         // 助攻数
  keyPasses: number;       // 场均关键传球
  interceptions: number;   // 场均拦截数
  rating: number;          // 综合评分 (0.0 - 10.0)
  cleanSheets?: number;    // 零封场次 (GK 门将专有)
  passSuccess?: number;    // 传球成功率 (%)
  tackles?: number;        // 场均抢断数
  distance?: number;       // 场均跑动距离 (km)
  recentRatings?: number[]; // 近5场关键比赛评分走势
}

export interface Player {
  id: string;
  name: string;
  englishName: string;
  avatarUrl: string;       // 高清参考头像
  teamId: string;
  teamName: string;
  age: number;
  position: 'FW' | 'MF' | 'DF' | 'GK'; // FW 前锋, MF 中场, DF 后卫, GK 门将
  positionName: string;    // 中文位置，如 "中锋"、"前腰"
  club: string;
  marketValue: number;     // 市场评估身价 (万欧元)
  commercialValue: number; // 商业价值评分 (1-100)
  isStar: boolean;         // 是否属于明星球员
  shirtNumber: number;     // 球衣号码
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
  positionId: string; // 阵型中的位置代号，如 "GK", "LCB", "RW" 等
  role: string;       // 中文战术角色，如 "门将", "左后卫"
  playerName: string; // 对应的球员姓名
  coord: { x: number; y: number }; // 在绿茵场画布(100x100)上的百分比坐标
}

export interface Formation {
  name: string; // 如 "4-3-3", "3-5-2", "4-2-3-1"
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
  strengthRank: number; // 实力排名
  bestRecord: string;   // 历史最佳战绩
  historyStats: TeamHistoryStats;
  qualifierRoad: QualifierNode[];
  formation: Formation;
}

export interface WorldCupDataset {
  teams: Team[];
  players: Player[];
}

export const worldCupData: WorldCupDataset = {
  teams: [
    {
      id: "ARG",
      name: "阿根廷",
      logoUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=150&auto=format&fit=crop&q=80", // 黄金质感
      region: "南美洲",
      strengthRank: 1,
      bestRecord: "三届冠军 (1978, 1986, 2022)",
      historyStats: {
        appearances: 18,
        matchesPlayed: 88,
        wins: 49,
        draws: 16,
        losses: 23
      },
      qualifierRoad: [
        { stage: "南美区第1轮", opponent: "厄瓜多尔", score: "1-0", status: "win", desc: "梅西标志性任意球破门，在纪念碑球场全取三分，敲响卫冕首枪。" },
        { stage: "南美区第6轮", opponent: "巴西", score: "1-0", status: "win", desc: "客场马拉卡纳球场，奥塔门迪头槌破门，历史性击破桑巴军团主场不败金身。" },
        { stage: "南美区第12轮", opponent: "秘鲁", score: "1-0", status: "win", desc: "劳塔罗侧身凌空斩制胜，由梅西送出精妙助攻，提前锁定出线出征名额。" },
        { stage: "南美区第16轮", opponent: "智利", score: "3-0", status: "win", desc: "麦卡利斯特与迪巴拉联手建功，阿根廷主场多点开花，强势宣告进军2026！" }
      ],
      formation: {
        name: "4-3-3",
        positions: [
          { positionId: "GK", role: "门将", playerName: "达米安·马丁内斯", coord: { x: 50, y: 88 } },
          { positionId: "LCB", role: "左中卫", playerName: "克里斯蒂安·罗梅罗", coord: { x: 35, y: 72 } },
          { positionId: "RCB", role: "右中卫", playerName: "尼古拉斯·奥塔门迪", coord: { x: 65, y: 72 } },
          { positionId: "LB", role: "左后卫", playerName: "尼古拉斯·塔利亚菲科", coord: { x: 18, y: 65 } },
          { positionId: "RB", role: "右后卫", playerName: "纳韦尔·莫利纳", coord: { x: 82, y: 65 } },
          { positionId: "DM", role: "防守型中场", playerName: "恩佐·费尔南德斯", coord: { x: 50, y: 50 } },
          { positionId: "LCM", role: "左中场", playerName: "阿莱克西斯·麦卡利斯特", coord: { x: 32, y: 40 } },
          { positionId: "RCM", role: "右中场", playerName: "罗德里戈·德保罗", coord: { x: 68, y: 40 } },
          { positionId: "LW", role: "左边锋", playerName: "劳塔罗·马丁内斯", coord: { x: 22, y: 20 } },
          { positionId: "RW", role: "右边锋", playerName: "里奥·梅西", coord: { x: 78, y: 20 } },
          { positionId: "CF", role: "中锋", playerName: "胡利安·阿尔瓦雷斯", coord: { x: 50, y: 15 } }
        ]
      }
    },
    {
      id: "FRA",
      name: "法国",
      logoUrl: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=150&auto=format&fit=crop&q=80",
      region: "欧洲",
      strengthRank: 2,
      bestRecord: "两届冠军 (1998, 2018)",
      historyStats: {
        appearances: 16,
        matchesPlayed: 73,
        wins: 39,
        draws: 14,
        losses: 20
      },
      qualifierRoad: [
        { stage: "欧洲区小组赛A组", opponent: "荷兰", score: "4-0", status: "win", desc: "姆巴佩双响、格列兹曼传射，法国队在法兰西体育场闪击郁金香。" },
        { stage: "欧洲区小组赛A组", opponent: "爱尔兰", score: "1-0", status: "win", desc: "帕瓦尔断球轰出超级世界波，迈尼昂读秒神扑，惊险客场带走胜利。" },
        { stage: "欧洲区小组赛A组", opponent: "直布罗陀", score: "14-0", status: "win", desc: "高卢雄鸡刮起疯狂进攻风暴，刷新法国国家队历史最大比分取胜纪录。" },
        { stage: "欧洲区小组赛A组", opponent: "荷兰", score: "2-1", status: "win", desc: "姆巴佩再次完成史诗级梅开二度，帮助法国队在克鲁伊夫球场客场出线。" }
      ],
      formation: {
        name: "4-2-3-1",
        positions: [
          { positionId: "GK", role: "门将", playerName: "迈克·迈尼昂", coord: { x: 50, y: 88 } },
          { positionId: "LCB", role: "左中卫", playerName: "威廉·萨利巴", coord: { x: 35, y: 72 } },
          { positionId: "RCB", role: "右中卫", playerName: "达约·于帕梅卡诺", coord: { x: 65, y: 72 } },
          { positionId: "LB", role: "左后卫", playerName: "特奥·埃尔南德斯", coord: { x: 18, y: 65 } },
          { positionId: "RB", role: "右后卫", playerName: "儒勒·孔德", coord: { x: 82, y: 65 } },
          { positionId: "LDM", role: "左防守中场", playerName: "奥雷利安·楚阿梅尼", coord: { x: 38, y: 52 } },
          { positionId: "RDM", role: "右防守中场", playerName: "爱德华多·卡马文加", coord: { x: 62, y: 52 } },
          { positionId: "LAM", role: "左前腰", playerName: "基利安·姆巴佩", coord: { x: 22, y: 32 } },
          { positionId: "CAM", role: "前腰", playerName: "安东万·格列兹曼", coord: { x: 50, y: 32 } },
          { positionId: "RAM", role: "右前腰", playerName: "奥斯曼·登贝莱", coord: { x: 78, y: 32 } },
          { positionId: "CF", role: "中锋", playerName: "马库斯·图拉姆", coord: { x: 50, y: 15 } }
        ]
      }
    },
    {
      id: "ENG",
      name: "英格兰",
      logoUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=150&auto=format&fit=crop&q=80",
      region: "欧洲",
      strengthRank: 3,
      bestRecord: "一届冠军 (1966)",
      historyStats: {
        appearances: 16,
        matchesPlayed: 74,
        wins: 32,
        draws: 22,
        losses: 20
      },
      qualifierRoad: [
        { stage: "欧洲区小组赛C组", opponent: "意大利", score: "2-1", status: "win", desc: "赖斯乱战建功，凯恩点球破门加冕英格兰历史射手王，客战那不勒斯完成救赎。" },
        { stage: "欧洲区小组赛C组", opponent: "乌克兰", score: "2-0", status: "win", desc: "凯恩与萨卡在3分钟内接连进球，英格兰队在温布利球场轻松击退对手。" },
        { stage: "欧洲区小组赛C组", opponent: "北马其顿", score: "7-0", status: "win", desc: "萨卡爆发轰出震撼帽子戏法，凯恩梅开二度，三狮军团在老特拉福德大捷。" },
        { stage: "欧洲区小组赛C组", opponent: "意大利", score: "3-1", status: "win", desc: "凯恩双响，拉什福德连场进球破网。英格兰主场逆转苦主，成功直通2026。" }
      ],
      formation: {
        name: "4-2-3-1",
        positions: [
          { positionId: "GK", role: "门将", playerName: "乔丹·皮克福德", coord: { x: 50, y: 88 } },
          { positionId: "LCB", role: "左中卫", playerName: "约翰·斯通斯", coord: { x: 35, y: 72 } },
          { positionId: "RCB", role: "右中卫", playerName: "哈里·马奎尔", coord: { x: 65, y: 72 } },
          { positionId: "LB", role: "左后卫", playerName: "卢克·肖", coord: { x: 18, y: 65 } },
          { positionId: "RB", role: "右后卫", playerName: "凯尔·沃克", coord: { x: 82, y: 65 } },
          { positionId: "LDM", role: "左防守中场", playerName: "德克兰·赖斯", coord: { x: 38, y: 52 } },
          { positionId: "RDM", role: "管中闵/小将", playerName: "科比·梅努", coord: { x: 62, y: 52 } },
          { positionId: "LAM", role: "左前腰", playerName: "菲尔·福登", coord: { x: 22, y: 32 } },
          { positionId: "CAM", role: "前腰", playerName: "裘德·贝林厄姆", coord: { x: 50, y: 32 } },
          { positionId: "RAM", role: "右前腰", playerName: "布卡约·萨卡", coord: { x: 78, y: 32 } },
          { positionId: "CF", role: "中锋", playerName: "哈里·凯恩", coord: { x: 50, y: 15 } }
        ]
      }
    },
    {
      id: "BRA",
      name: "巴西",
      logoUrl: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=150&auto=format&fit=crop&q=80",
      region: "南美洲",
      strengthRank: 4,
      bestRecord: "五届冠军 (1958, 1962, 1970, 1994, 2002)",
      historyStats: {
        appearances: 22,
        matchesPlayed: 114,
        wins: 76,
        draws: 19,
        losses: 19
      },
      qualifierRoad: [
        { stage: "南美区第1轮", opponent: "玻利维亚", score: "5-1", status: "win", desc: "罗德里戈双响，内马尔破门加冕巴西男子射手王，桑巴开门大捷。" },
        { stage: "南美区第2轮", opponent: "秘鲁", score: "1-0", status: "win", desc: "马尔基尼奥斯第90分钟泰山压顶头球读秒绝杀，客场惊险带走三分。" },
        { stage: "南美区第8轮", opponent: "厄瓜多尔", score: "1-0", status: "win", desc: "罗德里戈劲射破门制胜，巴西队成功止住预选赛连败颓势，重回出线轨道。" },
        { stage: "南美区第14轮", opponent: "智利", score: "2-1", status: "win", desc: "路易斯·恩里克下半场尾声贴地弧线斩绝杀，确保出征名额妥善锁定。" }
      ],
      formation: {
        name: "4-3-3",
        positions: [
          { positionId: "GK", role: "门将", playerName: "阿利松·贝克尔", coord: { x: 50, y: 88 } },
          { positionId: "LCB", role: "左中卫", playerName: "加布里埃尔·马加良斯", coord: { x: 35, y: 72 } },
          { positionId: "RCB", role: "右中卫", playerName: "马尔基尼奥斯", coord: { x: 65, y: 72 } },
          { positionId: "LB", role: "左后卫", playerName: "安德烈", coord: { x: 18, y: 65 } },
          { positionId: "RB", role: "右后卫", playerName: "达尼洛", coord: { x: 82, y: 65 } },
          { positionId: "DM", role: "防守中场", playerName: "布鲁诺·吉马良斯", coord: { x: 50, y: 50 } },
          { positionId: "LCM", role: "左中场", playerName: "若昂·戈麦斯", coord: { x: 32, y: 40 } },
          { positionId: "RCM", role: "右中场", playerName: "卢卡斯·帕奎塔", coord: { x: 68, y: 40 } },
          { positionId: "LW", role: "左翼锋", playerName: "维尼修斯·儒尼奥尔", coord: { x: 22, y: 20 } },
          { positionId: "RW", role: "右翼锋", playerName: "拉菲尼亚", coord: { x: 78, y: 20 } },
          { positionId: "CF", role: "中锋", playerName: "罗德里戈·戈埃斯", coord: { x: 50, y: 15 } }
        ]
      }
    },
    {
      id: "POR",
      name: "葡萄牙",
      logoUrl: "https://images.unsplash.com/photo-1549241520-425e3dfc01cd?w=150&auto=format&fit=crop&q=80",
      region: "欧洲",
      strengthRank: 5,
      bestRecord: "季军 (1966)",
      historyStats: {
        appearances: 8,
        matchesPlayed: 35,
        wins: 17,
        draws: 6,
        losses: 12
      },
      qualifierRoad: [
        { stage: "欧洲区小组赛J组", opponent: "波黑", score: "3-0", status: "win", desc: "B费双响并奉献精彩助攻，B席巧射首开纪录，光明球场高歌猛进。" },
        { stage: "欧洲区小组赛J组", opponent: "冰岛", score: "1-0", status: "win", desc: "C罗迎来国家队生涯第200场里程碑，并在第89分钟完成绝平式绝杀。" },
        { stage: "欧洲区小组赛J组", opponent: "斯洛伐克", score: "3-2", status: "win", desc: "C罗双响锁定惊险战报，B费送上两记核心手术刀般精准直塞，直抵北卡美加墨。" },
        { stage: "欧洲区小组赛J组", opponent: "冰岛", score: "2-0", status: "win", desc: "B费与奥尔塔建功，葡萄牙队十战全胜历史最高分傲然出线进军决赛圈。" }
      ],
      formation: {
        name: "4-3-3",
        positions: [
          { positionId: "GK", role: "门将", playerName: "迪奥戈·科斯塔", coord: { x: 50, y: 88 } },
          { positionId: "LCB", role: "左中卫", playerName: "鲁本·迪亚斯", coord: { x: 35, y: 72 } },
          { positionId: "RCB", role: "右中卫", playerName: "安东尼奥·席尔瓦", coord: { x: 65, y: 72 } },
          { positionId: "LB", role: "左后卫", playerName: "努诺·门德斯", coord: { x: 18, y: 65 } },
          { positionId: "RB", role: "右后卫", playerName: "若昂·坎塞洛", coord: { x: 82, y: 65 } },
          { positionId: "DM", role: "防守中场", playerName: "若昂·帕利尼亚", coord: { x: 50, y: 50 } },
          { positionId: "LCM", role: "左中场", playerName: "维蒂尼亚", coord: { x: 32, y: 40 } },
          { positionId: "RCM", role: "右中场", playerName: "布鲁诺·费尔南德斯", coord: { x: 68, y: 40 } },
          { positionId: "LW", role: "左边锋", playerName: "拉斐尔·莱奥", coord: { x: 22, y: 20 } },
          { positionId: "RW", role: "右边锋", playerName: "贝尔纳多·席尔瓦", coord: { x: 78, y: 20 } },
          { positionId: "CF", role: "中锋", playerName: "克里斯蒂亚诺·罗纳尔多", coord: { x: 50, y: 15 } }
        ]
      }
    },
    {
      id: "JPN",
      name: "日本",
      logoUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=150&auto=format&fit=crop&q=80",
      region: "亚洲",
      strengthRank: 12,
      bestRecord: "16强 (2002, 2010, 2018, 2022)",
      historyStats: {
        appearances: 7,
        matchesPlayed: 25,
        wins: 7,
        draws: 6,
        losses: 12
      },
      qualifierRoad: [
        { stage: "亚洲区世预赛第二阶段", opponent: "缅甸", score: "5-0", status: "win", desc: "上田绮世大演帽子戏法，蓝武士在吹田市球场揭幕战轻松横扫。" },
        { stage: "亚洲区世预赛第三阶段", opponent: "中国", score: "7-0", status: "win", desc: "三笘薰、南野拓实等多点闪击，彻底击碎长城防备，创造队史中日交锋最大比分优势。" },
        { stage: "亚洲区世预赛第三阶段", opponent: "巴林", score: "5-0", status: "win", desc: "客场顶住巨幅噪音干扰，守田英正、小川航基狂插后排锁死两连胜。" },
        { stage: "亚洲区世预赛第三阶段", opponent: "沙特阿拉伯", score: "2-0", status: "win", desc: "首次在吉达客场击退沙特，小川航基头槌建立大功，全胜领跑锁定席位。" }
      ],
      formation: {
        name: "3-4-2-1",
        positions: [
          { positionId: "GK", role: "门将", playerName: "铃木彩艳", coord: { x: 50, y: 88 } },
          { positionId: "LCB", role: "左中卫", playerName: "町田浩树", coord: { x: 30, y: 72 } },
          { positionId: "CCB", role: "中中卫", playerName: "谷口彰悟", coord: { x: 50, y: 74 } },
          { positionId: "RCB", role: "右中卫", playerName: "板仓滉", coord: { x: 70, y: 72 } },
          { positionId: "LMF", role: "左前卫(翼卫)", playerName: "三笘薰", coord: { x: 15, y: 50 } },
          { positionId: "RMF", role: "右前卫(翼卫)", playerName: "堂安律", coord: { x: 85, y: 50 } },
          { positionId: "LCM", role: "后腰", playerName: "守田英正", coord: { x: 38, y: 58 } },
          { positionId: "RCM", role: "后腰", playerName: "远藤航", coord: { x: 62, y: 58 } },
          { positionId: "LAM", role: "左前腰", playerName: "南野拓实", coord: { x: 33, y: 32 } },
          { positionId: "RAM", role: "右前腰", playerName: "久保建英", coord: { x: 67, y: 32 } },
          { positionId: "CF", role: "中锋", playerName: "上田绮世", coord: { x: 50, y: 15 } }
        ]
      }
    }
  ],
  players: [
    // --- 阿根廷队球员 ---
    {
      id: "p_messi",
      name: "里奥·梅西",
      englishName: "Lionel Messi",
      avatarUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80", // 气质艺术像
      teamId: "ARG",
      teamName: "阿根廷",
      age: 38,
      position: "FW",
      positionName: "右边锋/影子前锋",
      club: "迈阿密国际",
      marketValue: 3000,
      commercialValue: 99.8,
      isStar: true,
      shirtNumber: 10,
      ability: {
        pace: 75,
        shooting: 92,
        passing: 96,
        dribbling: 95,
        defending: 39,
        physical: 65
      },
      matchStats: {
        appearances: 8,
        goals: 6,
        assists: 5,
        keyPasses: 3.2,
        interceptions: 0.1,
        rating: 8.52
      }
    },
    {
      id: "p_alvarez",
      name: "胡利安·阿尔瓦雷斯",
      englishName: "Julián Álvarez",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      teamId: "ARG",
      teamName: "阿根廷",
      age: 26,
      position: "FW",
      positionName: "中锋 / 影锋",
      club: "马德里竞技",
      marketValue: 9000,
      commercialValue: 88.5,
      isStar: false,
      shirtNumber: 9,
      ability: {
        pace: 86,
        shooting: 88,
        passing: 80,
        dribbling: 84,
        defending: 58,
        physical: 82
      },
      matchStats: {
        appearances: 10,
        goals: 7,
        assists: 3,
        keyPasses: 1.8,
        interceptions: 0.6,
        rating: 7.78
      }
    },
    {
      id: "p_macallister",
      name: "阿莱克西斯·麦卡利斯特",
      englishName: "Alexis Mac Allister",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      teamId: "ARG",
      teamName: "阿根廷",
      age: 27,
      position: "MF",
      positionName: "核心前中场",
      club: "利物浦",
      marketValue: 7500,
      commercialValue: 84.0,
      isStar: false,
      shirtNumber: 20,
      ability: {
        pace: 74,
        shooting: 82,
        passing: 88,
        dribbling: 85,
        defending: 76,
        physical: 79
      },
      matchStats: {
        appearances: 12,
        goals: 3,
        assists: 4,
        keyPasses: 2.1,
        interceptions: 1.8,
        rating: 7.65
      }
    },
    {
      id: "p_depaul",
      name: "罗德里戈·德保罗",
      englishName: "Rodrigo De Paul",
      avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      teamId: "ARG",
      teamName: "阿根廷",
      age: 32,
      position: "MF",
      positionName: "全能中场",
      club: "马德里竞技",
      marketValue: 3000,
      commercialValue: 81.2,
      isStar: false,
      shirtNumber: 7,
      ability: {
        pace: 78,
        shooting: 75,
        passing: 83,
        dribbling: 80,
        defending: 75,
        physical: 86
      },
      matchStats: {
        appearances: 14,
        goals: 1,
        assists: 4,
        keyPasses: 1.9,
        interceptions: 2.3,
        rating: 7.42
      }
    },
    {
      id: "p_martinez_gk",
      name: "达米安·马丁内斯",
      englishName: "Emiliano Martínez",
      avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
      teamId: "ARG",
      teamName: "阿根廷",
      age: 33,
      position: "GK",
      positionName: "首发守门员",
      club: "阿斯顿维拉",
      marketValue: 2800,
      commercialValue: 89.0,
      isStar: true,
      shirtNumber: 23,
      ability: {
        pace: 55,
        shooting: 22,
        passing: 75,
        dribbling: 50,
        defending: 88,
        physical: 84
      },
      matchStats: {
        appearances: 12,
        goals: 0,
        assists: 0,
        keyPasses: 0.1,
        interceptions: 1.2,
        rating: 7.85
      }
    },
    {
      id: "p_romero",
      name: "克里斯蒂安·罗梅罗",
      englishName: "Cristian Romero",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      teamId: "ARG",
      teamName: "阿根廷",
      age: 28,
      position: "DF",
      positionName: "中后卫",
      club: "托特纳姆热刺",
      marketValue: 6500,
      commercialValue: 79.5,
      isStar: false,
      shirtNumber: 13,
      ability: {
        pace: 82,
        shooting: 45,
        passing: 72,
        dribbling: 68,
        defending: 92,
        physical: 89
      },
      matchStats: {
        appearances: 11,
        goals: 1,
        assists: 0,
        keyPasses: 0.3,
        interceptions: 2.8,
        rating: 7.55
      }
    },

    // --- 法国队球员 ---
    {
      id: "p_mbappe",
      name: "基利安·姆巴佩",
      englishName: "Kylian Mbappé",
      avatarUrl: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80",
      teamId: "FRA",
      teamName: "法国",
      age: 27,
      position: "FW",
      positionName: "左边锋/中锋",
      club: "皇家马德里",
      marketValue: 18000,
      commercialValue: 99.5,
      isStar: true,
      shirtNumber: 10,
      ability: {
        pace: 97,
        shooting: 93,
        passing: 82,
        dribbling: 92,
        defending: 36,
        physical: 79
      },
      matchStats: {
        appearances: 10,
        goals: 11,
        assists: 4,
        keyPasses: 2.5,
        interceptions: 0.2,
        rating: 8.48
      }
    },
    {
      id: "p_griezmann",
      name: "安东万·格列兹曼",
      englishName: "Antoine Griezmann",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      teamId: "FRA",
      teamName: "法国",
      age: 35,
      position: "MF",
      positionName: "前腰 / 影子前锋",
      club: "马德里竞技",
      marketValue: 2500,
      commercialValue: 92.0,
      isStar: true,
      shirtNumber: 7,
      ability: {
        pace: 76,
        shooting: 84,
        passing: 89,
        dribbling: 87,
        defending: 58,
        physical: 72
      },
      matchStats: {
        appearances: 12,
        goals: 4,
        assists: 7,
        keyPasses: 3.1,
        interceptions: 1.4,
        rating: 8.12
      }
    },
    {
      id: "p_saliba",
      name: "威廉·萨利巴",
      englishName: "William Saliba",
      avatarUrl: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=150&auto=format&fit=crop&q=80",
      teamId: "FRA",
      teamName: "法国",
      age: 25,
      position: "DF",
      positionName: "中后卫",
      club: "阿森纳",
      marketValue: 8000,
      commercialValue: 86.2,
      isStar: false,
      shirtNumber: 4,
      ability: {
        pace: 83,
        shooting: 40,
        passing: 78,
        dribbling: 75,
        defending: 91,
        physical: 86
      },
      matchStats: {
        appearances: 11,
        goals: 0,
        assists: 0,
        keyPasses: 0.4,
        interceptions: 2.5,
        rating: 7.68
      }
    },
    {
      id: "p_dembele",
      name: "奥斯曼·登贝莱",
      englishName: "Ousmane Dembélé",
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
      teamId: "FRA",
      teamName: "法国",
      age: 29,
      position: "FW",
      positionName: "右翼边锋",
      club: "巴黎圣日耳曼",
      marketValue: 6000,
      commercialValue: 85.0,
      isStar: false,
      shirtNumber: 11,
      ability: {
        pace: 93,
        shooting: 78,
        passing: 84,
        dribbling: 90,
        defending: 35,
        physical: 62
      },
      matchStats: {
        appearances: 9,
        goals: 3,
        assists: 6,
        keyPasses: 2.8,
        interceptions: 0.3,
        rating: 7.58
      }
    },

    // --- 英格兰队球员 ---
    {
      id: "p_bellingham",
      name: "裘德·贝林厄姆",
      englishName: "Jude Bellingham",
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      teamId: "ENG",
      teamName: "英格兰",
      age: 22,
      position: "MF",
      positionName: "全能前腰/中场",
      club: "皇家马德里",
      marketValue: 18000,
      commercialValue: 98.2,
      isStar: true,
      shirtNumber: 10,
      ability: {
        pace: 84,
        shooting: 87,
        passing: 86,
        dribbling: 90,
        defending: 78,
        physical: 89
      },
      matchStats: {
        appearances: 8,
        goals: 6,
        assists: 3,
        keyPasses: 2.4,
        interceptions: 1.6,
        rating: 8.35
      }
    },
    {
      id: "p_kane",
      name: "哈里·凯恩",
      englishName: "Harry Kane",
      avatarUrl: "https://images.unsplash.com/photo-1542178243-fc2023d83762?w=150&auto=format&fit=crop&q=80",
      teamId: "ENG",
      teamName: "英格兰",
      age: 32,
      position: "FW",
      positionName: "超级中锋",
      club: "拜仁慕尼黑",
      marketValue: 10000,
      commercialValue: 94.0,
      isStar: true,
      shirtNumber: 9,
      ability: {
        pace: 70,
        shooting: 93,
        passing: 85,
        dribbling: 83,
        defending: 47,
        physical: 83
      },
      matchStats: {
        appearances: 9,
        goals: 10,
        assists: 3,
        keyPasses: 2.0,
        interceptions: 0.4,
        rating: 8.24
      }
    },
    {
      id: "p_saka",
      name: "布卡约·萨卡",
      englishName: "Bukayo Saka",
      avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
      teamId: "ENG",
      teamName: "英格兰",
      age: 24,
      position: "FW",
      positionName: "右边锋",
      club: "阿森纳",
      marketValue: 14000,
      commercialValue: 91.5,
      isStar: false,
      shirtNumber: 7,
      ability: {
        pace: 89,
        shooting: 84,
        passing: 83,
        dribbling: 88,
        defending: 55,
        physical: 78
      },
      matchStats: {
        appearances: 9,
        goals: 6,
        assists: 5,
        keyPasses: 2.2,
        interceptions: 1.1,
        rating: 7.96
      }
    },
    {
      id: "p_rice",
      name: "德克兰·赖斯",
      englishName: "Declan Rice",
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
      teamId: "ENG",
      teamName: "英格兰",
      age: 27,
      position: "MF",
      positionName: "防守型中场 / 铁闸",
      club: "阿森纳",
      marketValue: 12000,
      commercialValue: 88.0,
      isStar: false,
      shirtNumber: 4,
      ability: {
        pace: 78,
        shooting: 72,
        passing: 81,
        dribbling: 80,
        defending: 88,
        physical: 87
      },
      matchStats: {
        appearances: 10,
        goals: 2,
        assists: 2,
        keyPasses: 1.5,
        interceptions: 2.9,
        rating: 7.82
      }
    },

    // --- 巴西队球员 ---
    {
      id: "p_vinicius",
      name: "维尼修斯·儒尼奥尔",
      englishName: "Vinícius Júnior",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      teamId: "BRA",
      teamName: "巴西",
      age: 25,
      position: "FW",
      positionName: "顶级左翼锋",
      club: "皇家马德里",
      marketValue: 18000,
      commercialValue: 97.8,
      isStar: true,
      shirtNumber: 7,
      ability: {
        pace: 96,
        shooting: 88,
        passing: 81,
        dribbling: 94,
        defending: 34,
        physical: 76
      },
      matchStats: {
        appearances: 7,
        goals: 5,
        assists: 4,
        keyPasses: 2.1,
        interceptions: 0.3,
        rating: 8.28
      }
    },
    {
      id: "p_rodrygo",
      name: "罗德里戈·戈埃斯",
      englishName: "Rodrygo",
      avatarUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80",
      teamId: "BRA",
      teamName: "巴西",
      age: 25,
      position: "FW",
      positionName: "右边锋/全能前锋",
      club: "皇家马德里",
      marketValue: 11000,
      commercialValue: 89.0,
      isStar: false,
      shirtNumber: 11,
      ability: {
        pace: 89,
        shooting: 84,
        passing: 81,
        dribbling: 87,
        defending: 38,
        physical: 70
      },
      matchStats: {
        appearances: 9,
        goals: 4,
        assists: 3,
        keyPasses: 1.9,
        interceptions: 0.5,
        rating: 7.62
      }
    },
    {
      id: "p_guimaraes",
      name: "布鲁诺·吉马良斯",
      englishName: "Bruno Guimarães",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      teamId: "BRA",
      teamName: "巴西",
      age: 28,
      position: "MF",
      positionName: "核心防守中场",
      club: "纽卡斯尔联",
      marketValue: 8500,
      commercialValue: 82.5,
      isStar: false,
      shirtNumber: 5,
      ability: {
        pace: 71,
        shooting: 77,
        passing: 85,
        dribbling: 84,
        defending: 82,
        physical: 86
      },
      matchStats: {
        appearances: 8,
        goals: 1,
        assists: 2,
        keyPasses: 1.7,
        interceptions: 2.1,
        rating: 7.55
      }
    },

    // --- 葡萄牙队球员 ---
    {
      id: "p_ronaldo",
      name: "克里斯蒂亚诺·罗纳尔多",
      englishName: "Cristiano Ronaldo",
      avatarUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80",
      teamId: "POR",
      teamName: "葡萄牙",
      age: 41,
      position: "FW",
      positionName: "史诗神射手中锋",
      club: "利雅得胜利",
      marketValue: 1500,
      commercialValue: 99.9,
      isStar: true,
      shirtNumber: 7,
      ability: {
        pace: 74,
        shooting: 90,
        passing: 77,
        dribbling: 79,
        defending: 30,
        physical: 78
      },
      matchStats: {
        appearances: 10,
        goals: 10,
        assists: 2,
        keyPasses: 1.4,
        interceptions: 0.0,
        rating: 8.01
      }
    },
    {
      id: "p_dias",
      name: "鲁本·迪亚斯",
      englishName: "Rúben Dias",
      avatarUrl: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=150&auto=format&fit=crop&q=80",
      teamId: "POR",
      teamName: "葡萄牙",
      age: 29,
      position: "DF",
      positionName: "世界防守中卫铁闸",
      club: "曼城",
      marketValue: 8000,
      commercialValue: 88.0,
      isStar: true,
      shirtNumber: 4,
      ability: {
        pace: 72,
        shooting: 42,
        passing: 76,
        dribbling: 70,
        defending: 90,
        physical: 88
      },
      matchStats: {
        appearances: 10,
        goals: 1,
        assists: 0,
        keyPasses: 0.5,
        interceptions: 2.6,
        rating: 7.72
      }
    },
    {
      id: "p_fernandes",
      name: "布鲁诺·费尔南德斯",
      englishName: "Bruno Fernandes",
      avatarUrl: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?w=150&auto=format&fit=crop&q=80",
      teamId: "POR",
      teamName: "葡萄牙",
      age: 31,
      position: "MF",
      positionName: "传球指挥官/前腰",
      club: "曼彻斯特联",
      marketValue: 7000,
      commercialValue: 91.0,
      isStar: false,
      shirtNumber: 8,
      ability: {
        pace: 76,
        shooting: 86,
        passing: 93,
        dribbling: 83,
        defending: 64,
        physical: 79
      },
      matchStats: {
        appearances: 10,
        goals: 6,
        assists: 8,
        keyPasses: 3.6,
        interceptions: 1.3,
        rating: 8.25
      }
    },

    // --- 日本队球员 ---
    {
      id: "p_mitoma",
      name: "三笘薰",
      englishName: "Kaoru Mitoma",
      avatarUrl: "https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?w=150&auto=format&fit=crop&q=80",
      teamId: "JPN",
      teamName: "日本",
      age: 29,
      position: "MF",
      positionName: "左前卫/左翼锋",
      club: "布莱顿",
      marketValue: 4500,
      commercialValue: 90.5,
      isStar: true,
      shirtNumber: 7,
      ability: {
        pace: 90,
        shooting: 80,
        passing: 82,
        dribbling: 91,
        defending: 56,
        physical: 72
      },
      matchStats: {
        appearances: 8,
        goals: 4,
        assists: 4,
        keyPasses: 2.3,
        interceptions: 1.1,
        rating: 7.92
      }
    },
    {
      id: "p_kubo",
      name: "久保建英",
      englishName: "Takefusa Kubo",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      teamId: "JPN",
      teamName: "日本",
      age: 25,
      position: "MF",
      positionName: "前腰/右边锋",
      club: "皇家社会",
      marketValue: 5000,
      commercialValue: 89.0,
      isStar: true,
      shirtNumber: 20,
      ability: {
        pace: 86,
        shooting: 82,
        passing: 85,
        dribbling: 88,
        defending: 40,
        physical: 66
      },
      matchStats: {
        appearances: 9,
        goals: 3,
        assists: 5,
        keyPasses: 2.8,
        interceptions: 0.8,
        rating: 7.84
      }
    },
    {
      id: "p_endo",
      name: "远藤航",
      englishName: "Wataru Endo",
      avatarUrl: "https://images.unsplash.com/photo-1489980508314-941910ded1f4?w=150&auto=format&fit=crop&q=80",
      teamId: "JPN",
      teamName: "日本",
      age: 33,
      position: "MF",
      positionName: "防守型后腰/队长",
      club: "利物浦",
      marketValue: 1200,
      commercialValue: 82.0,
      isStar: false,
      shirtNumber: 6,
      ability: {
        pace: 68,
        shooting: 68,
        passing: 78,
        dribbling: 74,
        defending: 85,
        physical: 83
      },
      matchStats: {
        appearances: 10,
        goals: 1,
        assists: 1,
        keyPasses: 1.2,
        interceptions: 2.8,
        rating: 7.45
      }
    }
  ]
};
