import type { Question } from './types';

/**
 * 30 道内置题。
 * level 1 = 热身 / level 2 = 脑洞 / level 3 = 高阶
 */
export const QUESTIONS: Question[] = [
  /* ---------- LEVEL 1 · 热身 ---------- */
  {
    id:'rainy-cat', level:1, tag:'直白现场', emoji:'🐱🌧️💔',
    answers:[
      {text:'猫在雨里心碎', score:92, keywords:['猫','雨','心碎','失恋','淋雨']},
      {text:'一只淋雨 emo 的猫', score:88, keywords:['猫','淋雨','emo','难过','下雨']}
    ],
    fallback:25
  },
  {
    id:'midnight-noodles', level:1, tag:'生活切片', emoji:'🍜🌙😋',
    answers:[
      {text:'深夜吃泡面', score:92, keywords:['深夜','半夜','泡面','吃面','夜宵']},
      {text:'半夜饿了起来煮面', score:90, keywords:['半夜','饿','煮面','夜宵','面条']},
      {text:'月亮陪我吃夜宵', score:88, keywords:['月亮','夜宵','面条','一个人']}
    ],
    fallback:25
  },
  {
    id:'dog-bath', level:1, tag:'生活切片', emoji:'🐶🛁😱',
    answers:[
      {text:'给狗洗澡像打仗', score:92, keywords:['狗','洗澡','打仗','害怕','挣扎']},
      {text:'狗狗抗拒洗澡', score:90, keywords:['狗','抗拒','洗澡','害怕','逃跑']}
    ],
    fallback:25
  },
  {
    id:'birthday-surprise', level:1, tag:'生活切片', emoji:'🎂🕯️🤫',
    answers:[
      {text:'偷偷准备生日惊喜', score:94, keywords:['生日','惊喜','偷偷','准备','蛋糕']},
      {text:'关灯许愿吹蜡烛', score:92, keywords:['关灯','许愿','吹蜡烛','生日','蛋糕']},
      {text:'给朋友过生日', score:88, keywords:['朋友','生日','蛋糕','庆祝']}
    ],
    fallback:25
  },
  {
    id:'phone-battery', level:1, tag:'生活切片', emoji:'📱🔋😭',
    answers:[
      {text:'手机没电了', score:94, keywords:['手机','没电','电量','充电','关机']},
      {text:'到处找充电宝', score:90, keywords:['到处找','充电宝','充电','手机','没电']},
      {text:'电量焦虑', score:88, keywords:['电量','焦虑','低电量','手机']}
    ],
    fallback:25
  },
  {
    id:'coffee-overtime', level:1, tag:'打工人日常', emoji:'☕😴💻',
    answers:[
      {text:'靠咖啡续命', score:92, keywords:['咖啡','续命','困','熬夜','上班']},
      {text:'上班困到睁不开眼', score:90, keywords:['上班','困','睁不开眼','打工人','累']},
      {text:'打工人熬夜加班', score:90, keywords:['打工人','熬夜','加班','咖啡','累']}
    ],
    fallback:25
  },
  {
    id:'subway-rush', level:1, tag:'打工人日常', emoji:'🚇👥😩',
    answers:[
      {text:'地铁早高峰挤爆了', score:94, keywords:['地铁','早高峰','挤','爆','通勤']},
      {text:'上班路上人挤人', score:90, keywords:['上班','路上','人挤人','通勤','挤']},
      {text:'挤地铁上不去', score:88, keywords:['挤','地铁','上不去','人多']}
    ],
    fallback:25
  },
  {
    id:'snooze', level:1, tag:'打工人日常', emoji:'🛏️⏰😖',
    answers:[
      {text:'闹钟响了还想赖床', score:94, keywords:['闹钟','响','赖床','不想起','再睡']},
      {text:'再睡五分钟', score:92, keywords:['再睡','五分钟','赖床','起床','睡']},
      {text:'上班要迟到了起不来', score:88, keywords:['上班','迟到','起不来','起床']}
    ],
    fallback:25
  },
  {
    id:'summer-home', level:1, tag:'夏日限定', emoji:'🍉📺☀️',
    answers:[
      {text:'空调西瓜追剧', score:94, keywords:['空调','西瓜','追剧','夏天','宅']},
      {text:'夏天宅家不出门', score:92, keywords:['夏天','宅家','不出门','空调','西瓜']},
      {text:'理想中的暑假', score:88, keywords:['理想','暑假','夏天','宅','快乐']}
    ],
    fallback:25
  },
  {
    id:'turtle-rabbit', level:1, tag:'经典寓言', emoji:'🐢🐇🏁',
    answers:[
      {text:'龟兔赛跑', score:96, keywords:['龟兔赛跑','乌龟','兔子','赛跑','终点']},
      {text:'乌龟跑赢了兔子', score:92, keywords:['乌龟','跑赢','兔子','骄傲','终点']},
      {text:'兔子睡觉乌龟赢', score:90, keywords:['兔子','睡觉','乌龟','赢','比赛']}
    ],
    fallback:25
  },

  /* ---------- LEVEL 2 · 脑洞 ---------- */
  {
    id:'office-fish', level:2, tag:'打工人日常', emoji:'🐟💼😎',
    answers:[
      {text:'上班摸鱼', score:95, keywords:['上班','摸鱼','工作','偷懒','划水']},
      {text:'带薪摸鱼', score:94, keywords:['带薪','摸鱼','上班','划水','偷懒']},
      {text:'打工人偷偷划水', score:90, keywords:['打工人','偷偷','划水','摸鱼']}
    ],
    fallback:26
  },
  {
    id:'laugh-dead', level:2, tag:'网络热梗', emoji:'💀📱😂',
    answers:[
      {text:'笑死我了', score:95, keywords:['笑死','好笑','笑','手机','绷不住']},
      {text:'刷手机笑到去世', score:92, keywords:['手机','刷','笑到','去世','好笑']},
      {text:'蚌埠住了', score:90, keywords:['蚌埠','绷不住','笑','忍不住']}
    ],
    fallback:26
  },
  {
    id:'clown-self', level:2, tag:'网络热梗', emoji:'🤡🪞😭',
    answers:[
      {text:'小丑竟是我自己', score:96, keywords:['小丑','自己','竟是我','破防','镜子']},
      {text:'照镜子发现我是小丑', score:93, keywords:['镜子','小丑','自己','发现','破防']},
      {text:'我才是那个小丑', score:90, keywords:['小丑','才是','破防']}
    ],
    fallback:26
  },
  {
    id:'single-dog-food', level:2, tag:'网络热梗', emoji:'🐶🍚😭',
    answers:[
      {text:'单身狗吃狗粮', score:95, keywords:['单身狗','狗粮','吃','情侣','秀恩爱']},
      {text:'被情侣秀恩爱', score:92, keywords:['情侣','秀恩爱','单身','狗粮','酸']},
      {text:'狗粮吃到撑', score:90, keywords:['狗粮','吃到撑','单身','情侣']}
    ],
    fallback:26
  },
  {
    id:'niubi', level:2, tag:'网络热梗', emoji:'🐮🍺👍',
    answers:[
      {text:'牛批', score:95, keywords:['牛批','牛','厉害','强','服']},
      {text:'太牛了不得不服', score:93, keywords:['太牛','厉害','不得不服','强','牛']},
      {text:'这也太强了吧', score:90, keywords:['太强','厉害','牛','佩服']}
    ],
    fallback:26
  },
  {
    id:'brick-work', level:2, tag:'打工人日常', emoji:'🧱💦😮‍💨',
    answers:[
      {text:'打工人搬砖', score:95, keywords:['搬砖','打工人','上班','辛苦','累']},
      {text:'辛苦搬砖一天', score:92, keywords:['辛苦','搬砖','一天','累','上班']},
      {text:'上班累成狗', score:90, keywords:['上班','累成狗','累','打工']}
    ],
    fallback:26
  },
  {
    id:'lemon', level:2, tag:'谐音 / 网络', emoji:'🍋🍋🍋',
    answers:[
      {text:'柠檬精', score:95, keywords:['柠檬','精','酸','羡慕','嫉妒']},
      {text:'我酸了', score:93, keywords:['酸','羡慕','嫉妒']},
      {text:'羡慕嫉妒恨', score:92, keywords:['羡慕','嫉妒','恨','酸']}
    ],
    fallback:26
  },
  {
    id:'mouse-birthday', level:2, tag:'脑洞联想', emoji:'🕳️🐭🎂',
    answers:[
      {text:'老鼠在洞里过生日', score:95, keywords:['老鼠','洞','生日','蛋糕','过生日']},
      {text:'地洞生日派对', score:92, keywords:['地洞','生日','派对','老鼠','蛋糕']},
      {text:'小老鼠庆生', score:90, keywords:['老鼠','庆生','生日','蛋糕']}
    ],
    fallback:26
  },
  {
    id:'chicken-dog', level:2, tag:'成语现场', emoji:'🐔🐶💥',
    answers:[
      {text:'鸡飞狗跳', score:96, keywords:['鸡飞狗跳','鸡','狗','乱','炸']},
      {text:'家里乱成一锅粥', score:92, keywords:['家里','乱','一锅粥','鸡','狗']},
      {text:'鸡和狗都炸了', score:90, keywords:['鸡','狗','炸','乱']}
    ],
    fallback:26
  },
  {
    id:'hot-face', level:2, tag:'俗语现场', emoji:'🔥😊🧊',
    answers:[
      {text:'热脸贴冷屁股', score:96, keywords:['热脸','冷屁股','热情','冷漠','贴']},
      {text:'热情遇到冷漠', score:92, keywords:['热情','冷漠','冷','热','碰壁']},
      {text:'讨好却被冷落', score:90, keywords:['讨好','冷落','冷漠','热脸']}
    ],
    fallback:26
  },

  /* ---------- LEVEL 3 · 高阶 ---------- */
  {
    id:'cry-laugh', level:3, tag:'情绪现场', emoji:'😭😂😭',
    answers:[
      {text:'哭笑不得', score:96, keywords:['哭笑不得','又哭又笑','哭','笑','悲喜']},
      {text:'又哭又笑', score:94, keywords:['又哭又笑','哭','笑','情绪','复杂']},
      {text:'悲喜交加', score:92, keywords:['悲喜交加','悲喜','哭','笑','复杂']}
    ],
    fallback:26
  },
  {
    id:'chicken-basketball', level:3, tag:'网络热梗', emoji:'🐔🏀🎵',
    answers:[
      {text:'鸡你太美', score:96, keywords:['鸡你太美','篮球','唱跳','rap','只因']},
      {text:'唱跳 rap 篮球', score:95, keywords:['唱跳','rap','篮球','鸡','蔡徐坤']},
      {text:'蔡徐坤打篮球', score:92, keywords:['蔡徐坤','篮球','鸡','唱跳']}
    ],
    fallback:26
  },
  {
    id:'lonely-frog', level:3, tag:'网络热梗', emoji:'🐸📱💔',
    answers:[
      {text:'七夕孤寡青蛙', score:96, keywords:['七夕','孤寡','青蛙','单身','叫']},
      {text:'孤寡青蛙', score:94, keywords:['孤寡','青蛙','单身','七夕']},
      {text:'单身蛙', score:90, keywords:['单身','青蛙','孤寡','七夕']}
    ],
    fallback:26
  },
  {
    id:'family-bucket', level:3, tag:'脑洞联想', emoji:'👨‍👩‍👧‍👦🍗🪣',
    answers:[
      {text:'一家人整整齐齐', score:94, keywords:['一家人','整整齐齐','全家','炸鸡','桶']},
      {text:'全家桶', score:96, keywords:['全家桶','全家','炸鸡','桶','一家人']},
      {text:'全家一起吃炸鸡', score:90, keywords:['全家','一起','吃','炸鸡','桶']}
    ],
    fallback:26
  },
  {
    id:'three-monkeys', level:3, tag:'经典典故', emoji:'🙈🙉🙊',
    answers:[
      {text:'三不猴', score:96, keywords:['三不猴','不看','不听','不说','猴子']},
      {text:'非礼勿视非礼勿听非礼勿言', score:94, keywords:['非礼勿视','非礼勿听','非礼勿言','不看','不说']},
      {text:'不看 不听 不说', score:92, keywords:['不看','不听','不说','闭嘴','捂住']}
    ],
    fallback:26
  },
  {
    id:'wolf-coming', level:3, tag:'经典典故', emoji:'🐺🐑👦',
    answers:[
      {text:'狼来了', score:96, keywords:['狼来了','狼','羊','男孩','撒谎']},
      {text:'放羊娃撒谎', score:93, keywords:['放羊','娃','撒谎','狼','羊']},
      {text:'狼吃羊', score:90, keywords:['狼','吃','羊','男孩']}
    ],
    fallback:26
  },
  {
    id:'apple-expensive', level:3, tag:'生活切片', emoji:'🍎📱💸',
    answers:[
      {text:'苹果手机太贵', score:95, keywords:['苹果','手机','贵','买不起','肾']},
      {text:'卖肾买 iPhone', score:94, keywords:['卖肾','iphone','苹果','手机','贵']},
      {text:'买不起苹果手机', score:92, keywords:['买不起','苹果','手机','贵']}
    ],
    fallback:26
  },
  {
    id:'deadline', level:3, tag:'打工人日常', emoji:'🕰️🧑‍💻🌙',
    answers:[
      {text:'熬夜赶 deadline', score:95, keywords:['熬夜','deadline','赶','加班','时间']},
      {text:'时间不够用了', score:92, keywords:['时间','不够','deadline','焦虑','赶']},
      {text:'打工人熬夜加班', score:90, keywords:['打工人','熬夜','加班','累']}
    ],
    fallback:26
  },
  {
    id:'sea-king', level:3, tag:'网络热梗', emoji:'🌊👑🐟',
    answers:[
      {text:'海王', score:95, keywords:['海王','鱼塘','渣男','鱼','海']},
      {text:'鱼塘塘主', score:93, keywords:['鱼塘','塘主','海王','鱼']},
      {text:'大海里的王', score:88, keywords:['大海','王','鱼','海']}
    ],
    fallback:26
  },
  {
    id:'involution', level:3, tag:'网络热梗', emoji:'🌀🌀🌀',
    answers:[
      {text:'卷起来了', score:95, keywords:['卷','内卷','卷王','起来','螺旋']},
      {text:'内卷', score:94, keywords:['内卷','卷','卷王','竞争']},
      {text:'卷王之王', score:92, keywords:['卷王','卷','内卷','王']}
    ],
    fallback:26
  }
];
