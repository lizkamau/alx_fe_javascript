// ============================
// Dynamic Quote Generator v3
// Adds Category Filtering with Web Storage
// ============================

let quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Don’t watch the clock; do what it does. Keep going.", category: "Inspiration" }
];

// ============================
// Load Quotes from Local Storage
// ============================
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// ============================
// Save Quotes to Local Storage
// ============================
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ============================
// Display Quotes Based on Filter
// ============================
function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", category); // Remember last filter

  let filteredQuotes = quotes;
  if (category !== "all") {
    filteredQuotes = quotes.filter(q => q.category.toLowerCase() === category.toLowerCase());
  }

  displayQuotes(filteredQuotes);
}

// ============================
// Display Quotes on the Page
// ============================
function displayQuotes(quotesToDisplay) {
  const displayDiv = document.getElementById("quoteDisplay");
  displayDiv.innerHTML = "";

  if (quotesToDisplay.length === 0) {
    displayDiv.innerText = "No quotes found in this category.";
    return;
  }

  quotesToDisplay.forEach(quote => {
    const p = document.createElement("p");
    p.innerText = `"${quote.text}" — ${quote.category}`;
    displayDiv.appendChild(p);
  });
}

// ============================
// Populate Category Dropdown
// ============================
function populateCategories() {
  const dropdown = document.getElementById("categoryFilter");
  dropdown.innerHTML = ""; // Clear old options

  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    dropdown.appendChild(option);
  });

  // Restore last selected category
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory && categories.includes(savedCategory)) {
    dropdown.value = savedCategory;
  } else {
    dropdown.value = "all";
  }
}

// ============================
// Show Random Quote
// ============================
function showRandomQuote() {
  const category = document.getElementById("categoryFilter").value;

  let filteredQuotes = quotes;
  if (category !== "all") {
    filteredQuotes = quotes.filter(q => q.category.toLowerCase() === category.toLowerCase());
  }

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").innerText = "No quotes available in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  document.getElementById("quoteDisplay").innerText = `"${quote.text}" — ${quote.category}`;

  // Save last viewed quote in sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// ============================
// Add a New Quote
// ============================
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category!");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  alert("Quote added successfully!");

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  filterQuotes();
}

// ============================
// Export Quotes to JSON
// ============================
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================
// Import Quotes from JSON File
// ============================
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
        filterQuotes();
      } else {
        alert("Invalid JSON file format.");
      }
    } catch (error) {
      alert("Error reading file. Please upload a valid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ============================
// Initialize
// ============================
window.onload = function () {
  loadQuotes();
  populateCategories();

  // Restore last selected filter and show quotes
  filterQuotes();

  // Restore last viewed quote if any
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").innerText = `"${quote.text}" — ${quote.category}`;
  }

  // Add event listener for "Show New Quote" button
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
};
