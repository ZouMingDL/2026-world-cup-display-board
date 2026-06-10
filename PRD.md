# 2026年世界杯球员数据分析与球队信息展示小程序
## 产品需求文档 (PRD) & 接口设计说明书

---

## 1. 引言及产品目标
本项目旨在打造一款专门针对 **2026年美加墨世界杯** 的微信小程序。系统为足球爱好者、数据分析师及普通观众提供全方位的参赛国家队实力剖析、战术阵型展示、历史战绩追溯以及各队伍球员的个人高清头像、全面技术统计指标和核心数据雷达图对比系统。

### 产品定位
- **垂直、纯粹、精细化的数据可视化看板**，完全符合用户指明的数据展现与对比需求。
- 界面风格采用现代体育极简风，主打高对比度的亮暗色搭配、清晰的数据层级与流畅的可视化动效。
- **严格遵循需求范围**，不蔓不枝，杜绝一切未授权的冗余社交、社区或预测功能，确保产品功能逻辑完美闭环。

---

## 2. 核心功能需求说明

依据微信小程序的使用场景和产品设计指导原则，系统整体划分为 **四大核心功能模块**：

```
                              [ 用户进入小程序 ]
                                      │
        ┌──────────────┬──────────────┴──────────────┬──────────────┐
        ▼              ▼                             ▼              ▼
  【国家队排名】  【国家队详情】                  【全局球员排行】  【球员对比看板】
  实力梯队排行    历史战绩、阵型图、出线之路      按身价与商业    核心能力雷达图
  入口导航        球员列表(明星优先+身价降序)    价值倒序排行    多维度技术指标对比
```

### 模块一：国家队实力排名与详情展示模块 (对应功能需求 3、4)
User Story：用户可以通过排行榜直观了解2026年世界杯各参赛国的当前战力排名，并能直接点击进入国家队主页，查阅该国历史战绩、战术阵型图、出线晋级之路，以及该届赛事下所有出征球员的信息。

*   **实力排名列表 (Team Rankings)**
    *   以列表卡片形式呈现32/48支参赛国家的最新官方战力评估排名（包含国家队队徽、国名、所属大洲、实力评级等）。
    *   支持点击国家队卡片跳转至**国家队详情页**。
*   **国家队详情页 (Team Details)**
    *   **历史战绩 (Historical Records)**：展示该国家队在历届世界杯的最好成绩、胜率、进球数与历史经典赛事详情数据。
    *   **实战主力阵型图 (Formation Diagram)**：通过球场绿茵图背景，直观排布当前推荐首发的 11 人阵容位置（如4-3-3, 3-5-2等）。支持点击阵型图上的球员头像/标签直接跳转至**球员详情页**。
    *   **出线晋级之路概览 (Qualifiers Road)**：以时间线或地图节点形式梳理该国在2026美加墨世界杯大洲预选赛中的出线历程（包括关键场次、最终积分、以及晋级关键时刻）。
    *   **国足大名单列表 (Squad List)**：
        *   列出当前国家队所有出战的球员。
        *   **排序要求**：按照是否是“明星球员”(isStar) 特权字段置顶，在同类属性下按照“球员身价 (marketValue)”**降序 (从高到低)** 排列。
        *   点击单个球员可跳转至**球员详情页**。

### 模块二：独立全局球员排名模块 (对应功能需求 5)
User Story：用户想横向了解整个2026年世界杯所有参赛球员中，谁的身价最高，谁的商业价值最大。

*   **所有国家球员大排名 (Global Player Rankings)**
    *   提供包含全量球员的排行榜。包含头像、姓名、国家队、身价、商业价值评分。
    *   **核心功能点：排序切换**
        1.  **身价倒序 (Market Value Descending)**：展示全球身价最高的前 N 名球员。
        2.  **商业价值倒序 (Commercial Value Descending)**：展示品牌估值、赞助级别等商业影响指标最高的球员组合。
    *   排序切换需提供顺畅无闪烁的交互反馈，点击具体球员可直达球员数据主页。

### 模块三：球员个人主页与能力值雷达图 (对应功能需求 1、2)
User Story：用户需要深入研究某个特定球员的技术特点、历史表现，并直观评判其能力广度。

