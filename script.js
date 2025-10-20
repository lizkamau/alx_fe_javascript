// Dynamic Quote Generator
// Contains functions: showRandomQuote and createAddQuoteForm (as requested)
// Also supports adding categories and quotes dynamically and persists to localStorage.

// Initial sample quotes
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "inspiration" },
  { text: "Simplicity is the soul of efficiency.", category: "design" },
  { text: "First, solve the problem. Then, write the code.", category: "programming" },
  { text: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.", category: "design" },
  { text: "Talk is cheap. Show me the code.", category: "programming" }
];

const STORAGE_KEY = 'dq_quotes_v1';

function loadQuotesFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        quotes = parsed;
      }
    }
  } catch (e) {
    console.warn('Could not load quotes from storage', e);
  }
}

function saveQuotesToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
  } catch (e) {
    console.warn('Could not save quotes to storage', e);
  }
}

// Utility: get unique categories (lowercased for grouping)
function getUniqueCategories() {
  const set = new Set();
  quotes.forEach(q => {
    if (q.category && q.category.toString().trim() !== '') {
      set.add(q.category.toString().trim());
    }
  });
  return Array.from(set).sort((a,b) => a.localeCompare(b));
}

// Create/update category select in DOM
function createCategorySelect() {
  const container = document.getElementById('category-container');
  container.innerHTML = ''; // clear

  const select = document.createElement('select');
  select.id = 'categorySelect';

  // "All" option
  const allOpt = document.createElement('option');
  allOpt.value = 'All';
  allOpt.textContent = 'All Categories';
  select.appendChild(allOpt);

  // add categories
  const categories = getUniqueCategories();
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat[0].toUpperCase() + cat.slice(1);
    select.appendChild(opt);
  });

  container.appendChild(select);

  // when category changes, show a random quote from that category
  select.addEventListener('change', () => {
    showRandomQuote();
  });
}

// Show a random quote filtered by currently selected category
function showRandomQuote() {
  const display = document.getElementById('quote-text');
  const meta = document.getElementById('quote-meta');

  const select = document.getElementById('categorySelect');
  const chosenCategory = select ? select.value : 'All';

  let pool;
  if (!select || chosenCategory === 'All') {
    pool = quotes.slice();
  } else {
    pool = quotes.filter(q => q.category && q.category.toString().trim() === chosenCategory);
  }

  if (!pool || pool.length === 0) {
    display.textContent = 'No quotes available for the selected category.';
    meta.textContent = chosenCategory === 'All' ? '' : `Category: ${chosenCategory}`;
    return;
  }

  const idx = Math.floor(Math.random() * pool.length);
  const chosen = pool[idx];

  display.textContent = `“${chosen.text}”`;
  meta.textContent = chosen.category ? `Category: ${chosen.category}` : '';
}

// Programmatically create the add-quote form and attach behaviors
function createAddQuoteForm() {
  const container = document.getElementById('add-quote-container');
  container.innerHTML = ''; // clear

  const title = document.createElement('div');
  title.style.fontWeight = '600';
  title.style.marginBottom = '8px';
  title.textContent = 'Add a new quote';

  container.appendChild(title);

  const row1 = document.createElement('div');
  row1.className = 'row';

  const inputText = document.createElement('input');
  inputText.type = 'text';
  inputText.id = 'newQuoteText';
  inputText.placeholder = 'Enter a new quote';
  inputText.style.flex = '1 1 300px';

  row1.appendChild(inputText);
  container.appendChild(row1);

  const row2 = document.createElement('div');
  row2.className = 'row';

  // Category input: offer a datalist so users can pick existing categories or type new one
  const categoryInput = document.createElement('input');
  categoryInput.type = 'text';
  categoryInput.id = 'newQuoteCategory';
  categoryInput.placeholder = 'Enter quote category (or choose existing)';
  categoryInput.style.flex = '0 1 240px';
  categoryInput.setAttribute('list', 'categories-datalist');

  const datalist = document.createElement('datalist');
  datalist.id = 'categories-datalist';
  getUniqueCategories().forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    datalist.appendChild(opt);
  });

  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.textContent = 'Add Quote';
  addButton.onclick = addQuote;

  row2.appendChild(categoryInput);
  row2.appendChild(datalist);
  row2.appendChild(addButton);
  container.appendChild(row2);

  const info = document.createElement('div');
  info.className = 'small message';
  info.id = 'addQuoteMessage';
  container.appendChild(info);

  // Start hidden by default; toggled by main toggle button
  container.style.transition = 'all 0.16s ease';
  container.setAttribute('aria-hidden', 'true');
}

// Add quote function used by the form button and the HTML snippet requirement
function addQuote() {
  const textEl = document.getElementById('newQuoteText');
  const catEl = document.getElementById('newQuoteCategory');
  const message = document.getElementById('addQuoteMessage');

  const text = textEl ? textEl.value.toString().trim() : '';
  const category = catEl ? catEl.value.toString().trim() : '';

  if (!text) {
    if (message) {
      message.textContent = 'Please enter quote text.';
      message.style.color = '#b23';
    }
    return;
  }

  // Default category if none provided
  const finalCategory = category === '' ? 'general' : category;

  const newQuote = { text, category: finalCategory };
  quotes.push(newQuote);
  saveQuotesToStorage();

  // update UI components (category select and datalist)
  createCategorySelect();
  // update datalist options inside add form
  const datalist = document.getElementById('categories-datalist');
  if (datalist) {
    datalist.innerHTML = '';
    getUniqueCategories().forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      datalist.appendChild(opt);
    });
  }

  // clear inputs and show message
  if (textEl) textEl.value = '';
  if (catEl) catEl.value = '';
  if (message) {
    message.textContent = 'Quote added successfully!';
    message.style.color = '#147a2e';
    setTimeout(() => { message.textContent = ''; }, 2500);
  }

  // Immediately show this new quote
  document.getElementById('quote-text').textContent = `“${newQuote.text}”`;
  document.getElementById('quote-meta').textContent = `Category: ${newQuote.category}`;
}

// Toggle visibility of the add form (accessibility attributes updated)
function toggleAddFormVisibility() {
  const container = document.getElementById('add-quote-container');
  const currentlyHidden = container.getAttribute('aria-hidden') === 'true';
  container.setAttribute('aria-hidden', String(!currentlyHidden));
  container.style.display = currentlyHidden ? 'block' : 'none';
}

// Initialize app
function init() {
  loadQuotesFromStorage();
  createCategorySelect();
  createAddQuoteForm();

  // Attach global button handlers
  document.getElementById('show-random-btn').addEventListener('click', showRandomQuote);
  document.getElementById('add-form-toggle').addEventListener('click', toggleAddFormVisibility);

  // Start with form hidden
  const container = document.getElementById('add-quote-container');
  container.style.display = 'none';
  container.setAttribute('aria-hidden', 'true');

  // If there are quotes, show one immediately
  if (quotes.length > 0) {
    showRandomQuote();
  } else {
    document.getElementById('quote-text').textContent = 'No quotes available yet. Add one below.';
    document.getElementById('quote-meta').textContent = '';
  }
}

// Run init on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Expose functions to window for the inline button signature (the user provided addQuote button example)
window.showRandomQuote = showRandomQuote;
window.createAddQuoteForm = createAddQuoteForm;
window.addQuote = addQuote;