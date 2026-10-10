/**
 * seed.js — Database Seeder
 * ─────────────────────────────────────────────
 * Run: node seed.js
 * Seeds sample quizzes and promotes existing user to admin.
 */
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Quiz = require("./models/Quiz");
const User = require("./models/User");

const sampleQuizzes = [
  {
    title: "JavaScript Fundamentals",
    category: "Tech",
    difficulty: "Easy",
    description: "Test your knowledge of core JavaScript concepts including variables, functions, and basic syntax.",
    duration: "5 min",
    timePerQuestion: 30,
    status: "Active",
    questions: [
      { q: "Which keyword is used to declare a constant in JavaScript?", options: ["var", "let", "const", "define"], answer: 2 },
      { q: "What does 'typeof null' return?", options: ["null", "undefined", "object", "number"], answer: 2 },
      { q: "Which method converts JSON string to a JavaScript object?", options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.toObject()"], answer: 0 },
      { q: "What is the output of: console.log(2 + '2')?", options: ["4", "22", "NaN", "Error"], answer: 1 },
      { q: "Which array method adds an element to the end?", options: ["shift()", "unshift()", "pop()", "push()"], answer: 3 },
      { q: "What does '===' check in JavaScript?", options: ["Value only", "Type only", "Value and type", "Reference"], answer: 2 },
      { q: "Which function is used to delay execution?", options: ["setDelay()", "setTimeout()", "pause()", "wait()"], answer: 1 },
      { q: "How do you create a function in JavaScript?", options: ["function myFunc()", "create myFunc()", "def myFunc()", "func myFunc()"], answer: 0 },
      { q: "What is the default value of an uninitialized variable?", options: ["null", "0", "undefined", "NaN"], answer: 2 },
      { q: "Which operator is used for exponentiation?", options: ["^", "**", "%%", "//"], answer: 1 },
    ],
  },
  {
    title: "React Essentials",
    category: "Tech",
    difficulty: "Medium",
    description: "Challenge yourself with questions about React hooks, components, and state management.",
    duration: "5 min",
    timePerQuestion: 30,
    status: "Active",
    questions: [
      { q: "What hook is used for side effects in React?", options: ["useState", "useEffect", "useContext", "useMemo"], answer: 1 },
      { q: "What is the virtual DOM?", options: ["A copy of the real DOM in memory", "A new browser API", "A database", "A CSS framework"], answer: 0 },
      { q: "How do you pass data from parent to child component?", options: ["state", "props", "context", "refs"], answer: 1 },
      { q: "Which hook manages component state?", options: ["useEffect", "useRef", "useState", "useReducer"], answer: 2 },
      { q: "What does JSX stand for?", options: ["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript Extra"], answer: 0 },
      { q: "How do you conditionally render in React?", options: ["if/else in JSX", "Ternary operator", "switch statement", "All of the above"], answer: 3 },
      { q: "What is the purpose of keys in React lists?", options: ["Styling", "Unique identification for reconciliation", "Event handling", "Data binding"], answer: 1 },
      { q: "Which method is used to update state?", options: ["this.state = newVal", "setState() / setter function", "updateState()", "modifyState()"], answer: 1 },
      { q: "What does useRef return?", options: ["A state value", "A mutable ref object", "A callback", "A promise"], answer: 1 },
      { q: "What is React.Fragment used for?", options: ["Error handling", "Grouping elements without extra DOM node", "State management", "Routing"], answer: 1 },
    ],
  },
  {
    title: "World General Knowledge",
    category: "GK",
    difficulty: "Easy",
    description: "Explore your general knowledge about the world, geography, science, and more.",
    duration: "5 min",
    timePerQuestion: 30,
    status: "Active",
    questions: [
      { q: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Perth"], answer: 2 },
      { q: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], answer: 1 },
      { q: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: 3 },
      { q: "How many continents are there?", options: ["5", "6", "7", "8"], answer: 2 },
      { q: "What is the chemical symbol for gold?", options: ["Go", "Gd", "Au", "Ag"], answer: 2 },
      { q: "Which country has the largest population?", options: ["USA", "India", "China", "Indonesia"], answer: 1 },
      { q: "What is the hardest natural substance?", options: ["Iron", "Granite", "Diamond", "Quartz"], answer: 2 },
      { q: "Which organ pumps blood in the human body?", options: ["Brain", "Liver", "Lungs", "Heart"], answer: 3 },
      { q: "What is the speed of light approximately?", options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "100,000 km/s"], answer: 0 },
      { q: "Who painted the Mona Lisa?", options: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Van Gogh"], answer: 1 },
    ],
  },
  {
    title: "Cricket World Cup",
    category: "Sports",
    difficulty: "Medium",
    description: "Test your knowledge about Cricket World Cup history, records, and iconic moments.",
    duration: "5 min",
    timePerQuestion: 30,
    status: "Active",
    questions: [
      { q: "Which country won the first Cricket World Cup in 1975?", options: ["Australia", "England", "West Indies", "India"], answer: 2 },
      { q: "Who holds the record for most runs in World Cup history?", options: ["Ricky Ponting", "Sachin Tendulkar", "Brian Lara", "Virat Kohli"], answer: 1 },
      { q: "Which country has won the most Cricket World Cups?", options: ["India", "West Indies", "Australia", "England"], answer: 2 },
      { q: "In which year did India first win the Cricket World Cup?", options: ["1975", "1983", "1987", "2011"], answer: 1 },
      { q: "Who scored the first double century in ODI cricket?", options: ["Virender Sehwag", "Sachin Tendulkar", "Chris Gayle", "Rohit Sharma"], answer: 1 },
      { q: "How many overs per side in an ODI match?", options: ["20", "40", "50", "60"], answer: 2 },
      { q: "Which bowler has taken the most wickets in World Cup history?", options: ["Glenn McGrath", "Muttiah Muralitharan", "Wasim Akram", "Mitchell Starc"], answer: 0 },
      { q: "Which country hosted the 2023 Cricket World Cup?", options: ["England", "Australia", "India", "South Africa"], answer: 2 },
      { q: "What is a 'hat-trick' in cricket?", options: ["3 sixes in a row", "3 wickets in 3 consecutive balls", "3 catches in an over", "3 run-outs"], answer: 1 },
      { q: "Which player is known as 'Master Blaster'?", options: ["Virat Kohli", "Sachin Tendulkar", "MS Dhoni", "Kapil Dev"], answer: 1 },
    ],
  },
  {
    title: "Ancient Indian History",
    category: "History",
    difficulty: "Medium",
    description: "Explore the rich history of ancient India — from the Indus Valley to the Mughal Empire.",
    duration: "5 min",
    timePerQuestion: 30,
    status: "Active",
    questions: [
      { q: "Which civilization is one of the oldest in the world, found in India?", options: ["Mesopotamian", "Indus Valley", "Egyptian", "Chinese"], answer: 1 },
      { q: "Who was the founder of the Maurya Empire?", options: ["Ashoka", "Bindusara", "Chandragupta Maurya", "Samudragupta"], answer: 2 },
      { q: "The battle of Kalinga changed which emperor?", options: ["Akbar", "Ashoka", "Chandragupta", "Harsha"], answer: 1 },
      { q: "Who wrote 'Arthashastra'?", options: ["Valmiki", "Kautilya (Chanakya)", "Kalidasa", "Tulsidas"], answer: 1 },
      { q: "Which dynasty built the Taj Mahal?", options: ["Chola", "Mughal", "Gupta", "Maratha"], answer: 1 },
      { q: "What was the ancient name of Patna?", options: ["Kashi", "Pataliputra", "Ujjain", "Taxila"], answer: 1 },
      { q: "Who is known as the 'Napoleon of India'?", options: ["Ashoka", "Chandragupta II", "Samudragupta", "Akbar"], answer: 2 },
      { q: "Which Veda is the oldest?", options: ["Samaveda", "Yajurveda", "Atharvaveda", "Rigveda"], answer: 3 },
      { q: "The Gupta period is known as the ______ of Indian history.", options: ["Iron Age", "Golden Age", "Silver Age", "Bronze Age"], answer: 1 },
      { q: "Who built the famous Nalanda University?", options: ["Ashoka", "Kumaragupta I", "Harsha", "Kanishka"], answer: 1 },
    ],
  },
  {
    title: "Python Programming",
    category: "Tech",
    difficulty: "Easy",
    description: "Basic Python programming questions covering syntax, data types, and built-in functions.",
    duration: "5 min",
    timePerQuestion: 30,
    status: "Active",
    questions: [
      { q: "What is the correct file extension for Python files?", options: [".pt", ".py", ".python", ".pn"], answer: 1 },
      { q: "Which function outputs text to the console?", options: ["echo()", "console.log()", "print()", "write()"], answer: 2 },
      { q: "How do you create a list in Python?", options: ["{}", "[]", "()", "<>"], answer: 1 },
      { q: "What keyword is used for a function in Python?", options: ["function", "func", "def", "fn"], answer: 2 },
      { q: "Which operator is used for floor division?", options: ["/", "//", "%", "**"], answer: 1 },
      { q: "What type is the result of: type(3.14)?", options: ["int", "str", "float", "double"], answer: 2 },
      { q: "How do you start a comment in Python?", options: ["//", "/*", "#", "--"], answer: 2 },
      { q: "What does len() do?", options: ["Returns the type", "Returns the length", "Returns the sum", "Returns the max"], answer: 1 },
      { q: "Which data type is immutable?", options: ["list", "dict", "set", "tuple"], answer: 3 },
      { q: "What does 'pip' stand for?", options: ["Python Install Package", "Pip Installs Packages", "Package in Python", "Python Integrated Platform"], answer: 1 },
    ],
  },
  {
    title: "Football Legends",
    category: "Sports",
    difficulty: "Easy",
    description: "How well do you know the world of football? Test with questions about legends and records.",
    duration: "5 min",
    timePerQuestion: 30,
    status: "Active",
    questions: [
      { q: "Which country has won the most FIFA World Cups?", options: ["Germany", "Argentina", "Brazil", "Italy"], answer: 2 },
      { q: "Who is the all-time top scorer in FIFA World Cup?", options: ["Pelé", "Miroslav Klose", "Ronaldo", "Just Fontaine"], answer: 1 },
      { q: "In which year was the first FIFA World Cup held?", options: ["1926", "1930", "1934", "1928"], answer: 1 },
      { q: "How many players are on a football team on the field?", options: ["9", "10", "11", "12"], answer: 2 },
      { q: "What is the duration of a standard football match?", options: ["60 min", "80 min", "90 min", "120 min"], answer: 2 },
      { q: "Who won the Ballon d'Or the most times?", options: ["Cristiano Ronaldo", "Lionel Messi", "Michel Platini", "Johan Cruyff"], answer: 1 },
      { q: "What color card means a player is sent off?", options: ["Yellow", "Blue", "Red", "Green"], answer: 2 },
      { q: "Which club is known as 'The Red Devils'?", options: ["Liverpool", "Arsenal", "Manchester United", "Bayern Munich"], answer: 2 },
      { q: "What does FIFA stand for?", options: ["Federation of International Football Association", "Fédération Internationale de Football Association", "Football International Federation Agency", "Federal Institute of Football Activities"], answer: 1 },
      { q: "Which country hosted the 2022 FIFA World Cup?", options: ["Russia", "Brazil", "Qatar", "Japan"], answer: 2 },
    ],
  },
  {
    title: "World War History",
    category: "History",
    difficulty: "Hard",
    description: "Deep dive into World War I and II events, leaders, and turning points.",
    duration: "5 min",
    timePerQuestion: 30,
    status: "Active",
    questions: [
      { q: "In which year did World War I begin?", options: ["1912", "1914", "1916", "1918"], answer: 1 },
      { q: "Who was the leader of Nazi Germany?", options: ["Mussolini", "Stalin", "Hitler", "Churchill"], answer: 2 },
      { q: "What event triggered the start of World War I?", options: ["Invasion of Poland", "Assassination of Archduke Franz Ferdinand", "Bombing of Pearl Harbor", "Treaty of Versailles"], answer: 1 },
      { q: "Which country dropped atomic bombs on Japan?", options: ["UK", "Russia", "Germany", "USA"], answer: 3 },
      { q: "What was D-Day?", options: ["Germany's surrender", "Allied invasion of Normandy", "Japan's attack on Pearl Harbor", "Treaty signing"], answer: 1 },
      { q: "Which countries formed the Axis Powers in WWII?", options: ["USA, UK, France", "Germany, Italy, Japan", "Russia, China, India", "Germany, USA, Japan"], answer: 1 },
      { q: "When did World War II end?", options: ["1943", "1944", "1945", "1946"], answer: 2 },
      { q: "What was the Holocaust?", options: ["A battle", "Genocide of Jews by Nazi Germany", "A peace treaty", "An economic crisis"], answer: 1 },
      { q: "Which battle is considered the turning point of WWII in Europe?", options: ["Battle of Britain", "Battle of Stalingrad", "Battle of Midway", "Battle of the Bulge"], answer: 1 },
      { q: "What organization was formed after WWII to maintain peace?", options: ["NATO", "EU", "United Nations", "League of Nations"], answer: 2 },
    ],
  },
  {
    title: "Science & Space",
    category: "GK",
    difficulty: "Medium",
    description: "Questions about space exploration, physics, and scientific discoveries.",
    duration: "5 min",
    timePerQuestion: 30,
    status: "Active",
    questions: [
      { q: "What is the closest planet to the Sun?", options: ["Venus", "Earth", "Mercury", "Mars"], answer: 2 },
      { q: "Who proposed the theory of relativity?", options: ["Newton", "Einstein", "Hawking", "Tesla"], answer: 1 },
      { q: "What is the largest planet in our solar system?", options: ["Saturn", "Neptune", "Jupiter", "Uranus"], answer: 2 },
      { q: "What is the unit of electrical resistance?", options: ["Volt", "Watt", "Ohm", "Ampere"], answer: 2 },
      { q: "Who was the first person to walk on the Moon?", options: ["Buzz Aldrin", "Yuri Gagarin", "Neil Armstrong", "John Glenn"], answer: 2 },
      { q: "What does DNA stand for?", options: ["Deoxyribonucleic Acid", "Dynamic Nucleic Acid", "Di-Nuclear Acid", "Dual Nitrogen Acid"], answer: 0 },
      { q: "What gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], answer: 2 },
      { q: "What is the speed of sound approximately?", options: ["343 m/s", "300,000 km/s", "1000 m/s", "150 m/s"], answer: 0 },
      { q: "Which element has the atomic number 1?", options: ["Helium", "Oxygen", "Hydrogen", "Carbon"], answer: 2 },
      { q: "What is a light-year a measure of?", options: ["Time", "Speed", "Distance", "Brightness"], answer: 2 },
    ],
  },
  {
    title: "Database & SQL Basics",
    category: "Tech",
    difficulty: "Hard",
    description: "Test your knowledge of SQL queries, database concepts, and normalization.",
    duration: "5 min",
    timePerQuestion: 30,
    status: "Active",
    questions: [
      { q: "What does SQL stand for?", options: ["Structured Question Language", "Structured Query Language", "Simple Query Language", "Sequential Query Logic"], answer: 1 },
      { q: "Which SQL clause is used to filter records?", options: ["ORDER BY", "GROUP BY", "WHERE", "HAVING"], answer: 2 },
      { q: "What is a primary key?", options: ["A foreign table reference", "A unique identifier for a row", "An index", "A stored procedure"], answer: 1 },
      { q: "Which join returns all rows from both tables?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"], answer: 3 },
      { q: "What does CRUD stand for?", options: ["Create Read Update Delete", "Copy Replace Update Destroy", "Create Run Upload Delete", "Compile Read Update Debug"], answer: 0 },
      { q: "Which normal form eliminates partial dependency?", options: ["1NF", "2NF", "3NF", "BCNF"], answer: 1 },
      { q: "What command is used to remove a table?", options: ["DELETE TABLE", "REMOVE TABLE", "DROP TABLE", "TRUNCATE TABLE"], answer: 2 },
      { q: "Which SQL function returns the number of rows?", options: ["SUM()", "AVG()", "COUNT()", "MAX()"], answer: 2 },
      { q: "What is an index used for in databases?", options: ["Encryption", "Faster data retrieval", "Data backup", "Authentication"], answer: 1 },
      { q: "What is a foreign key?", options: ["A key from another country", "A reference to primary key of another table", "An encrypted key", "A temporary key"], answer: 1 },
    ],
  },
];

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/quizapp";
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    const defaultAdminEmail = "admin@quizmaster.com";
    const defaultAdminPassword = "admin123";
    const allUsers = await User.find();
    const existingDefaultAdmin = await User.findOne({ email: defaultAdminEmail });

    if (!existingDefaultAdmin) {
      await User.create({
        name: "Admin",
        email: defaultAdminEmail,
        password: defaultAdminPassword,
        role: "admin",
      });
      console.log(`✅ Created default admin user: ${defaultAdminEmail} (password: ${defaultAdminPassword})`);
    } else {
      console.log(`ℹ️  Default admin already exists: ${defaultAdminEmail}`);
    }

    if (allUsers.length > 0) {
      for (const u of allUsers) {
        if (u.role !== "admin") {
          u.role = "admin";
          await u.save({ validateBeforeSave: false });
          console.log(`✅ Promoted ${u.name} (${u.email}) to admin`);
        }
      }
    }

    // 2. Clear existing quizzes
    await Quiz.deleteMany({});
    console.log("🗑️  Cleared existing quizzes");

    // 3. Insert sample quizzes
    const createdQuizzes = await Quiz.insertMany(sampleQuizzes);
    console.log(`✅ Inserted ${createdQuizzes.length} sample quizzes`);

    console.log("\n🎉 Seeding complete! You can now:");
    console.log("   - Browse quizzes at /quizzes");
    console.log("   - Access admin panel at /admin");
    console.log("   - Login and re-login to get updated token with admin role\n");
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
  }
}

async function initDatabase() {
  const dbUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/quizapp";
  let connectedHere = false;

  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(dbUri);
    connectedHere = true;
  }

  try {
    const quizCount = await Quiz.countDocuments();
    const adminExists = await User.exists({ role: "admin" });

    if (!adminExists) {
      const existingAdminEmail = "admin@quizmaster.com";
      const existingAdmin = await User.findOne({ email: existingAdminEmail });
      if (!existingAdmin) {
        await User.create({
          name: "Admin",
          email: existingAdminEmail,
          password: "admin123",
          role: "admin",
        });
        console.log("✅ Created default admin user: admin@quizmaster.com / admin123");
      }
    }

    if (quizCount === 0) {
      await Quiz.insertMany(sampleQuizzes);
      console.log(`✅ Inserted ${sampleQuizzes.length} sample quizzes`);
    }
  } finally {
    if (connectedHere) {
      await mongoose.disconnect();
    }
  }
}

module.exports = { initDatabase };

if (require.main === module) {
  seed();
}
