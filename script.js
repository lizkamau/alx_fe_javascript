// === Quotes Array ===
// Each quote has text and category
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Do what you can, with what you have, where you are.", category: "Motivation" },
  { text: "The secret of getting ahead is getting started.", category: "Success" },
  { text: "Happiness depends upon ourselves.", category: "Life" }
];

// === Select DOM Elements ===
const quoteDisplay = document.getElementById("quoteDisplay");
const categorySelect = document.getElementById("categorySelect");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");

// === Populate Categories Dynamically ===
function populateCategories() {
  // Get unique categories
  const categories = [...new Set(quotes.map(q => q.category))];
  categorySelect.innerHTML = `<option value="all">All</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// === Show Random Quote ===
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = `"${randomQuote.text}" — (${randomQuote.category})`;
}

// === Add New Quote ===
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category!");
    return;
  }

  quotes.push({ text, category });

  // Update dropdown and clear form
  populateCategories();
  newQuoteText.value = "";
  newQuoteCategory.value = "";

  alert("✅ New quote added successfully!");
}

// === Initialize App ===
populateCategories();
showRandomQuote();
