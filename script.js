// ============================
// Dynamic Quote Generator v2
// With Local Storage + Filter + Import/Export
// ============================

// Default quotes
let quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Don’t watch the clock; do what it does. Keep going.", category: "Inspiration" }
];

// ============================
// Load Quotes from Local Storage (if available)
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
// Display a Random Quote
// ============================
function showRandomQuote() {
  const categoryFilter = document.getElementById("categoryFilter").value;

  // Filter quotes based on selected category
  let filteredQuotes = quotes;
  if (categoryFilter !== "all") {
    filteredQuotes = quotes.filter(q => q.category.toLowerCase() === categoryFilter.toLowerCase());
  }

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").innerText = "No quotes available in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  document.getElementById("quoteDisplay").innerText = `"${quote.text}" — ${quote.category}`;

  // Save last viewed quote to sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// ============================
// Add a New Quote
// ============================
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category!");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  updateCategoryDropdown();
  alert("Quote added successfully!");

  // Clear inputs
  textInput.value = "";
  categoryInput.value = "";
}

// ============================
// Populate Category Dropdown
// ============================
function updateCategoryDropdown() {
  const dropdown = document.getElementById("categoryFilter");

  // Get unique categories
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  // Reset dropdown
  dropdown.innerHTML = "";

  // Add categories to dropdown
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    dropdown.appendChild(option);
  });
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
        updateCategoryDropdown();
        alert("Quotes imported successfully!");
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
// Event Listeners
// ============================
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("categoryFilter").addEventListener("change", showRandomQuote);

// ============================
// Initialize on Page Load
// ============================
window.onload = function () {
  loadQuotes();
  updateCategoryDropdown();

  // Display last viewed quote if available (from sessionStorage)
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").innerText = `"${quote.text}" — ${quote.category}`;
  }
};
