interface Quote {
  text: string
  author: string
}

const quotes: Quote[] = [
  {
    text: "The secret to getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    text: "It always seems impossible—until it’s done.",
    author: "Nelson Mandela",
  },
  {
    text: "Don't count the days. Make the days count.",
    author: "Muhammad Ali",
  },
  {
    text: "Quit talking and begin doing.",
    author: "Walt Disney",
  },
  {
    text: "Your time is limited. Don’t waste it living someone else’s life.",
    author: "Steve Jobs",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Success is not final, failure is not fatal: it’s the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    text: "Believe you can and you’re halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
  },
  {
    text: "It doesn’t matter how slowly you go as long as you do not stop.",
    author: "Confucius",
  },
  {
    text: "Quality is not an act. It’s a habit.",
    author: "Aristotle",
  },
  {
    text: "The hardest part is deciding to act. The rest is just persistence.",
    author: "Amelia Earhart",
  },
  {
    text: "You're never too old to set a new goal or dream a new dream.",
    author: "C.S. Lewis",
  },
  {
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    author: "Franklin D. Roosevelt",
  },
  {
    text: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt",
  },
  {
    text: "Discipline is the bridge between goals and achievement.",
    author: "Jim Rohn",
  },
  {
    text: "Action is the foundational key to success.",
    author: "Pablo Picasso",
  },
  {
    text: "Small deeds done are better than great deeds planned.",
    author: "Peter Marshall",
  },
  {
    text: "Dream big. Start small. Act now.",
    author: "Robin Sharma",
  },
  {
    text: "Don’t watch the clock—do what it does. Keep going.",
    author: "Sam Levenson",
  },
  {
    text: "Success usually comes to those too busy to be looking for it.",
    author: "Henry David Thoreau",
  },
  {
    text: "You don’t have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar",
  },
  {
    text: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe",
  },
  {
    text: "Your mind is for having ideas—not holding them.",
    author: "David Allen",
  },
  {
    text: "Done is better than perfect.",
    author: "Sheryl Sandberg",
  },
  {
    text: "The best way out is always through.",
    author: "Robert Frost",
  },
  {
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier",
  },
  {
    text: "Either you run the day, or the day runs you.",
    author: "Jim Rohn",
  },
  {
    text: "Focus on being productive—not just busy.",
    author: "Tim Ferriss",
  },
]

export function getRandomQuote(): Quote {
  return quotes[Math.floor(Math.random() * quotes.length)]
}