*   **个人基本信息 (Bio)**：包含**高清个人头像**、姓名（中/英文）、年龄、身高、体重、场上位置、现效力俱乐部、球衣号码、国家队所属。
*   **能力值雷达看板图 (Ability Radar Chart)**：采用足球标准的六维能力图模型（速度 Pace、射门 Shooting、传球 Passing、盘带 Dribbling、防守 Defending、身体 Physicality）展现球员的当前综合实力。
*   **详细技术统计与比赛表现 (Detail Match Stats)**：
    *   包含常规数据：进球数、助攻数、零封场次（守门员）、传球成功率、抢断数、跑动距离。
    *   单场评分走势图：近期5场关键世界杯比赛评级表现。

### 模块四：多球员核心数据对比模块 (对应功能需求 2)
User Story：在评选队伍实力或讨论技术战术时，用户希望能将多名球员（特别是同位置对手）的数据拉到同一个盘面上进行一对一或一多一的横向直观数据对比。

*   **对比槽位 (Comparison Slots)**：支持用户选择 2-3 名球员加入对比。
*   **数据对比看板 (Comparison Board)**：
    *   **雷达图重叠对比**：将选中球员的多维能力雷达图以不同半透明色彩在同一坐标轴内进行缩放重叠显示，直观看出长短板。
    *   **指标详细对比表**：纵向罗列各项物理与历史表现指标（年龄、身价、商业值、进球、助攻、关键传球、拦截等），最高项高亮打标，帮助快速判别优势球员。
    *   **添加/移除交互**：可在对比看板中直接一键更换或移除对比人选。

---

## 3. 具体字段定义与交互链路

### 3.1 核心数据结构及字段字典

#### 1. 国家队数据结构 (`Team`)
| 字段名称 | 英文键名 (Key) | 数据类型 | 字段说明 | 校验/约束 |
| :--- | :--- | :--- | :--- | :--- |
| 国家队唯一ID | `id` | String | 唯一标识，如 "ARG" | 必填 |
| 国家名称 | `name` | String | 中文名称，如 "阿根廷" | 必填 |
| 国旗队徽 | `logoUrl` | String | 高清PNG格式Logo链接 | 必填 |
| 所属大洲 | `region` | String | 亚洲/欧洲/南美洲/非洲等 | 必填 |
| 官方实力排名 | `strengthRank` | Integer | 全球综合战力排名值 (1, 2, 3...) | 必填且唯一 |
| 晋级历程节点 | `qualifierRoad` | Array[Object] | 各晋级节点时间、对手、比分、状态 | 详见对象结构 |
| 主力阵型配置 | `formation` | Object | 阵型名称及11人场上相对坐标 | 详见阵型定义 |
| 历史最佳战绩 | `bestRecord` | String | 如 "三届冠军 (1978, 1986, 2022)" | 必填 |
| 历史战绩简述 | `historyStats` | Object | 世界杯参赛次数、胜平负总次数 | 选项 |

#### 2. 球员数据结构 (`Player`)
| 字段名称 | 英文键名 (Key) | 数据类型 | 字段说明 | 校验/约束 |
| :--- | :--- | :--- | :--- | :--- |
| 球员唯一ID | `id` | String | 唯一标识，如 "p_messi" | 必填 |
| 球员姓名 | `name` | String | 球员姓名（例："里奥·梅西"） | 必填 |
| 高清个人头像 | `avatarUrl` | String | 高清半身免冠赛场人头照链接 | 必填 |
| 所属国家队ID | `teamId` | String | 外键，对应国家队ID | 必填 |
| 所属国家队名称 | `teamName` | String | 对应国家队中文名 (冗余以便查询) | 必填 |
| 年龄 | `age` | Integer | 当前真实年龄 | 必填 |
| 场上位置分类 | `position` | String | 前锋(FW)/中场(MF)/后卫(DF)/门将(GK) | 必填 |
| 现所属俱乐部 | `club` | String | 所属职业俱乐部，例："迈阿密国际" | 必填 |
| 市场评估身价 | `marketValue` | Float | 单位：万欧元 | 必填，参与排序 |
| 商业价值评分 | `commercialValue`| Float | 综合商业估值分，1-100分 | 必填，参与排序 |
| 是否属于明星球员| `isStar` | Boolean | True优先置顶显示 | 必填 |
| 六维核心能力值 | `ability` | Object | 包含六大能力维度的数值(0-100) | 详见六维定义 |
| 历史比赛统计 | `matchStats` | Object | 当前世界杯周期的进球、助攻、出场等 | 详见统计定义 |

*   **六维能力值对象 (`ability`)**：
    *   `pace` (速度): `0-100` 整数
    *   `shooting` (射门): `0-100` 整数
    *   `passing` (传球): `0-100` 整数
    *   `dribbling` (盘带): `0-100` 整数
    *   `defending` (防守): `0-100` 整数
    *   `physical` (身体): `0-100` 整数
