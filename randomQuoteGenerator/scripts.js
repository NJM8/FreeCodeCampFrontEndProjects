$(document).ready(function(){
  function tweetIt () {
    const phrase = document.getElementById('phrase').innerText;
    const author = document.getElementById('author').innerText;
    const tweetUrl = 'https://twitter.com/intent/tweet?text=' +
    encodeURIComponent(phrase) + " " + encodeURIComponent(author);
    window.open(tweetUrl);
  }

  const quotes = {
    quote_0: {
      id: 0,
      phrase: "People often say that motivation doesn’t last. Well, neither does bathing. That’s why we recommend it daily.",
      author: "Zig Ziglar"
    },
    quote_1: {
      id: 1,
      phrase: "The best time to plant a tree was 20 years ago, the second best time is now.",
      author: "Chinese Proverb"
    },
    quote_2: {
      id: 2,
      phrase: "It does not matter how slowly you go as long as you do not stop.",
      author: "Confucius"
    },
    quote_3: {
      id: 3,
      phrase: "In the end, it's not the years in your life that count. It's the life in your years.",
      author: "Abraham Lincoln"
    },
    quote_4: {
      id: 4,
      phrase: "However bad life may seem, there is always something you can do, and succeed at. While there is life, there is hope.",
      author: "Stephen Hawking"
    },
    quote_5: {
      id: 5,
      phrase: "Always do right. This will gratify some people and astonish the rest. ",
      author: "Mark Twain"
    },
    quote_6: {
      id: 6,
      phrase: "Every strike brings me closer to the next home run.",
      author: "Babe Ruth"
    },
    quote_7: {
      id: 7,
      phrase: "The mind is everything. What you think you become.",
      author: "Buddha"
    },
    quote_8: {
      id: 8,
      phrase: "Your time is limited, so don’t waste it living someone else’s life.",
      author: "Steve Jobs"
    },
    quote_9: {
      id: 9,
      phrase: "You can never cross the ocean until you have the courage to lose sight of the shore.",
      author: "Christopher Columbus"
    },
    quote_10: {
      id: 10,
      phrase: "If you hear a voice within you say “you cannot paint,” then by all means paint and that voice will be silenced.",
      author: "Vincent Van Gogh"
    },
    quote_11: {
      id: 11,
      phrase: "The best way to predict the future is to create it." ,
      author: "Abraham Lincoln"
    },
    quote_12: {
      id: 12,
      phrase: "When I went to school, they asked me what I wanted to be when I grew up. I wrote down 'Happy'. They told me I didn't understand the assignment and I told them they didn't understand life." ,
      author: "John Lennon"
    },
    quote_13: {
      id: 13,
      phrase: "If today were the last day of your life, would you want to do what you are about to do today?" ,
      author: "Steve Jobs"
    },
    quote_14: {
      id: 14,
      phrase: "Have no fear of perfection, you'll never reach it." ,
      author: "Salvador Dali"
    },
    quote_15: {
      id: 15,
      phrase: "The greatest glory in living lies not in never falling, but in rising every time we fall." ,
      author: "Nelson Mandela"
    },
    quote_16: {
      id: 16,
      phrase: "We cannot solve our problems with the same thinking used when we created them." ,
      author: "Albert Einstein"
    },
    quote_17: {
      id: 17,
      phrase: "Do not pray for an easy life, pray for the strength to endure a difficult one." ,
      author: "Bruce Lee"
    },
    quote_18: {
      id: 18,
      phrase: "If you cannot fly, then run. If you cannot run, then walk. If you cannot walk then crawl, but whatever you do, you have to keep moving forward." ,
      author: "Martin Luther King Jr."
    },
    quote_19: {
      id: 19,
      phrase: "If you truly love life, don't waste time; because time is what life is made of." ,
      author: "Bruce Lee"
    },
    quote_20: {
      id: 20,
      phrase: "However bad life may seem, there is always something you can do, and succeed at. While there is life, there is hope." ,
      author: "Stephen Hawking"
    }
  }

  $("#newQuote").click(function(){
    $("#quoteCard").fadeOut("slow", function(){
      showNewQuote();
    })
  });

  function showNewQuote(){
    const randNum = Math.floor(Math.random() * 20 + 1);
    let newQuote = "";
    let newAuthor = "";
    for (let key in quotes) {
      for (let key2 in quotes[key]){
        if (quotes[key][key2] === randNum) {
          newQuote = quotes[key].phrase;
          newAuthor = quotes[key].author;
        } 
      }
    }
    $("#phrase").html(newQuote);
    $("#author").html(newAuthor);
    const newTopPadding = Math.random() * ($(document).height() - $("#quoteCard").outerHeight());
    const newLeftPadding = Math.random() * ($(document).width() - $("#quoteCard").outerWidth());
    $("#quoteCard").css({"padding-top": newTopPadding});
    $("#quoteCard").css({"padding-left": newLeftPadding});
    $("#quoteCard").fadeIn("slow", function(){
    });
  };
});
