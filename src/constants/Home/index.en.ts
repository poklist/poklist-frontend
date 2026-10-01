import { ExternalLinks } from '@/constants/externalLink';
import { IMAGES } from '@/constants/Home/images';
import { msg } from '@lingui/macro';

export const HERO_SECTION = {
  joinInformation: {
    title: msg`加入 Relist，分享靈感！`,
    descriprion: msg`目前僅開放創作者申請帳號`,
    buttonText: msg`快速申請`,
  },
  accountOwner: {
    title: '',
    buttonText: msg`創作者帳號登入`,
  },
  nonCreatorQuestion: {
    title: msg`非創作者也能加入嗎？`,
    url: ExternalLinks.CAN_NON_CREATORS_USE_RELIST,
  },
};
export const FEATURE_SECTION = {
  title: msg`簡單打造影響力`,
  description: msg`你的精選就能吸引懂你的人`,
};

export const LIST_SECTION = {
  lifeStyle: {
    title: 'Lifestyle',
    user: msg`小資妹`,
    account: '@inspogirlie',
    userAvatar: IMAGES.avatar.lifeStyle,
    listCount: '12',
    listTitle: msg`大學宿舍日常必備清單`,
    lists: [
      {
        id: 1,
        title: msg`舒服的海綿床`,
        description: msg`我發現好在床上的時間比想像的多，有一個舒服的床真的舒適許多。`,
        image: IMAGES.list.lifeStyle.list1,
      },
      {
        id: 2,
        title: msg`桌上收納盒`,
        description: msg`桌上的收納盒超重要，讓桌上乾淨又一目暸然。`,
        image: IMAGES.list.lifeStyle.list2,
      },
      {
        id: 3,
        title: msg`無線隨身音響`,
        description: msg`耳機是必備，但無線音響讓聽音樂更自由舒適，超愛的！`,
        image: IMAGES.list.lifeStyle.list3,
      },
    ],
  },
  foodAndDrink: {
    title: 'Food & Drink',
    user: msg`List Lab`,
    account: '@ListLab',
    userAvatar: IMAGES.avatar.foodAndDrink,
    listCount: '24',
    listTitle: msg`我的週末咖啡日記`,
    lists: [
      {
        id: 1,
        title: msg`早上 8:00 小香咖啡`,
        description: msg`我家附近開最早的咖啡！`,
        image: IMAGES.list.foodAndDrink.list1,
      },
      {
        id: 2,
        title: msg`中午 12:30 爵士咖啡館`,
        description: msg`最近週末迷上爵士音樂，這裡真的超放鬆的！`,
        image: IMAGES.list.foodAndDrink.list2,
      },
      {
        id: 3,
        title: msg`下午 3:00 Brew & Bloom`,
        description: msg`完全是衝著他們的點心而來！`,
        image: IMAGES.list.foodAndDrink.list3,
      },
    ],
  },
  culture: {
    title: 'Culture',
    user: msg`大學生秘技`,
    account: '@campusppl',
    userAvatar: IMAGES.avatar.culture,
    listCount: '19',
    listTitle: msg`筆記：去音樂祭前一定要看`,
    lists: [
      {
        id: 1,
        title: msg`超基本配備`,
        description: msg`水壺與輕便的鞋子非常重要！防曬乳千萬不要忘了！`,
        image: IMAGES.list.culture.list1,
      },
      {
        id: 2,
        title: msg`多帶一件`,
        description: msg`Tshirt 最好多帶一件，薄外套絕對不能少！`,
        image: IMAGES.list.culture.list2,
      },
      {
        id: 3,
        title: msg`超重要秘技`,
        description: msg`一定要帶地墊與手提袋，佔地的好武器！`,
        image: IMAGES.list.culture.list3,
      },
    ],
  },
  travel: {
    title: 'Travel',
    user: msg`無聊就輸了`,
    account: '@travellover',
    userAvatar: IMAGES.avatar.travel,
    listCount: '8',
    listTitle: msg`小資旅遊的好方法`,
    lists: [
      {
        id: 1,
        title: msg`決定好可花的總金額`,
        description: msg`車票、機票與飯店幾乎是固定的費用，抓好總金額就對了！`,
        image: IMAGES.list.travel.list1,
      },
      {
        id: 2,
        title: msg`只搜特惠`,
        description: msg`使用訂票時，打開篩選特惠，先專注特惠價格。`,
        image: IMAGES.list.travel.list2,
      },
      {
        id: 3,
        title: msg`訂票快狠準`,
        description: msg`不是越早訂越便宜，有時反而是越晚訂越優惠！`,
        image: IMAGES.list.travel.list3,
      },
    ],
  },
  entertainment: {
    title: 'Entertainment',
    user: msg`八卦生活`,
    account: '@Gossippie',
    userAvatar: IMAGES.avatar.entertainment,
    listCount: '22',
    listTitle: msg`按心情的追劇法`,
    lists: [
      {
        id: 1,
        title: msg`放鬆: 海洋奇緣`,
        description: msg`一部充滿溫暖與冒險的動畫電影，畫面美麗，音樂動人，帶來滿滿的療癒感。`,
        image: IMAGES.list.entertainment.list1,
      },
      {
        id: 2,
        title: msg`緊張: 天能 `,
        description: msg`克里斯多福諾蘭執導的燒腦動作片，充滿時間逆轉的緊湊劇情，讓你全程屏息。`,
        image: IMAGES.list.entertainment.list2,
      },
      {
        id: 3,
        title: msg`有趣: 阿呆與阿瓜`,
        description: msg`兩位完全笨到極致的好朋友，展開一場荒唐的公路旅行，充滿令人哭笑不得的鬧劇！這部經典絕對讓你笑到停不下來。`,
        image: IMAGES.list.entertainment.list3,
      },
    ],
  },
  techAndDigital: {
    title: 'Tech & Digital',
    user: msg`讀讀科技`,
    account: '@itech',
    userAvatar: IMAGES.avatar.techAndDigital,
    listCount: '10',
    listTitle: msg`懶人提升效率的APP`,
    lists: [
      {
        id: 1,
        title: msg`Notion`,
        description: msg`整合筆記與項目管理，效率爆表。一定要去下載!`,
        image: IMAGES.list.techAndDigital.list1,
      },
      {
        id: 2,
        title: msg`Google Drive`,
        description: msg`最近我連健身運動都用GD! 有興趣的可以跟我說`,
        image: IMAGES.list.techAndDigital.list2,
      },
      {
        id: 3,
        title: msg`ChatGPT`,
        description: msg`AI真的省去我50%的工作時間，而且效率還超越`,
        image: IMAGES.list.techAndDigital.list3,
      },
    ],
  },
  personalGrowth: {
    title: 'Personal Growth',
    user: msg`上班中的妞`,
    account: '@goodhabbits',
    userAvatar: IMAGES.avatar.personalGrowth,
    listCount: '24',
    listTitle: msg`《原子習慣》讀到的智慧…`,
    lists: [
      {
        id: 1,
        title: msg`從小開始`,
        description: msg`一口氣想做大事，往往最後一事無成啊！`,
        image: IMAGES.list.personalGrowth.list1,
      },
      {
        id: 2,
        title: msg`打造一個系統，而非結果！`,
        description: msg`這個超有感的！過去我總是想要有一個厲害的結果。`,
        image: IMAGES.list.personalGrowth.list2,
      },
      {
        id: 3,
        title: msg`接受新的身份`,
        description: msg`這思考非常特別，有時候自己對自己的價值任何能夠改變事情的開始與結果。`,
        image: IMAGES.list.personalGrowth.list3,
      },
    ],
  },
  healthAndFitness: {
    title: 'Health & Fitness',
    user: msg`Pica Pica`,
    account: '@Pica Pica',
    userAvatar: IMAGES.avatar.healthAndFitness,
    listCount: '17',
    listTitle: msg`高蛋白飲料~原來超簡單做的`,
    lists: [
      {
        id: 1,
        title: msg`步驟一 ：把所有材料準備好`,
        description: msg`先把東西都放在一起準備好，因為超簡單的！`,
        image: IMAGES.list.healthAndFitness.list1,
      },
      {
        id: 2,
        title: msg`步驟二: 先把基礎的倒進來`,
        description: msg`把牛奶與高蛋白先倒在一起，如此就已經做對一半！`,
        image: IMAGES.list.healthAndFitness.list2,
      },
      {
        id: 3,
        title: msg`步驟三：加入增肌配方`,
        description: msg`堅果是超棒的配方，馬上讓你有飽足感又很可口好喝！`,
        image: IMAGES.list.healthAndFitness.list3,
      },
    ],
  },
  other: {
    title: 'Other',
    user: msg`末日研究生`,
    account: '@Jacobphd',
    userAvatar: IMAGES.avatar.other,
    listCount: '13',
    listTitle: msg`絕對左甩的交友檔案`,
    lists: [
      {
        id: 1,
        title: msg`太詐騙的照片`,
        description: msg`老實說...我每次都覺得這麼假的照片也敢放上來，當作大家是瞎子嗎？`,
        image: IMAGES.list.other.list1,
      },
      {
        id: 2,
        title: msg`沒有編輯的自介文字`,
        description: msg`有些人的自介人格分裂，然後又錯字連篇，我真心無法違背自己良心右甩。`,
        image: IMAGES.list.other.list2,
      },
      {
        id: 3,
        title: msg`自拍照裡的房間亂到像核爆`,
        description: msg`這是我的問題，但我眼睛真的很利！哈！`,
        image: IMAGES.list.other.list3,
      },
    ],
  },
};
export const TUTORIAL_SECTION = [
  {
    title: msg`關於我們`,
    url: ExternalLinks.ABOUT,
  },
  {
    title: msg`快速教學`,
    url: ExternalLinks.TUTORIALS,
  },
  {
    title: msg`問與答`,
    url: ExternalLinks.FAQ,
  },
  {
    title: msg`加入團隊`,
    url: ExternalLinks.JOIN_TEAM,
  },
];
export const FOOTER_SECTION = [
  {
    title: msg`媒體報導`,
    url: ExternalLinks.PRESS,
  },
  {
    title: msg`聯繫我們`,
    url: ExternalLinks.CONTACT_US,
  },
  {
    title: msg`使用者條款`,
    url: ExternalLinks.TERMS,
  },
  {
    title: msg`隱私權保護政策`,
    url: ExternalLinks.PRIVACY,
  },
  {
    title: msg`額外公告`,
    url: ExternalLinks.COLLECTION_NOTICE,
  },
];
export const SOCIAL_MEDIA = [
  {
    name: 'Discord',
    icon: IMAGES.socialMedia.discord,
    url: ExternalLinks.DISCORD,
  },
  {
    name: 'Instagram',
    icon: IMAGES.socialMedia.instagram,
    url: ExternalLinks.INSTAGRAM,
  },
  {
    name: 'Threads',
    icon: IMAGES.socialMedia.threads,
    url: ExternalLinks.THREADS,
  },
  {
    name: 'LinkedIn',
    icon: IMAGES.socialMedia.linkedin,
    url: ExternalLinks.LINKEDIN,
  },
];
export const ERROR_DIALOG = {
  title: msg`登入錯誤 - 查無此創作者`,
  description: msg`目前僅限已申請並被認證的「創作者帳號」登入並創作名單。如有疑問，請聯繫我們。`,
  buttonText: msg`聯繫我們`,
};