*   **历史比赛统计对象 (`matchStats`)**：
    *   `appearances` (出场次数): 整数
    *   `goals` (进球数): 整数
    *   `assists` (助攻数): 整数
    *   `keyPasses` (关键传球): 浮点数 (场均)
    *   `interceptions` (拦截数): 浮点数 (场均)
    *   `rating` (综合评分): `0.0 - 10.0` 浮点数

---

### 3.2 交互链路图 (User Action Flows)

1.  **国家队与阵型查看流**：
    `国家队实力排名列表` ➜ `点击国家卡片` ➜ `国家队主页` ➜ `切换[历史战绩]/[主力阵型]/[出线历程]子标签` ➜ `点击阵型上的球员卡片或底部球员卡片` ➜ `球员详情页(六维雷达图)`。
2.  **独立球员排名筛选流**：
    `所有国家球员大排行` ➜ `点击身价排行` 或 `点击商业价值排行` ➜ `列表重载排序展示` ➜ `点击目标球员` ➜ `查看详细雷达图个人详情页`。
3.  **多球员对决对比流**：
    `球员个人详情页` ➜ `点击[加入对比]` ➜ `跳转至/选定对比列表页面` ➜ `在可选同伴列表中增加第二/三个球员` ➜ `渲染重叠对比雷达图、核心身价与数据对比柱、表格表单` ➜ `点击[移除成员]动态刷新对比视图`。

---

## 4. API 接口设计说明书 (API Specification)

API 接口设计遵循规范化的 JSON over HTTP(S) 开发风格。后端统一运行在 port `3000` 并提供给前端对接。

### 4.1 获取国家队排行榜
*   **请求路径**: `GET /api/teams/rankings`
*   **请求参数**: 无
*   **响应示例 (Status 200)**:
```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "id": "ARG",
      "name": "阿根廷",
      "logoUrl": "https://img.example.com/flags/arg.png",
      "region": "南美洲",
      "strengthRank": 1,
      "bestRecord": "三届冠军 (1978, 1986, 2022)"
    },
    {
      "id": "FRA",
      "name": "法国",
      "logoUrl": "https://img.example.com/flags/fra.png",
      "region": "欧洲",
      "strengthRank": 2,
      "bestRecord": "两届冠军 (1998, 2018)"
    }
  ]
}
```

---

