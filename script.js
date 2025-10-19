let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs", category: "Motivation" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "Inspiration" }
];

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function generateQuote() {
  const random = Math.floor(Math.random() * quotes.length);
  const quoteDisplay = document.getElementById('quoteDisplay');
  const quote = quotes[random];
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p>- ${quote.author}</p>`;
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

function addQuote() {
  const text = document.getElementById('quoteInput').value.trim();
  const author = document.getElementById('authorInput').value.trim();
  const category = document.getElementById('categoryInput').value.trim();

  if (text && author && category) {
    quotes.push({ text, author, category });
    saveQuotes();
    populateCategories();
    document.getElementById('quoteInput').value = '';
    document.getElementById('authorInput').value = '';
    document.getElementById('categoryInput').value = '';
    displayStatus("✅ Quote added locally!");
  } else {
    displayStatus("⚠️ Please fill all fields!");
  }
}

function populateCategories() {
  const filter = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(q => q.category))];
  filter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    filter.appendChild(opt);
  });
}

function filterQuotes() {
  const selected = document.getElementById('categoryFilter').value;
  localStorage.setItem('lastSelectedCategory', selected);
  const quoteDisplay = document.getElementById('quoteDisplay');

  const filtered = selected === 'all'
    ? quotes
    : quotes.filter(q => q.category === selected);

  if (filtered.length > 0) {
    const q = filtered[Math.floor(Math.random() * filtered.length)];
    quoteDisplay.innerHTML = `<p>"${q.text}"</p><p>- ${q.author}</p>`;
  } else {
    quoteDisplay.textContent = "No quotes in this category.";
  }
}

// Restore last filter
window.onload = () => {
  populateCategories();
  const lastFilter = localStorage.getItem('lastSelectedCategory') || 'all';
  document.getElementById('categoryFilter').value = lastFilter;
  filterQuotes();
};

// ✅ Simulated server data fetch
async function fetchServerQuotes() {
  // Simulating fetching from a fake API (replace with your own if needed)
  const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3');
  const data = await response.json();
  
  // Convert fake server data to quote format
  return data.map(post => ({
    text: post.title,
    author: "Server",
    category: "Imported"
  }));
}

// 🔁 Sync local with “server”
async function syncWithServer() {
  displayStatus("🔄 Syncing with server...");

  try {
    const serverQuotes = await fetchServerQuotes();

    // Conflict resolution: server data takes precedence
    const merged = [...quotes];
    serverQuotes.forEach(sq => {
      if (!merged.some(q => q.text === sq.text)) {
        merged.push(sq);
      }
    });

    quotes = merged;
    saveQuotes();
    populateCategories();
    displayStatus("✅ Synced with server successfully!");
  } catch (error) {
    displayStatus("❌ Sync failed. Check your connection.");
  }
}

function displayStatus(message) {
  document.getElementById('statusMessage').textContent = message;
}

