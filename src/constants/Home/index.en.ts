import { IMAGES } from './images';

export const HERO_SECTION = {
  joinInformation: {
    title: 'Join Creator Account',
    descriprion:
      'For now, only content creators can apply for a “Creator Account.',
    buttonText: 'Apply for Creator Account?',
  },
  accountOwner: {
    title: 'Got a Creator Account',
    buttonText: 'Sign in with Google',
  },
  nonCreatorQuestion: {
    title: 'Can non-creators use Poklist?',
    url: '',
  },
};
export const FEATURE_SECTION = {
  title: 'List Your Ideas',
  description:
    'Turn thoughts into lists, discover fresh finds, and follow inspiration.',
};
export const LIST_SECTION = {
  lifeStyle: {
    title: 'Lifestyle',
    user: 'Weekly Thrifts',
    account: '＠weeklythrifts',
    userAvatar: IMAGES.avatar.lifeStyle,
    listCount: '12',
    listTitle: 'Must-Haves for dorm life',
    lists: [
      {
        id: 1,
        title: 'Cozy Bedding:',
        description: 'A plush comforter and extra pillows for a c...',
        image: IMAGES.list.lifeStyle.list1,
      },
      {
        id: 2,
        title: 'Desk Essentials',
        description: 'Target is probably your bf....',
        image: IMAGES.list.lifeStyle.list2,
      },
      {
        id: 3,
        title: 'Portable Speaker',
        description: 'For study breaks or casual dorm hangouts',
        image: IMAGES.list.lifeStyle.list3,
      },
    ],
  },
  foodAndDrink: {
    title: 'Food & Drink',
    user: 'Stacy Chambers',
    account: '＠thechambers',
    userAvatar: IMAGES.avatar.foodAndDrink,
    listCount: '24',
    listTitle: 'Stop-by-Stop Café Journey',
    lists: [
      {
        id: 1,
        title: '8:00 AM at Sunrise Café',
        description: 'Start your day with a creamy latte and a fr...',
        image: IMAGES.list.foodAndDrink.list1,
      },
      {
        id: 2,
        title: '12:30 PM at Artisan Coffee House',
        description: 'Enjoy a flat white with a hearty avocado to...',
        image: IMAGES.list.foodAndDrink.list2,
      },
      {
        id: 3,
        title: '3:00 PM at Brew & Bloom',
        description: 'Sip on a cold brew while indulging in a lav...',
        image: IMAGES.list.foodAndDrink.list3,
      },
    ],
  },
  culture: {
    title: 'Culture',
    user: 'Campus Tips',
    account: '＠campustips',
    userAvatar: IMAGES.avatar.culture,
    listCount: '19',
    listTitle: 'Notes for Campus Fest',
    lists: [
      {
        id: 1,
        title: 'Essentials',
        description: 'Sunscreen, water bottle, and comfy shoes.',
        image: IMAGES.list.culture.list1,
      },
      {
        id: 2,
        title: 'Extras',
        description: 'A light jacket for when it gets chilly.',
        image: IMAGES.list.culture.list2,
      },
      {
        id: 3,
        title: 'Pro tip:',
        description: 'Bring a blanket to claim your spot early.',
        image: IMAGES.list.culture.list3,
      },
    ],
  },
  travel: {
    title: 'Travel',
    user: 'Life Hacks',
    account: '＠lifehacker',
    userAvatar: IMAGES.avatar.travel,
    listCount: '8',
    listTitle: 'Travel budgeting checklist',
    lists: [
      {
        id: 1,
        title: 'Set your total budget',
        description: 'Break it down into categories: flights, acco...',
        image: IMAGES.list.travel.list1,
      },
      {
        id: 2,
        title: 'Hunt for Deals',
        description: 'Use flight comparison tools like Skyscanne...',
        image: IMAGES.list.travel.list2,
      },
      {
        id: 3,
        title: 'Transportation Hacks',
        description: 'Book accommodations early through bud...',
        image: IMAGES.list.travel.list3,
      },
    ],
  },
  entertainment: {
    title: 'Entertainment',
    user: 'Viv Wang',
    account: '＠vivwang',
    userAvatar: IMAGES.avatar.entertainment,
    listCount: '22',
    listTitle: 'Binge based on your mood',
    lists: [
      {
        id: 1,
        title: 'Relaxing: Moana',
        description: 'Moana / A heartwarming and adventurous...',
        image: IMAGES.list.entertainment.list1,
      },
      {
        id: 2,
        title: 'Tense: Tenet ',
        description: 'Directed by Christopher Nolan, this mind-...',
        image: IMAGES.list.entertainment.list2,
      },
      {
        id: 3,
        title: 'Fun: Dumb and Dumber',
        description: 'A classic comedy about two clueless friend...',
        image: IMAGES.list.entertainment.list3,
      },
    ],
  },
  techAndDigital: {
    title: 'Tech & Digital',
    user: 'iTech People',
    account: '＠itech',
    userAvatar: IMAGES.avatar.techAndDigital,
    listCount: '10',
    listTitle: 'How I curate my digital space',
    lists: [
      {
        id: 1,
        title: 'Notion',
        description: 'Manage your thoughts and ideas in...',
        image: IMAGES.list.techAndDigital.list1,
      },
      {
        id: 2,
        title: 'Google Drive',
        description: 'The OG and it’s so essential.',
        image: IMAGES.list.techAndDigital.list2,
      },
      {
        id: 3,
        title: 'ChatGPT',
        description: 'Greatly improved my work!',
        image: IMAGES.list.techAndDigital.list3,
      },
    ],
  },
  personalGrowth: {
    title: 'Personal Growth',
    user: 'Corp Girlies ',
    account: '＠corpgirlies',
    userAvatar: IMAGES.avatar.personalGrowth,
    listCount: '24',
    listTitle: 'Atomic Habits - My thoughts',
    lists: [
      {
        id: 1,
        title: 'Start Small to Achieve Big',
        description: 'Pressure is the biggest enemy. Don’t let it...',
        image: IMAGES.list.personalGrowth.list1,
      },
      {
        id: 2,
        title: 'Build Systems, Not Just Goals.',
        description: 'This reminds me that building team is mor...',
        image: IMAGES.list.personalGrowth.list2,
      },
      {
        id: 3,
        title: 'Embrace Your New Identity',
        description: 'I need to work on this 100%',
        image: IMAGES.list.personalGrowth.list3,
      },
    ],
  },
  healthAndFitness: {
    title: 'Health & Fitness',
    user: 'Pica Pica ',
    account: '＠picapica',
    userAvatar: IMAGES.avatar.healthAndFitness,
    listCount: '17',
    listTitle: 'My best protein shake recipe',
    lists: [
      {
        id: 1,
        title: 'Step 1: Gather Your Ingredients',
        description: '1 scoop of your favorite protein pow...',
        image: IMAGES.list.healthAndFitness.list1,
      },
      {
        id: 2,
        title: 'Step 2: Blend the Base',
        description: 'Add the almond milk, protein powde...',
        image: IMAGES.list.healthAndFitness.list2,
      },
      {
        id: 3,
        title: 'Step 3: Add the Extras',
        description: 'Drop in the peanut butter, chia seed...',
        image: IMAGES.list.healthAndFitness.list3,
      },
    ],
  },
  other: {
    title: 'Other',
    user: 'Jacob PHD',
    account: '＠jacobphd',
    userAvatar: IMAGES.avatar.other,
    listCount: '13',
    listTitle: 'Reasons I swipe left',
    lists: [
      {
        id: 1,
        title: 'The Fish Pic',
        description: 'Congrats on catching that trout, but it’s no...',
        image: IMAGES.list.other.list1,
      },
      {
        id: 2,
        title: 'No Bio, No Effort',
        description: 'If you can’t write a sentence, how are you...',
        image: IMAGES.list.other.list2,
      },
      {
        id: 3,
        title: 'Mirror Selfies with a Dirty Room',
        description: 'If you can’t clean your room, what’s your li',
        image: IMAGES.list.other.list3,
      },
    ],
  },
};
export const TUTORIAL_SECTION = [
  { title: 'About Poklist', url: '' },
  {
    title: 'Tutorials',
    url: '',
  },
  {
    title: 'FAQ',
    url: '',
  },
  {
    title: 'Join the Team',
    url: '',
  },
];
export const FOOTER_SECTION = [
  {
    title: 'Press kit',
    url: '',
  },
  {
    title: 'Contact Us',
    url: '',
  },
  {
    title: 'Terms',
    url: '',
  },
  {
    title: 'Privacy',
    url: '',
  },
  {
    title: 'Collection Notice',
    url: '',
  },
];
export const SOCIAL_MEDIA = [
  {
    name: 'Discord',
    icon: '/src/assets/images/socialMedia/discord-logo.png',
    url: '#',
  },
  {
    name: 'Instagram',
    icon: '/src/assets/images/socialMedia/instagram-logo.png',
    url: '#',
  },
  {
    name: 'Threads',
    icon: '/src/assets/images/socialMedia/threads-logo.png',
    url: '#',
  },
  {
    name: 'LinkedIn',
    icon: '/src/assets/images/socialMedia/linkedin-logo.png',
    url: '#',
  },
];