### 4.2 获取单个国家队详细数据（含历史战绩、阵型、出线历程及队内球员）
*   **请求路径**: `GET /api/teams/:id` (路径参数 `:id` 如 `ARG`)
*   **请求参数**: 无
*   **响应示例 (Status 200)**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "team": {
      "id": "ARG",
      "name": "阿根廷",
      "logoUrl": "https://img.example.com/flags/arg.png",
      "region": "南美洲",
      "strengthRank": 1,
      "bestRecord": "三届冠军 (1978, 1986, 2022)",
      "historyStats": {
        "appearances": 18,
        "matchesPlayed": 88,
        "wins": 49,
        "draws": 16,
        "losses": 23
      },
      "qualifierRoad": [
        {"stage": "第1轮", "opponent": "厄瓜多尔", "score": "1-0", "status": "win", "desc": "梅西标志性任意球奠定南美开门红"},
        {"stage": "第12轮", "opponent": "巴西", "score": "1-0", "status": "win", "desc": "客场马拉卡纳球场历史性战胜死敌"},
        {"stage": "第16轮", "opponent": "智利", "score": "3-0", "status": "win", "desc": "提前锁定2026美加墨名额"}
      ],
      "formation": {
        "name": "4-3-3",
        "positions": [
          {"positionId": "GK", "role": "门将", "playerName": "达米安·马丁内斯", "coord": {"x": 50, "y": 90}},
          {"positionId": "LCB", "role": "左中卫", "playerName": "克里斯蒂安·罗梅罗", "coord": {"x": 35, "y": 70}},
          {"positionId": "RCB", "role": "右中卫", "playerName": "尼古拉斯·奥塔门迪", "coord": {"x": 65, "y": 70}},
          {"positionId": "LB", "role": "左后卫", "playerName": "尼古拉斯·塔利亚菲科", "coord": {"x": 15, "y": 65}},
          {"positionId": "RB", "role": "右后卫", "playerName": "纳韦尔·莫利纳", "coord": {"x": 85, "y": 65}},
          {"positionId": "DM", "role": "防守型中场", "playerName": "恩佐·费尔南德斯", "coord": {"x": 50, "y": 45}},
          {"positionId": "LCM", "role": "左中场", "playerName": "阿莱克西斯·麦卡利斯特", "coord": {"x": 30, "y": 35}},
          {"positionId": "RCM", "role": "右中场", "playerName": "罗德里戈·德保罗", "coord": {"x": 70, "y": 35}},
          {"positionId": "LW", "role": "左翼锋", "playerName": "劳塔罗·马丁内斯", "coord": {"x": 20, "y": 15}},
          {"positionId": "RW", "role": "右翼锋", "playerName": "里奥·梅西", "coord": {"x": 80, "y": 15}},
          {"positionId": "CF", "role": "中锋", "playerName": "胡利安·阿尔瓦雷斯", "coord": {"x": 50, "y": 10}}
        ]
      }
    },
    "players": [
      {
        "id": "p_messi",
        "name": "里奥·梅西",
        "avatarUrl": "https://img.example.com/players/messi.png",
        "position": "FW",
        "marketValue": 3500.0,
        "commercialValue": 99.5,
        "isStar": true
      },
      {
        "id": "p_alvarez",
        "name": "胡利安·阿尔瓦雷斯",
        "avatarUrl": "https://img.example.com/players/alvarez.png",
        "position": "FW",
        "marketValue": 9000.0,
        "commercialValue": 88.0,
        "isStar": false
      },
      {
        "id": "p_enzo",
        "name": "恩佐·费尔南德斯",
        "avatarUrl": "https://img.example.com/players/enzo.png",
        "position": "MF",
        "marketValue": 7500.0,
        "commercialValue": 85.0,
        "isStar": false
      }
    ]
  }
}
```
*   *注: 后端根据此接口响应的球员列表已预先完成优先排序逻辑: 优先选出 `isStar = true` 的明星球员放在列表头部，紧随其后的普通球员及明星球员内，再按照 `marketValue` 大小进行降序。*

---

### 4.3 获取全局所有国家球员排名
*   **请求路径**: `GET /api/players/rankings`
*   **请求参数**:
    *   `sortBy` (查询参数): 可选值为 `market_value` (身价) 或 `commercial_value` (商业价值)。默认值为 `market_value`。
*   **响应示例 (Status 200)**:
```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "id": "p_mbappe",
      "name": "基利安·姆巴佩",
      "teamName": "法国",
      "avatarUrl": "https://img.example.com/players/mbappe.png",
      "position": "FW",
      "marketValue": 18000.0,
      "commercialValue": 98.0
    },
    {
      "id": "p_bellingham",
      "name": "裘德·贝林厄姆",
      "teamName": "英格兰",
      "avatarUrl": "https://img.example.com/players/bellingham.png",
      "position": "MF",
      "marketValue": 18000.0,
      "commercialValue": 95.5
    }
  ]
}
```

---

### 4.4 获取球员个人详细数据
*   **请求路径**: `GET /api/players/:id` (路径参数 `:id` 如 `p_messi`)
*   **请求参数**: 无
*   **响应示例 (Status 200)**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "id": "p_messi",
    "name": "里奥·梅西",
    "avatarUrl": "https://img.example.com/players/messi.png",
    "teamId": "ARG",
    "teamName": "阿根廷",
    "age": 38,
    "position": "FW",
    "club": "迈阿密国际",
    "marketValue": 3500.0,
    "commercialValue": 99.5,
    "isStar": true,
    "ability": {
      "pace": 80,
      "shooting": 92,
      "passing": 95,
      "dribbling": 96,
      "defending": 40,
      "physical": 68
    },
    "matchStats": {
      "appearances": 7,
      "goals": 5,
      "assists": 3,
      "keyPasses": 3.4,
      "interceptions": 0.2,
      "rating": 8.45
    }
  }
}
```

---

## 5. 项目架构保障与非功能要求
1.  **极度严密地不额外添加任何用户社交等非指定功能**。不制造冗余的数据输入及不确定性 API。
2.  **前端 React 完全单页面微应用级仿真实现**，利用 Canvas 或可视化雷达插件 (如 SVG / D3.js)、纯 CSS / Tailwind 提供阵型展示与拖挂对比图。
3.  **支持无阻塞地多维比对**，在数据发生异常空缺的情况下，自动显示兜底头像与默认 0 分雷达图，确保系统健壮。
