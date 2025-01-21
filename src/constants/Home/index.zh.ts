import { IMAGES } from './images';

export const HERO_SECTION = {
  joinInformation: {
    title: '搶先加入Poklist',
    descriprion: '目前僅限內容創作者申請「創作者帳號」。',
    buttonText: '如何申請創作者帳號？',
  },
  accountOwner: {
    title: '我擁有創作者帳號!',
    buttonText: 'Google 登入',
  },
  nonCreatorQuestion: '非內容創作者也能使用 Poklist 嗎？',
};
export const FEATURE_SECTION = {
  title: '創作我的靈感名單',
  descriprion: '獵奇有趣的事物，創作新奇的名單，追蹤超有料的好靈感。',
};
export const LIST_SECTION = {
  lifeStyle: {
    title: '生活風格',
    user: '小資一姐',
    account: '＠weeklythrifts',
    userAvatar: IMAGES.avatar.lifeStyle,
    listCount: '12',
    listTitle: '大學宿舍日常必備清單',
    lists: [
      {
        id: 1,
        title: '折疊購物袋',
        description: '環保又方便，隨身攜帶超實用。 尤其是在...',
        image: IMAGES.list.lifeStyle.list1,
      },
      {
        id: 2,
        title: '定時咖啡機',
        description: '早晨神救援，一醒來就有熱咖啡，我覺得...',
        image: IMAGES.list.lifeStyle.list2,
      },
      {
        id: 3,
        title: '迷你空氣清淨機',
        description: '最近過敏鼻子整組壞掉，好險有書桌上的...',
        image: IMAGES.list.lifeStyle.list3,
      },
    ],
  },
  foodAndDrink: {
    title: '美食',
    user: 'Stacy Chambers',
    account: '＠thechambers',
    userAvatar: IMAGES.avatar.foodAndDrink,
    listCount: '24',
    listTitle: '我的週末咖啡日記',
    lists: [
      {
        id: 1,
        title: '早上 8:00 小香咖啡 ',
        description: '我家附近開最早的咖啡！',
        image: IMAGES.list.foodAndDrink.list1,
      },
      {
        id: 2,
        title: '中午 12:30 爵士咖啡館 ',
        description: '最近週末迷上爵士音樂，這裡真的超放鬆的！',
        image: IMAGES.list.foodAndDrink.list2,
      },
      {
        id: 3,
        title: '下午 3:00 Brew & Bloom',
        description: '完全是衝著他們的點心而來！',
        image: IMAGES.list.foodAndDrink.list3,
      },
    ],
  },
  culture: {
    title: '文化',
    user: '大學生秘技',
    account: '＠campustips',
    userAvatar: IMAGES.avatar.culture,
    listCount: '19',
    listTitle: '筆記：去音樂祭前一定要看',
    lists: [
      {
        id: 1,
        title: '超基本配備',
        description: '水壺與輕便的鞋子非常重要！防曬乳千萬不要...',
        image: IMAGES.list.culture.list1,
      },
      {
        id: 2,
        title: '多帶一件',
        description: 'Tshirt 最好多帶一件，薄外套絕對不能少！',
        image: IMAGES.list.culture.list2,
      },
      {
        id: 3,
        title: '超重要秘技',
        description: '一定要帶地墊與手提袋，佔地的好武器！',
        image: IMAGES.list.culture.list3,
      },
    ],
  },
  travel: {
    title: '旅遊',
    user: '無聊就輸了',
    account: '＠lifehacker',
    userAvatar: IMAGES.avatar.travel,
    listCount: '8',
    listTitle: '小資旅遊的好方法',
    lists: [
      {
        id: 1,
        title: '決定好可花的總金額',
        description: '車票、機票與飯店幾乎是固定的費用，抓...',
        image: IMAGES.list.travel.list1,
      },
      {
        id: 2,
        title: '只搜特惠',
        description: '使用訂票時，打開篩選特惠，先專注特惠...',
        image: IMAGES.list.travel.list2,
      },
      {
        id: 3,
        title: '訂票秘招',
        description: '不是越早訂越便宜，有時反而是越晚訂越...',
        image: IMAGES.list.travel.list3,
      },
    ],
  },
  entertainment: {
    title: '娛樂',
    user: 'Viv Wang',
    account: '＠vivwang',
    userAvatar: IMAGES.avatar.entertainment,
    listCount: '22',
    listTitle: '按心情的追劇法',
    lists: [
      {
        id: 1,
        title: '放鬆: 海洋奇緣',
        description: '一部充滿溫暖與冒險的動畫電影，畫面美麗，...',
        image: IMAGES.list.entertainment.list1,
      },
      {
        id: 2,
        title: '緊張: 天能 ',
        description: '克里斯多福諾蘭執導的燒腦動作片，充滿時間...',
        image: IMAGES.list.entertainment.list2,
      },
      {
        id: 3,
        title: '有趣: 阿呆與阿瓜',
        description: '兩位完全笨到極致的好朋友，展開一場荒唐的...',
        image: IMAGES.list.entertainment.list3,
      },
    ],
  },
  techAndDigital: {
    title: '數位科技',
    user: '讀讀科技',
    account: '＠itech',
    userAvatar: IMAGES.avatar.techAndDigital,
    listCount: '10',
    listTitle: '懶人提升效率的科技小物',
    lists: [
      {
        id: 1,
        title: 'Notion',
        description: '整合筆記與項目管理，效率爆表。一定要...',
        image: IMAGES.list.techAndDigital.list1,
      },
      {
        id: 2,
        title: 'Google Drive',
        description: '最近我連健身運動都用GD! 有興趣的可以...',
        image: IMAGES.list.techAndDigital.list2,
      },
      {
        id: 3,
        title: 'ChatGPT',
        description: 'AI真的省去我50%的工作時間，而且效率...',
        image: IMAGES.list.techAndDigital.list3,
      },
    ],
  },
  personalGrowth: {
    title: '個人成長',
    user: '上班中的妞',
    account: '＠corpgirlies',
    userAvatar: IMAGES.avatar.personalGrowth,
    listCount: '24',
    listTitle: '《原子習慣》讀到的事...',
    lists: [
      {
        id: 1,
        title: '從小開始',
        description: '一口氣想做大事，往往最後一事無成啊！',
        image: IMAGES.list.personalGrowth.list1,
      },
      {
        id: 2,
        title: '打造一個系統，而非結果！',
        description: '這個超有感的！過去我總是想要有一個厲...',
        image: IMAGES.list.personalGrowth.list2,
      },
      {
        id: 3,
        title: '接受新的身份',
        description: '這思考非常特別，有時候自己對自己的價值...',
        image: IMAGES.list.personalGrowth.list3,
      },
    ],
  },
  healthAndFitness: {
    title: '健康與健身',
    user: '匹克匹克',
    account: '＠picapica',
    userAvatar: '',
    listCount: '17',
    listTitle: '高蛋白飲料~原來超簡單做的',
    lists: [
      {
        id: 1,
        title: '步驟一：把所有材料準備好',
        description: '先把東西都放在一起準備好，因為超簡單...',
        image: IMAGES.list.healthAndFitness.list1,
      },
      {
        id: 2,
        title: '步驟二: 先把基礎的倒進來',
        description: '把牛奶與高蛋白先倒在一起，如此就已經...',
        image: IMAGES.list.healthAndFitness.list2,
      },
      {
        id: 3,
        title: '步驟三：加入增肌配方',
        description: '堅果是超棒的配方，馬上讓你有飽足感又...',
        image: IMAGES.list.healthAndFitness.list3,
      },
    ],
  },
  other: {
    title: '其他',
    user: 'Jacob PHD',
    account: '＠jacobphd',
    userAvatar: '',
    listCount: '13',
    listTitle: '絕對左甩的交友檔案',
    lists: [
      {
        id: 1,
        title: '太詐騙的照片',
        description: '老實說...我每次都覺得這麼假的照片也敢...',
        image: IMAGES.list.other.list1,
      },
      {
        id: 2,
        title: '沒有編輯的自介文字',
        description: '有些人的自介人格分裂，然後又錯字連篇...',
        image: IMAGES.list.other.list2,
      },
      {
        id: 3,
        title: '自拍照裡的房間亂到像核爆',
        description: '這是我的問題，但我眼睛真的很利！哈！',
        image: IMAGES.list.other.list3,
      },
    ],
  },
};
export const TUTORIAL_SECTION = [
  {
    title: '關於Poklist',
    url: '',
  },
  {
    title: '快速教學',
    url: '',
  },
  {
    title: '問與答',
    url: '',
  },
  {
    title: '加入團隊',
    url: '',
  },
];

export const FOOTER_SECTION = [
  {
    title: '媒體報導',
    url: '',
  },
  {
    title: '聯繫我們',
    url: '',
  },
  {
    title: '使用者條款',
    url: '',
  },
  {
    title: '隱私權保護政策',
    url: '',
  },
  {
    title: '額外公告',
    url: '',
  },
];
