export type QuestionCategory = "fun" | "deep" | "romantic";

export interface Question {
  id: string;
  category: QuestionCategory;
  question: string;
  options: string[];
}

export const QUESTION_BANK: Question[] = [
  // FUN
  {
    id: "f01",
    category: "fun",
    question: "What's your ideal first date?",
    options: [
      "A movie & popcorn",
      "A nice dinner",
      "A long walk",
      "Something adventurous",
    ],
  },
  {
    id: "f02",
    category: "fun",
    question: "Which superpower would you want to share with me?",
    options: ["Flying", "Invisibility", "Reading minds", "Teleportation"],
  },
  {
    id: "f03",
    category: "fun",
    question: "What's the most useless talent you have?",
    options: ["Weird noises", "Random trivia", "Silly faces", "Impressions"],
  },
  {
    id: "f04",
    category: "fun",
    question: "Pick our go-to karaoke song genre.",
    options: ["90s pop", "Rock ballads", "Bollywood", "Sad breakup songs"],
  },
  {
    id: "f05",
    category: "fun",
    question: "What snack could you never share with me?",
    options: ["Fries", "Chocolate", "Chips", "Ice cream"],
  },
  {
    id: "f06",
    category: "fun",
    question: "If we adopted a pet today, what would it be?",
    options: ["Dog", "Cat", "Bird", "Something exotic"],
  },
  {
    id: "f07",
    category: "fun",
    question: "What's your go-to comfort show?",
    options: ["Sitcom reruns", "True crime", "Cartoons", "Reality TV"],
  },
  {
    id: "f08",
    category: "fun",
    question: "Pick our couple Halloween costume.",
    options: [
      "Matching outfits",
      "Movie characters",
      "Something funny",
      "Scary duo",
    ],
  },
  {
    id: "f09",
    category: "fun",
    question: "What's the weirdest food combo you actually enjoy?",
    options: [
      "Fries & ice cream",
      "Pineapple pizza",
      "Chips & chocolate",
      "Ketchup on everything",
    ],
  },
  {
    id: "f10",
    category: "fun",
    question: "Which sport would you want us to try together?",
    options: ["Bowling", "Rock climbing", "Badminton", "Swimming"],
  },
  {
    id: "f11",
    category: "fun",
    question: "What's your dream road trip destination?",
    options: ["Mountains", "Beach", "A random small town", "Another country"],
  },
  {
    id: "f12",
    category: "fun",
    question: "Pick a silly nickname you'd give me.",
    options: [
      "Something food-related",
      "An animal name",
      "A cartoon character",
      "Just 'babe'",
    ],
  },
  {
    id: "f13",
    category: "fun",
    question: "What game night activity do you enjoy most?",
    options: ["Board games", "Video games", "Card games", "Charades"],
  },
  {
    id: "f14",
    category: "fun",
    question: "What's your morning personality like?",
    options: [
      "Chatty & bright",
      "Silent until coffee",
      "Slow & sleepy",
      "Instantly energetic",
    ],
  },
  {
    id: "f15",
    category: "fun",
    question: "If we did a couple's photoshoot, what theme?",
    options: ["Beach sunset", "Cozy cafe", "City street style", "Funny/candid"],
  },
  {
    id: "f16",
    category: "fun",
    question: "Which movie genre wins on a lazy Sunday?",
    options: ["Comedy", "Action", "Romance", "Horror"],
  },
  {
    id: "f17",
    category: "fun",
    question: "What's a hobby you wish we tried together?",
    options: ["Cooking classes", "Dancing", "Painting", "Hiking"],
  },
  {
    id: "f18",
    category: "fun",
    question: "Pick our emergency snack run item.",
    options: ["Chips", "Instant noodles", "Chocolate", "Ice cream"],
  },
  {
    id: "f19",
    category: "fun",
    question: "What's your take on public dancing?",
    options: [
      "Always down",
      "Only with music I love",
      "Only if you drag me",
      "Absolutely not",
    ],
  },
  {
    id: "f20",
    category: "fun",
    question: "Which app do you spend way too much time on?",
    options: ["Instagram", "YouTube", "TikTok", "Games"],
  },
  {
    id: "f21",
    category: "fun",
    question: "If we opened a cozy cafe together, what would be our specialty?",
    options: [
      "Artisanal coffee & fresh pastries",
      "Hearty comfort brunch food",
      "Late-night desserts & boba",
      "Creative fusion street snacks",
    ],
  },
  {
    id: "f22",
    category: "fun",
    question: "If we got stranded on a deserted island, who survives longer?",
    options: [
      "Definitely you",
      "Definitely me",
      "We thrive together",
      "Neither of us lasts a day",
    ],
  },
  {
    id: "f23",
    category: "fun",
    question: "What would our couple signature dance move look like?",
    options: [
      "The awkward slow sway",
      "A dramatic salsa spin",
      "A goofy freestyle jump",
      "Standing close by the snack table",
    ],
  },

  // DEEP
  {
    id: "d01",
    category: "deep",
    question: "What does feeling truly understood mean to you?",
    options: [
      "Being heard without judgment",
      "Someone remembering small details",
      "Shared silence feels comfortable",
      "Being accepted, flaws and all",
    ],
  },
  {
    id: "d02",
    category: "deep",
    question: "What's a fear you rarely talk about?",
    options: [
      "Being left behind",
      "Not being enough",
      "Failure",
      "Losing people I love",
    ],
  },
  {
    id: "d03",
    category: "deep",
    question: "What has shaped how you love people?",
    options: [
      "My family growing up",
      "A past relationship",
      "A close friendship",
      "Something I went through alone",
    ],
  },
  {
    id: "d04",
    category: "deep",
    question: "When do you feel most like yourself?",
    options: [
      "Alone in quiet",
      "Around people I trust",
      "While creating something",
      "In new experiences",
    ],
  },
  {
    id: "d05",
    category: "deep",
    question: "What's something you're still healing from?",
    options: [
      "A past relationship",
      "A family issue",
      "A personal failure",
      "Something I'd rather not name yet",
    ],
  },
  {
    id: "d06",
    category: "deep",
    question: "How do you show love when words are hard?",
    options: [
      "Small actions",
      "Physical closeness",
      "Spending time together",
      "Doing something helpful",
    ],
  },
  {
    id: "d07",
    category: "deep",
    question: "What does 'home' feel like to you?",
    options: [
      "A person, not a place",
      "Familiar routines",
      "Quiet and safety",
      "Being fully myself",
    ],
  },
  {
    id: "d08",
    category: "deep",
    question: "What's a belief about love you've changed your mind on?",
    options: [
      "That it should be easy",
      "That grand gestures matter most",
      "That silence means something's wrong",
      "That love alone is enough",
    ],
  },
  {
    id: "d09",
    category: "deep",
    question: "What do you need most during hard times?",
    options: [
      "Someone to just listen",
      "Space to process alone",
      "Reassurance",
      "Practical help",
    ],
  },
  {
    id: "d10",
    category: "deep",
    question: "What's something you've never told anyone?",
    options: [
      "A regret",
      "A dream I'm scared to chase",
      "A fear about the future",
      "Something from my past",
    ],
  },
  {
    id: "d11",
    category: "deep",
    question: "How do you handle feeling vulnerable?",
    options: [
      "I open up slowly",
      "I need time alone first",
      "I joke to cope",
      "I go quiet",
    ],
  },
  {
    id: "d12",
    category: "deep",
    question: "What does trust mean to you in a relationship?",
    options: [
      "Consistency over time",
      "Honesty even when it's hard",
      "Feeling safe to be flawed",
      "No secrets",
    ],
  },
  {
    id: "d13",
    category: "deep",
    question: "What's a lesson heartbreak taught you?",
    options: [
      "To communicate better",
      "To know my worth",
      "To not lose myself",
      "To choose more carefully",
    ],
  },
  {
    id: "d14",
    category: "deep",
    question: "What part of yourself are you still working on?",
    options: [
      "Patience",
      "Self-doubt",
      "Trusting others",
      "Letting go of control",
    ],
  },
  {
    id: "d15",
    category: "deep",
    question: "What does growing old together look like to you?",
    options: [
      "Still laughing together",
      "Still being best friends",
      "Building a life, not just memories",
      "Growing individually too",
    ],
  },
  {
    id: "d16",
    category: "deep",
    question: "What's something you need to hear more often?",
    options: [
      "That I'm doing okay",
      "That I'm loved as I am",
      "That I'm not alone",
      "That my feelings are valid",
    ],
  },
  {
    id: "d17",
    category: "deep",
    question: "How do you define real connection?",
    options: [
      "Being able to sit in silence",
      "Feeling safe to be honest",
      "Shared values",
      "Effortless understanding",
    ],
  },
  {
    id: "d18",
    category: "deep",
    question: "What's something you're proud of that others don't know?",
    options: [
      "Overcoming a hard time",
      "A personal boundary I set",
      "Something I built alone",
      "A change I made in myself",
    ],
  },
  {
    id: "d19",
    category: "deep",
    question: "What does support look like when you're struggling?",
    options: [
      "Someone checking in",
      "Being given space",
      "Practical help, not just words",
      "Just not being alone",
    ],
  },
  {
    id: "d20",
    category: "deep",
    question: "What's a question you wish people asked you more?",
    options: [
      "How I'm really doing",
      "What I need right now",
      "What I'm proud of",
      "What I'm afraid of",
    ],
  },
  {
    id: "d21",
    category: "deep",
    question: "What's a lesson from a past mistake that still guides you?",
    options: [
      "Speak up sooner",
      "Trust my intuition",
      "Don't rush big decisions",
      "Forgive more easily",
    ],
  },
  {
    id: "d22",
    category: "deep",
    question: "When life feels overwhelming, what brings you true peace?",
    options: [
      "Quiet solitude",
      "Talking it through with you",
      "Being outside in nature",
      "Immersing myself in a hobby",
    ],
  },
  {
    id: "d23",
    category: "deep",
    question:
      "What does emotional safety mean most to you in our relationship?",
    options: [
      "Being fully vulnerable without fear",
      "Knowing you always have my back",
      "Honest and gentle communication",
      "Zero judgment for my mistakes",
    ],
  },

  // ROMANTIC
  {
    id: "r01",
    category: "romantic",
    question: "What's a small moment that made you fall harder for me?",
    options: [
      "A random inside joke",
      "The way you handled something hard",
      "A quiet moment together",
      "Something unexpected you did",
    ],
  },
  {
    id: "r02",
    category: "romantic",
    question: "What's your love language?",
    options: [
      "Words of affirmation",
      "Quality time",
      "Physical touch",
      "Acts of service",
    ],
  },
  {
    id: "r03",
    category: "romantic",
    question: "What's a memory of us you replay often?",
    options: [
      "Our first date",
      "A random ordinary day",
      "A trip we took",
      "A late-night conversation",
    ],
  },
  {
    id: "r04",
    category: "romantic",
    question: "What made you realize you liked me?",
    options: [
      "The way you made me laugh",
      "A conversation that stuck with me",
      "How you treated others",
      "A specific moment I still remember",
    ],
  },
  {
    id: "r05",
    category: "romantic",
    question: "What's your favorite way to be comforted by me?",
    options: [
      "A hug",
      "Just being listened to",
      "Reassuring words",
      "You handling things for me",
    ],
  },
  {
    id: "r06",
    category: "romantic",
    question: "What's a dream date you'd want us to have?",
    options: [
      "A sunset picnic",
      "A weekend getaway",
      "A cozy night in",
      "Something spontaneous",
    ],
  },
  {
    id: "r07",
    category: "romantic",
    question: "What do you love most about how we communicate?",
    options: [
      "We're honest with each other",
      "We can joke about anything",
      "We really listen",
      "We're not afraid of hard talks",
    ],
  },
  {
    id: "r08",
    category: "romantic",
    question: "What's something about me you didn't expect to fall for?",
    options: [
      "How you think",
      "Your sense of humor",
      "How you care for others",
      "A quirky habit of yours",
    ],
  },
  {
    id: "r09",
    category: "romantic",
    question: "What song reminds you of us?",
    options: [
      "Something from our first date",
      "A song we always sing together",
      "Something slow and sappy",
      "An inside-joke song",
    ],
  },
  {
    id: "r10",
    category: "romantic",
    question: "How do you like to be surprised?",
    options: [
      "A handwritten note",
      "A planned date",
      "A small unexpected gift",
      "Just extra time together",
    ],
  },
  {
    id: "r11",
    category: "romantic",
    question: "What's your favorite thing to do together on a lazy day?",
    options: [
      "Cuddle and watch something",
      "Cook together",
      "Just talk for hours",
      "Nap together",
    ],
  },
  {
    id: "r12",
    category: "romantic",
    question: "What's one thing you want us to do before anything else?",
    options: [
      "Travel somewhere new",
      "Build a tradition together",
      "Move in together",
      "Just enjoy where we are now",
    ],
  },
  {
    id: "r13",
    category: "romantic",
    question: "What compliment from me means the most to you?",
    options: [
      "When you say I make you feel safe",
      "When you notice small things about me",
      "When you tell others about me",
      "When you say you're proud of me",
    ],
  },
  {
    id: "r14",
    category: "romantic",
    question: "What's a tradition you'd want us to start?",
    options: [
      "An annual trip",
      "A weekly date night",
      "A silly yearly ritual",
      "Something just for us",
    ],
  },
  {
    id: "r15",
    category: "romantic",
    question: "What does 'us' mean to you right now?",
    options: [
      "A safe place",
      "A team",
      "My favorite person",
      "Still discovering, and I love that",
    ],
  },
  {
    id: "r16",
    category: "romantic",
    question:
      "What's something you want to experience together for the first time?",
    options: [
      "Living together",
      "Traveling abroad",
      "A big life milestone",
      "Something completely spontaneous",
    ],
  },
  {
    id: "r17",
    category: "romantic",
    question: "What's your favorite way to say 'I love you' without words?",
    options: [
      "A long hug",
      "Doing something helpful",
      "A random text checking in",
      "Just showing up",
    ],
  },
  {
    id: "r18",
    category: "romantic",
    question: "What's one thing you never get tired of about us?",
    options: [
      "Our conversations",
      "How easy it feels",
      "Laughing together",
      "Just being close",
    ],
  },
  {
    id: "r19",
    category: "romantic",
    question: "What's a future moment with me you look forward to?",
    options: [
      "A wedding",
      "Traveling the world together",
      "Growing old side by side",
      "Just more ordinary days",
    ],
  },
  {
    id: "r20",
    category: "romantic",
    question: "What makes you feel most loved by me?",
    options: [
      "When I really listen",
      "Small daily gestures",
      "When I show up for you",
      "When I make time for you",
    ],
  },
  {
    id: "r21",
    category: "romantic",
    question: "What's your dream romantic getaway just for the two of us?",
    options: [
      "A cozy cabin in the snowy mountains",
      "A private overwater beach villa",
      "A charming European countryside cottage",
      "A rooftop terrace in a lively city",
    ],
  },
  {
    id: "r22",
    category: "romantic",
    question: "What's your favorite way for us to reconnect after a busy day?",
    options: [
      "A long, warm hug in silence",
      "Cooking or sharing a quiet meal",
      "Cuddling while watching our show",
      "Talking through our thoughts",
    ],
  },
  {
    id: "r23",
    category: "romantic",
    question: "What kind of song always makes you think of us?",
    options: [
      "A slow romantic acoustic ballad",
      "An upbeat road-trip anthem",
      "A nostalgic track from when we met",
      "A sweet song on our shared playlist",
    ],
  },
];
