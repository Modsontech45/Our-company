const quotes = [
    { quote: "The best way to predict the future is to create it.", author: "Modson" },
    { quote: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Modson" },
    { quote: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "Modson" },
    { quote: "Believe you can and you're halfway there.", author: "Modson" },
    { quote: "Success is the sum of small efforts, repeated day in and day out.", author: "Modson" },
    { quote: "Don’t watch the clock; do what it does. Keep going.", author: "Modson" },
    { quote: "The only way to do great work is to love what you do.", author: "Modson" },
    { quote: "Opportunities don't happen, you create them.", author: "Modson" },
    { quote: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Modson" },
    { quote: "Dream big and dare to fail.", author: "Modson" },
    { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Modson" },
    { quote: "Success is not how high you have climbed, but how you make a positive difference to the world.", author: "Modson" },
    { quote: "Success usually comes to those who are too busy to be looking for it.", author: "Modson" },
    { quote: "I find that the harder I work, the more luck I seem to have.", author: "Modson" },
    { quote: "If you are not willing to risk the usual, you will have to settle for the ordinary.", author: "Modson" },
    { quote: "The only limit to our realization of tomorrow is our doubts of today.", author: "Modson" },
    { quote: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Modson" },
    { quote: "You are never too old to set another goal or to dream a new dream.", author: "Modson" },
    { quote: "We may encounter many defeats, but we must not be defeated.", author: "Modson" },
    { quote: "It always seems impossible until it's done.", author: "Modson" },
    { quote: "The way to get started is to quit talking and begin doing.", author: "Modson" },
    { quote: "Do not wait to strike till the iron is hot, but make it hot by striking.", author: "Modson" },
    { quote: "Everything you can imagine is real.", author: "Modson" },
    { quote: "You don’t have to be great to start, but you have to start to be great.", author: "Modson" },
    { quote: "It’s not whether you get knocked down, it’s whether you get up.", author: "Modson" },
    { quote: "The only place where success comes before work is in the dictionary.", author: "Modson" },
    { quote: "Motivation is what gets you started. Habit is what keeps you going.", author: "Modson" },
    { quote: "Don’t limit your challenges. Challenge your limits.", author: "Modson" },
    { quote: "Everything you’ve ever wanted is on the other side of fear.", author: "Modson" },
    { quote: "The only way to achieve the impossible is to believe it is possible.", author: "Modson" },
    { quote: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Modson" },
    { quote: "There are no limits to what you can accomplish, except the limits you place on your own thinking.", author: "Modson" },
    { quote: "The future depends on what we do in the present.", author: "Modson" },
    { quote: "The secret of getting ahead is getting started.", author: "Modson" },
    { quote: "You miss 100% of the shots you don’t take.", author: "Modson" },
    { quote: "If you can dream it, you can do it.", author: "Modson" },
    { quote: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Modson" },
    { quote: "Success is not the key to happiness. Happiness is the key to success.", author: "Modson" },
    { quote: "In the middle of difficulty lies opportunity.", author: "Modson" },
    { quote: "The only way to do great work is to love what you do.", author: "Modson" },
    { quote: "It’s not about ideas. It’s about making ideas happen.", author: "Modson" },
    { quote: "When everything seems to be going against you, remember that the airplane takes off against the wind, not with it.", author: "Modson" },
    { quote: "I am not a product of my circumstances. I am a product of my decisions.", author: "Modson" },
    { quote: "Act as if what you do makes a difference. It does.", author: "Modson" },
    { quote: "The distance between your dreams and reality is called action.", author: "Modson" },
    { quote: "You don't have to be perfect to be amazing.", author: "Modson" },
    { quote: "Success doesn’t just find you. You have to go out and get it.", author: "Modson" },
    { quote: "The key to success is to focus on goals, not obstacles.", author: "Modson" },
    { quote: "Don’t stop when you’re tired. Stop when you’re done.", author: "Modson" },
    { quote: "The only way to do great work is to love what you do.", author: "Modson" },
    { quote: "Don’t wait for opportunity. Create it.", author: "Modson" },
    { quote: "Success is not in what you have, but who you are.", author: "Modson" },
    { quote: "It’s going to be hard, but hard does not mean impossible.", author: "Modson" },
    { quote: "You are capable of more than you know.", author: "Modson" },
    { quote: "Success isn’t just about what you accomplish in your life. It’s about what you inspire others to do.", author: "Modson" },
    { quote: "Everything you can imagine is real.", author: "Modson" },
    { quote: "Start where you are. Use what you have. Do what you can.", author: "Modson" },
    { quote: "Your limitation—it’s only your imagination.", author: "Modson" },
    { quote: "Push yourself, because no one else is going to do it for you.", author: "Modson" },
    { quote: "Great things never come from comfort zones.", author: "Modson" },
    { quote: "Dream it. Wish it. Do it.", author: "Modson" },
    { quote: "Success doesn’t just find you. You have to go out and get it.", author: "Modson" },
    { quote: "The harder you work, the luckier you get.", author: "Modson" },
    { quote: "Don’t limit your challenges. Challenge your limits.", author: "Modson" },
    { quote: "Dream it. Believe it. Build it.", author: "Modson" },
    { quote: "Everything you can imagine is real.", author: "Modson" },
    { quote: "If you can dream it, you can do it.", author: "Modson" },
    { quote: "Your only limit is your mind.", author: "Modson" },
    { quote: "Success doesn’t come from what you do occasionally, it comes from what you do consistently.", author: "Modson" },
    { quote: "The harder you work, the luckier you get.", author: "Modson" },
    { quote: "It’s not the strongest of the species that survive, nor the most intelligent, but the one most responsive to change.", author: "Modson" },
    { quote: "The best time to start was yesterday. The next best time is now.", author: "Modson" },
    { quote: "Success doesn’t come from what you do occasionally, it comes from what you do consistently.", author: "Modson" }
    ]


  function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    // Update the quote text
    document.getElementById("quote").textContent = `"${randomQuote.quote}"`;

    // Check if the author element already exists
    let author = document.getElementById("author");

    // If the author element doesn't exist, create it
    if (!author) {
      author = document.createElement("p");
      author.id = "author"; // Set the ID for the author
      document.querySelector(".quote-container").appendChild(author);
    }

    // Update the author's text content
    author.textContent = `by ${randomQuote.author}`;
  }

  // Display a new quote every 6 seconds
  setInterval(displayRandomQuote, 10000);

  // Display the first quote when the page loads
  displayRandomQuote();
