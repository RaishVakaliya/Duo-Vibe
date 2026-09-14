export type QuizCategory = "preferences" | "habits" | "memories" | "future";

export interface QuizOption {
  label: string;
  emoji: string;
}

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  question: string;
  options: QuizOption[];
}

export const QUIZ_QUESTION_BANK: QuizQuestion[] = [
  {
    id: "q_pref_01",
    category: "preferences",
    question: "What is their absolute favorite comfort food?",
    options: [
      { label: "Pizza", emoji: "🍕" },
      { label: "Burgers", emoji: "🍔" },
      { label: "Pasta", emoji: "🍝" },
      { label: "Sushi", emoji: "🍣" },
    ],
  },
  {
    id: "q_pref_02",
    category: "preferences",
    question: "What is their go-to movie or show genre?",
    options: [
      { label: "Romantic Comedy", emoji: "💕" },
      { label: "Action & Thriller", emoji: "🍿" },
      { label: "Horror & Mystery", emoji: "👻" },
      { label: "Sci-Fi & Fantasy", emoji: "🚀" },
    ],
  },
  {
    id: "q_pref_03",
    category: "preferences",
    question: "What is their ideal dream vacation destination?",
    options: [
      { label: "Tropical Beach", emoji: "🏖️" },
      { label: "Mountain Cabin", emoji: "🏔️" },
      { label: "Historic City", emoji: "🏰" },
      { label: "Nature Forest Retreat", emoji: "🌲" },
    ],
  },
  {
    id: "q_pref_04",
    category: "preferences",
    question: "What sweet treat could they never say no to?",
    options: [
      { label: "Chocolate Cake", emoji: "🍰" },
      { label: "Creamy Ice Cream", emoji: "🍨" },
      { label: "Fresh Warm Cookies", emoji: "🍪" },
      { label: "Glazed Donuts", emoji: "🍩" },
    ],
  },
  {
    id: "q_pref_05",
    category: "preferences",
    question: "What is their favorite season of the year?",
    options: [
      { label: "Blooming Spring", emoji: "🌸" },
      { label: "Sunny Summer", emoji: "☀️" },
      { label: "Golden Autumn", emoji: "🍂" },
      { label: "Cozy Winter", emoji: "❄️" },
    ],
  },
  {
    id: "q_pref_06",
    category: "preferences",
    question: "What is their favorite everyday beverage?",
    options: [
      { label: "Fresh Coffee", emoji: "☕" },
      { label: "Iced Boba Milk Tea", emoji: "🧋" },
      { label: "Chilled Soda", emoji: "🥤" },
      { label: "Fresh Fruit Juice", emoji: "🧃" },
    ],
  },
  {
    id: "q_pref_07",
    category: "preferences",
    question: "What type of music is most likely on their repeat playlist?",
    options: [
      { label: "Pop Hits", emoji: "🎵" },
      { label: "R&B and Soul", emoji: "🎷" },
      { label: "Rock and Indie", emoji: "🎸" },
      { label: "Lo-Fi and Chill", emoji: "🎧" },
    ],
  },
  {
    id: "q_pref_08",
    category: "preferences",
    question: "What is their ultimate ideal date night activity?",
    options: [
      { label: "Candlelight Dinner", emoji: "🕯️" },
      { label: "Movie & Couch Cuddle", emoji: "🎬" },
      { label: "Outdoor Adventure", emoji: "🎡" },
      { label: "Cooking Together", emoji: "🍳" },
    ],
  },
  {
    id: "q_pref_09",
    category: "preferences",
    question: "Which pet or animal do they adore the most?",
    options: [
      { label: "Playful Dogs", emoji: "🐶" },
      { label: "Cozy Cats", emoji: "🐱" },
      { label: "Wild Mammals", emoji: "🐼" },
      { label: "Ocean Wildlife", emoji: "🐬" },
    ],
  },
  {
    id: "q_pref_10",
    category: "preferences",
    question: "How do they prefer to spend a free Sunday afternoon?",
    options: [
      { label: "Binge-watching Shows", emoji: "📺" },
      { label: "Walking in Nature", emoji: "🚶" },
      { label: "Sleeping in and Napping", emoji: "😴" },
      { label: "Creative Hobby Time", emoji: "🎨" },
    ],
  },

  {
    id: "q_hab_01",
    category: "habits",
    question: "Are they naturally a morning bird or night owl?",
    options: [
      { label: "Early Morning Bird", emoji: "🌅" },
      { label: "Dedicated Night Owl", emoji: "🦉" },
      { label: "Afternoon Energized", emoji: "🌤️" },
      { label: "Always Sleepy", emoji: "🛌" },
    ],
  },
  {
    id: "q_hab_02",
    category: "habits",
    question: "What is their usual reaction when feeling stressed?",
    options: [
      { label: "Needs Quiet Space", emoji: "🧘" },
      { label: "Wants to Vent and Talk", emoji: "🗣️" },
      { label: "Distracts with Games", emoji: "🎮" },
      { label: "Gets Busy Working", emoji: "💼" },
    ],
  },
  {
    id: "q_hab_03",
    category: "habits",
    question: "How fast do they usually reply to text messages?",
    options: [
      { label: "Within Seconds", emoji: "⚡" },
      { label: "A Few Minutes", emoji: "💬" },
      { label: "A Few Hours Later", emoji: "⏳" },
      { label: "Leaves on Read & Forgets", emoji: "🙈" },
    ],
  },
  {
    id: "q_hab_04",
    category: "habits",
    question: "How do they handle their morning alarm clock?",
    options: [
      { label: "Wakes Up Immediately", emoji: "⏰" },
      { label: "Snoozes 3+ Times", emoji: "🔁" },
      { label: "Sets 10 Different Alarms", emoji: "📱" },
      { label: "Sleeps Through Alarms", emoji: "💤" },
    ],
  },
  {
    id: "q_hab_05",
    category: "habits",
    question: "How would you describe their room organization style?",
    options: [
      { label: "Neat and Spotless", emoji: "✨" },
      { label: "Organized Chaos", emoji: "🗂️" },
      { label: "Clothes Pile Chair Owner", emoji: "🧺" },
      { label: "Cleans Once a Month", emoji: "🌪️" },
    ],
  },
  {
    id: "q_hab_06",
    category: "habits",
    question: "When shopping, what is their buying tendency?",
    options: [
      { label: "Researches Everything", emoji: "🔍" },
      { label: "Pure Impulsive Buyer", emoji: "🛍️" },
      { label: "Only Strict Essentials", emoji: "🏷️" },
      { label: "Leaves Items in Cart", emoji: "🛒" },
    ],
  },
  {
    id: "q_hab_07",
    category: "habits",
    question: "When riding in a car, what is their favorite role?",
    options: [
      { label: "The Focused Driver", emoji: "🚗" },
      { label: "The Aux Cord DJ", emoji: "🎶" },
      { label: "The Sleeping Passenger", emoji: "😴" },
      { label: "The Active Navigator", emoji: "🗺️" },
    ],
  },
  {
    id: "q_hab_08",
    category: "habits",
    question: "How do they usually make big decisions?",
    options: [
      { label: "Thorough Pros & Cons List", emoji: "📝" },
      { label: "Pure Gut Feeling", emoji: "❤️" },
      { label: "Asks Everyone's Opinion", emoji: "👥" },
      { label: "Sleeps on it for Weeks", emoji: "🌙" },
    ],
  },
  {
    id: "q_hab_09",
    category: "habits",
    question: "What is their go-to habit when they feel bored?",
    options: [
      { label: "Social Media Scrolling", emoji: "📱" },
      { label: "Opening the Fridge", emoji: "🍿" },
      { label: "Calling or Texting You", emoji: "📞" },
      { label: "Taking a Power Nap", emoji: "😴" },
    ],
  },
  {
    id: "q_hab_10",
    category: "habits",
    question: "How do they handle minor disagreements or tensions?",
    options: [
      { label: "Resolves Immediately", emoji: "🤝" },
      { label: "Needs Time to Cool Off", emoji: "🧊" },
      { label: "Diffuses with Humor", emoji: "😂" },
      { label: "Goes Completely Quiet", emoji: "🤐" },
    ],
  },

  {
    id: "q_mem_01",
    category: "memories",
    question: "What stood out most to them about your first date?",
    options: [
      { label: "The Nervous Butterflies", emoji: "🦋" },
      { label: "How Easily You Talked", emoji: "💬" },
      { label: "What You Were Wearing", emoji: "👗" },
      { label: "A Funny Awkward Moment", emoji: "🤭" },
    ],
  },
  {
    id: "q_mem_02",
    category: "memories",
    question: "What was their initial impression when you first met?",
    options: [
      { label: "Thought You Were Cute", emoji: "🥰" },
      { label: "Mysterious and Quiet", emoji: "🤫" },
      { label: "Very Funny & Charming", emoji: "😄" },
      { label: "Out of Their League", emoji: "🌟" },
    ],
  },
  {
    id: "q_mem_03",
    category: "memories",
    question: "Where did you share your very first memorable kiss?",
    options: [
      { label: "Under the Night Sky", emoji: "🌌" },
      { label: "Inside a Parked Car", emoji: "🚗" },
      { label: "Outside on a Doorstep", emoji: "🚪" },
      { label: "A Quiet Cozy Room", emoji: "🛋️" },
    ],
  },
  {
    id: "q_mem_04",
    category: "memories",
    question: "What is the funniest shared memory you two laugh about?",
    options: [
      { label: "A Kitchen Cooking Disaster", emoji: "🥘" },
      { label: "Getting Lost Together", emoji: "🧭" },
      { label: "Uncontrollable Laughing Fit", emoji: "🤣" },
      { label: "An Embarrassing Public Slip", emoji: "🙈" },
    ],
  },
  {
    id: "q_mem_05",
    category: "memories",
    question: "What kind of first thoughtful gift did you exchange?",
    options: [
      { label: "A Sweet Handwritten Letter", emoji: "💌" },
      { label: "Cute Clothes or Accessory", emoji: "🧣" },
      { label: "Delicious Treats / Dinner", emoji: "🍫" },
      { label: "Personalized Keepsake", emoji: "🎁" },
    ],
  },
  {
    id: "q_mem_06",
    category: "memories",
    question: "What was their favorite part of your first trip together?",
    options: [
      { label: "The Scenic Road Journey", emoji: "🚗" },
      { label: "Tasting New Local Food", emoji: "🗺️" },
      { label: "Late Night Heart-to-Hearts", emoji: "🌃" },
      { label: "Relaxing with Zero Stress", emoji: "🌴" },
    ],
  },
  {
    id: "q_mem_07",
    category: "memories",
    question: "Which music vibe captures a special memory of you two?",
    options: [
      { label: "Your First Dance Song", emoji: "💃" },
      { label: "A Loud Road-Trip Jam", emoji: "🚘" },
      { label: "Late Night Melodic Beats", emoji: "🎶" },
      { label: "Sentimental Slow Ballad", emoji: "🎵" },
    ],
  },
  {
    id: "q_mem_08",
    category: "memories",
    question: "What small gesture from you first made them feel truly loved?",
    options: [
      { label: "Remembering a Small Detail", emoji: "💭" },
      { label: "Bringing Favorite Comfort Food", emoji: "🍲" },
      { label: "A Sweet Morning Text", emoji: "☀️" },
      { label: "Holding Them When Sad", emoji: "🤍" },
    ],
  },
  {
    id: "q_mem_09",
    category: "memories",
    question: "What was the weather like on your most memorable date?",
    options: [
      { label: "Cozy Pouring Rain", emoji: "🌧️" },
      { label: "Warm Golden Sunset", emoji: "🌇" },
      { label: "Clear Starry Night", emoji: "🌌" },
      { label: "Crisp Autumn Breeze", emoji: "🍂" },
    ],
  },
  {
    id: "q_mem_10",
    category: "memories",
    question: "What milestone celebration felt most special to them?",
    options: [
      { label: "First Big Anniversary", emoji: "🥂" },
      { label: "Meeting Friends & Family", emoji: "👨‍👩‍👧" },
      { label: "Moving In / Next Step", emoji: "🔑" },
      { label: "Surviving a Tough Week", emoji: "💪" },
    ],
  },

  {
    id: "q_fut_01",
    category: "future",
    question: "What would be their dream home style to share together?",
    options: [
      { label: "Modern City High-Rise", emoji: "🏙️" },
      { label: "Warm Suburban House", emoji: "🏡" },
      { label: "Peaceful Country Cottage", emoji: "🌾" },
      { label: "Sunny Beachside Villa", emoji: "🏖️" },
    ],
  },
  {
    id: "q_fut_02",
    category: "future",
    question: "What kind of pets would they love in the future?",
    options: [
      { label: "A Big Friendly Dog", emoji: "🐕" },
      { label: "Two Cuddly Cats", emoji: "🐈" },
      { label: "Cute Small Animals", emoji: "🐾" },
      { label: "Pet-Free & Travel-Ready", emoji: "✈️" },
    ],
  },
  {
    id: "q_fut_03",
    category: "future",
    question: "What bucket list adventure do they want to conquer with you?",
    options: [
      { label: "Seeing the Northern Lights", emoji: "🌌" },
      { label: "Skydiving or Bungee", emoji: "🪂" },
      { label: "Backpacking Around the World", emoji: "🎒" },
      { label: "Cross-Country Campervan", emoji: "🚐" },
    ],
  },
  {
    id: "q_fut_04",
    category: "future",
    question: "What is their dream wedding or celebration vibe?",
    options: [
      { label: "Intimate Beach Elopement", emoji: "🏝️" },
      { label: "Fairytale Party with Friends", emoji: "🏰" },
      { label: "Cozy Garden Gathering", emoji: "🌿" },
      { label: "Courthouse & Epic Honeymoon", emoji: "💍" },
    ],
  },
  {
    id: "q_fut_05",
    category: "future",
    question: "What is their dream retirement vision decades from now?",
    options: [
      { label: "Traveling Non-Stop", emoji: "🌍" },
      { label: "Gardening in a Small Town", emoji: "🌻" },
      { label: "Living by the Coast", emoji: "🌊" },
      { label: "Hosting Loved Ones Often", emoji: "☕" },
    ],
  },
  {
    id: "q_fut_06",
    category: "future",
    question:
      "What couple goal do they want to achieve most in the coming year?",
    options: [
      { label: "An Unforgettable Vacation", emoji: "✈️" },
      { label: "Saving for Shared Dreams", emoji: "💰" },
      { label: "Healthy Fitness Routine", emoji: "🥗" },
      { label: "Learning a New Skill", emoji: "🎸" },
    ],
  },
  {
    id: "q_fut_07",
    category: "future",
    question: "What weekly couple tradition would they love to establish?",
    options: [
      { label: "Sunday Breakfast in Bed", emoji: "🥞" },
      { label: "Friday Night Movie & Pizza", emoji: "🍿" },
      { label: "Saturday Morning Market", emoji: "🧺" },
      { label: "Sunset Evening Walk", emoji: "🌅" },
    ],
  },
  {
    id: "q_fut_08",
    category: "future",
    question: "How do they picture the interior aesthetic of your home?",
    options: [
      { label: "Clean Minimalist", emoji: "🤍" },
      { label: "Warm Plant-Filled Bohemian", emoji: "🌿" },
      { label: "Smart Home Tech Gadgets", emoji: "🖥️" },
      { label: "Cozy Vintage Library", emoji: "📚" },
    ],
  },
  {
    id: "q_fut_09",
    category: "future",
    question: "What kind of ride would they love for future road trips?",
    options: [
      { label: "Rugged 4x4 SUV", emoji: "🚙" },
      { label: "Sleek Electric Vehicle", emoji: "⚡" },
      { label: "Classic Open Convertible", emoji: "🚘" },
      { label: "Cozy Retro Camper Van", emoji: "🚐" },
    ],
  },
  {
    id: "q_fut_10",
    category: "future",
    question:
      "What is the sweetest thing about growing old together in their eyes?",
    options: [
      { label: "Morning Tea on the Porch", emoji: "☕" },
      { label: "Still Laughing at Silly Jokes", emoji: "😂" },
      { label: "A Lifetime of Stories", emoji: "📖" },
      { label: "Holding Hands Everywhere", emoji: "🤝" },
    ],
  },
];
