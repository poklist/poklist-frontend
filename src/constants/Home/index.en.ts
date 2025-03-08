import { msg } from '@lingui/macro';
import { IMAGES } from './images';

export const HERO_SECTION = {
  joinInformation: {
    title: msg`Join Poklist and share your lists.`,
    descriprion: msg`Currently open only to creator account applications.`,
    buttonText: msg`Sign up`,
  },
  accountOwner: {
    title: '',
    buttonText: msg`Creator Account Login`,
  },
  nonCreatorQuestion: {
    title: msg`Can non-creators use Poklist?`,
    url: '',
  },
};
export const FEATURE_SECTION = {
  title: msg`List Your Ideas`,
  description: msg`Turn thoughts into lists, discover fresh finds, and follow inspiration`,
};
export const LIST_SECTION = {
  lifeStyle: {
    title: 'Lifestyle',
    user: msg`Inspogirlie`,
    account: '@inspogirlie',
    userAvatar: IMAGES.avatar.lifeStyle,
    listCount: '12',
    listTitle: msg`Must-Haves for dorm life`,
    lists: [
      {
        id: 1,
        title: msg`Cozy Bedding:`,
        description: msg`A plush comforter and extra pillows for a comfy night's sleep.`,
        image: IMAGES.list.lifeStyle.list1,
      },
      {
        id: 2,
        title: msg`Desk Essentials`,
        description: msg`Target is probably your bf.`,
        image: IMAGES.list.lifeStyle.list2,
      },
      {
        id: 3,
        title: msg`Portable Speaker`,
        description: msg`For study breaks or casual dorm hangouts`,
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
    listTitle: msg`Stop-by-Stop Café Journey`,
    lists: [
      {
        id: 1,
        title: msg`8:00 AM at Sunrise Café`,
        description: msg`Start your day with a creamy latte and a freshly baked croissant`,
        image: IMAGES.list.foodAndDrink.list1,
      },
      {
        id: 2,
        title: msg`12:30 PM at Artisan Coffee House`,
        description: msg`Enjoy a flat white with a hearty avocado toast.`,
        image: IMAGES.list.foodAndDrink.list2,
      },
      {
        id: 3,
        title: msg`3:00 PM at Brew & Bloom`,
        description: msg`Sip on a cold brew while indulging in a lavender scone`,
        image: IMAGES.list.foodAndDrink.list3,
      },
    ],
  },
  culture: {
    title: 'Culture',
    user: msg`Campus People`,
    account: '@campusppl',
    userAvatar: IMAGES.avatar.culture,
    listCount: '19',
    listTitle: msg`Notes for Campus Fest`,
    lists: [
      {
        id: 1,
        title: msg`Essentials`,
        description: msg`Sunscreen, water bottle, and comfy shoes.`,
        image: IMAGES.list.culture.list1,
      },
      {
        id: 2,
        title: msg`Extras`,
        description: msg`A light jacket for when it gets chilly.`,
        image: IMAGES.list.culture.list2,
      },
      {
        id: 3,
        title: msg`Pro tip:`,
        description: msg`Bring a blanket to claim your spot early.`,
        image: IMAGES.list.culture.list3,
      },
    ],
  },
  travel: {
    title: 'Travel',
    user: msg`Travel Lover`,
    account: '@travellover',
    userAvatar: IMAGES.avatar.travel,
    listCount: '8',
    listTitle: msg`Travel budgeting checklist`,
    lists: [
      {
        id: 1,
        title: msg`Set your total budget`,
        description: msg`Break it down into categories: flights, accommodation, food, activities, and extras.`,
        image: IMAGES.list.travel.list1,
      },
      {
        id: 2,
        title: msg`Hunt for Deals`,
        description: msg`Use flight comparison tools like Skyscanner or Google Flights`,
        image: IMAGES.list.travel.list2,
      },
      {
        id: 3,
        title: msg`Transportation Hacks`,
        description: msg`Book accommodations early through budget-friendly platforms like Hostelworld or Airbnb.`,
        image: IMAGES.list.travel.list3,
      },
    ],
  },
  entertainment: {
    title: 'Entertainment',
    user: msg`Gossip Pie`,
    account: '@Gossippie',
    userAvatar: IMAGES.avatar.entertainment,
    listCount: '22',
    listTitle: msg`Binge based on your mood`,
    lists: [
      {
        id: 1,
        title: msg`Relaxing: Moana`,
        description: msg`Moana / A heartwarming and adventurous animated film with stunning visuals and beautiful music that will soothe your soul.`,
        image: IMAGES.list.entertainment.list1,
      },
      {
        id: 2,
        title: msg`Tense: Tenet`,
        description: msg`Directed by Christopher Nolan, this mind-bending action film with time inversion will keep you on the edge of your seat.`,
        image: IMAGES.list.entertainment.list2,
      },
      {
        id: 3,
        title: msg`Fun: Dumb and Dumber`,
        description: msg`A classic comedy about two clueless friends on a road trip full of ridiculous and laugh-out-loud situations.`,
        image: IMAGES.list.entertainment.list3,
      },
    ],
  },
  techAndDigital: {
    title: 'Tech & Digital',
    user: msg`iTech`,
    account: '@itech',
    userAvatar: IMAGES.avatar.techAndDigital,
    listCount: '10',
    listTitle: msg`How I curate my digital space`,
    lists: [
      {
        id: 1,
        title: msg`Notion`,
        description: msg`Manage your thoughts and ideas in one single place.`,
        image: IMAGES.list.techAndDigital.list1,
      },
      {
        id: 2,
        title: msg`Google Drive`,
        description: msg`The OG and it's so essential.`,
        image: IMAGES.list.techAndDigital.list2,
      },
      {
        id: 3,
        title: msg`ChatGPT`,
        description: msg`Greatly improved my work!`,
        image: IMAGES.list.techAndDigital.list3,
      },
    ],
  },
  personalGrowth: {
    title: 'Personal Growth',
    user: msg`Good Habbits`,
    account: '@goodhabbits',
    userAvatar: IMAGES.avatar.personalGrowth,
    listCount: '24',
    listTitle: msg`Atomic Habits - My thoughts`,
    lists: [
      {
        id: 1,
        title: msg`Start Small to Achieve Big`,
        description: msg`Pressure is the biggest enemy. Don't let it control your momentum.`,
        image: IMAGES.list.personalGrowth.list1,
      },
      {
        id: 2,
        title: msg`Build Systems, Not Just Goals.`,
        description: msg`This reminds me that building team is more important than the actual product.`,
        image: IMAGES.list.personalGrowth.list2,
      },
      {
        id: 3,
        title: msg`Embrace Your New Identity`,
        description: msg`I need to work on this 100%`,
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
    listTitle: msg`My best protein shake recipe`,
    lists: [
      {
        id: 1,
        title: msg`Step 1: Gather Your Ingredients`,
        description: msg`1 scoop of your favorite protein powder (vanilla or chocolate works great!)`,
        image: IMAGES.list.healthAndFitness.list1,
      },
      {
        id: 2,
        title: msg`Step 2: Blend the Base`,
        description: msg`Add the almond milk, protein powder, and banana to your blender.`,
        image: IMAGES.list.healthAndFitness.list2,
      },
      {
        id: 3,
        title: msg`Step 3: Add the Extras`,
        description: msg`Drop in the peanut butter, chia seeds, or flaxseeds for added nutrients.`,
        image: IMAGES.list.healthAndFitness.list3,
      },
    ],
  },
  other: {
    title: 'Other',
    user: msg`Jacob PHD`,
    account: '@Jacobphd',
    userAvatar: IMAGES.avatar.other,
    listCount: '13',
    listTitle: msg`Reasons I swipe left`,
    lists: [
      {
        id: 1,
        title: msg`The Fish Pic`,
        description: msg`Congrats on catching that trout, but it's not winning you dates.`,
        image: IMAGES.list.other.list1,
      },
      {
        id: 2,
        title: msg`No Bio, No Effort`,
        description: msg`If you can't write a sentence, how are you going to hold a conversation?`,
        image: IMAGES.list.other.list2,
      },
      {
        id: 3,
        title: msg`Mirror Selfies with a Dirty Room`,
        description: msg`If you can't clean your room, what's your life looking like?`,
        image: IMAGES.list.other.list3,
      },
    ],
  },
};
export const TUTORIAL_SECTION = [
  { title: msg`About Poklist`, url: '' },
  {
    title: msg`Tutorials`,
    url: '',
  },
  {
    title: msg`FAQ`,
    url: '',
  },
  {
    title: msg`Join the Team`,
    url: '',
  },
];
export const FOOTER_SECTION = [
  {
    title: msg`Press kit`,
    url: '',
  },
  {
    title: msg`Contact Us`,
    url: '',
  },
  {
    title: msg`Terms`,
    url: '',
  },
  {
    title: msg`Privacy`,
    url: '',
  },
  {
    title: msg`Collection Notice`,
    url: '',
  },
];
export const SOCIAL_MEDIA = [
  {
    name: 'Discord',
    icon: IMAGES.socialMedia.discord,
    url: '#',
  },
  {
    name: 'Instagram',
    icon: IMAGES.socialMedia.instagram,
    url: '#',
  },
  {
    name: 'Threads',
    icon: IMAGES.socialMedia.threads,
    url: '#',
  },
  {
    name: 'LinkedIn',
    icon: IMAGES.socialMedia.linkedin,
    url: '#',
  },
];
export const ERROR_DIALOG = {
  title: msg`Login Error - Creator Account Not Found`,
  description: msg`Only approved and verified “Creator Accounts” can log in and create lists. If you have any questions, please contact us.`,
  buttonText: msg`Contact us`,
};
