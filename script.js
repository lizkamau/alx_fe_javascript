document.addEventListener('DOMContentLoaded', () => {
  const Display = document.getElementById('quoteDisplay');
  const n_quote = document.getElementById('newQuoteText');
  const nQC = document.getElementById('newQuoteCategory');
  const addBtn = document.getElementById('addQuote');
  const showBtn = document.getElementById('newQuote');
  const exportBtn = document.getElementById('exportQuotes');
  const categoryFilter = document.getElementById('categoryFilter');
  const resolveBtn = document.getElementById('resolveConflicts');
  const syncNotice = document.getElementById('syncNotice');

  const apiUrl = "https://jsonplaceholder.typicode.com/posts"; // ✅ Mock API

  let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "Frontend finesse meets backend logic.", category: "Tech" },
    { text: "Every bug is a lesson.", category: "Wisdom" },
    { text: "Code like poetry, debug like a detective.", category: "Creative" }
  ];

  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }

  function populateCategories() {
    const categories = [...new Set(quotes.map(q => q.category))];
    categoryFilter.innerHTML = '<option value="All">All</option>';
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      categoryFilter.appendChild(option);
    });

    const lastFilter = localStorage.getItem("lastSelectedCategory");
    if (lastFilter && categories.includes(lastFilter)) {
      categoryFilter.value = lastFilter;
      filterQuotes(lastFilter);
    } else {
      filterQuotes("All");
    }
  }

  function filterQuotes(selectedCategory) {
    const filtered = selectedCategory === "All"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

    Display.innerHTML = "";
    if (filtered.length === 0) {
      Display.textContent = "No quotes found for this category.";
    } else {
      filtered.forEach(q => {
        const p = document.createElement("p");
        p.textContent = `"${q.text}" — ${q.category}`;
        Display.appendChild(p);
      });
    }

    localStorage.setItem("lastSelectedCategory", selectedCategory);
  }

  showBtn.addEventListener('click', () => {
    const index = Math.floor(Math.random() * quotes.length);
    const quote = quotes[index];
    Display.textContent = `"${quote.text}" — ${quote.category}`;
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
  });

  addBtn.addEventListener('click', async () => {
    const newText = n_quote.value.trim();
    const newCategory = nQC.value.trim();

    if (newText && newCategory) {
      const newQuote = { text: newText, category: newCategory };
      quotes.push(newQuote);
      saveQuotes();

      // ✅ Post to mock API
      try {
        await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newQuote)
        });
        showSyncNotification("Quote added and posted to server.");
      } catch (err) {
        console.error("Failed to post quote:", err);
      }

      n_quote.value = "";
      nQC.value = "";

      populateCategories();
      filterQuotes(categoryFilter.value);
    } else {
      alert("Please enter both a quote and a category.");
    }
  });

  exportBtn.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "quotes.json";
    link.click();
    URL.revokeObjectURL(url);
  });

  window.importFromJsonFile = async function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text();
    try {
      const importedQuotes = JSON.parse(text);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        filterQuotes(categoryFilter.value);
        showSyncNotification('Quotes imported successfully!');
      } else {
        alert('Invalid JSON format.');
      }
    } catch (err) {
      alert('Error parsing JSON file.');
    }
  };

  categoryFilter.addEventListener('change', function () {
    filterQuotes(this.value);
  });

  resolveBtn.addEventListener('click', () => {
    fetchQuotesFromServer(); // ✅ Manual sync
    showSyncNotification("Manual sync triggered.");
  });

  function showSyncNotification(message) {
    syncNotice.textContent = message;
    setTimeout(() => {
      syncNotice.textContent = "";
    }, 5000);
  }

  // ✅ Periodic server fetch
  setInterval(fetchQuotesFromServer, 30000);

  // ✅ SyncQuotes function
  async function fetchQuotesFromServer() {
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      const serverQuotes = data.slice(0, 5).map(post => ({
        text: post.title,
        category: "Server"
      }));
      syncQuotes(serverQuotes);
    } catch (err) {
      console.error("Server fetch failed:", err);
    }
  }

  // ✅ Conflict resolution and localStorage update
  function syncQuotes(serverQuotes) {
    let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
    let updated = false;

    serverQuotes.forEach(sq => {
      const exists = localQuotes.some(lq => lq.text === sq.text);
      if (!exists) {
        localQuotes.push(sq);
        updated = true;
      }
    });

    if (updated) {
      localStorage.setItem("quotes", JSON.stringify(localQuotes));
      quotes = localQuotes;
      populateCategories();
      filterQuotes(categoryFilter.value);
      showSyncNotification("Quotes synced with server!");
    }
  }

  // Initial setup
  populateCategories();

  const lastQuote = sessionStorage.getItem("lastViewedQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    Display.textContent = `"${quote.text}" — ${quote.category}`;
  }
});