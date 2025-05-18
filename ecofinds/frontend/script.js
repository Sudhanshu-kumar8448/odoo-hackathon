const API_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('token');
let username = localStorage.getItem('username');

// Show/hide sections
function showAuth(isRegister) {
  document.getElementById('auth-section').style.display = 'block';
  document.getElementById('feed-section').style.display = 'none';
  document.getElementById('add-product-section').style.display = 'none';
  document.getElementById('product-detail-section').style.display = 'none';
  document.getElementById('auth-title').textContent = isRegister ? 'Register' : 'Login';
  document.getElementById('auth-toggle').innerHTML = isRegister
    ? 'Already have an account? <a href="#" onclick="showAuth(false)">Login</a>'
    : 'No account? <a href="#" onclick="showAuth(true)">Register</a>';
  document.getElementById('username').style.display = isRegister ? 'block' : 'none';
}
function showFeed() {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('feed-section').style.display = 'block';
  document.getElementById('add-product-section').style.display = 'none';
  document.getElementById('product-detail-section').style.display = 'none';
  fetchProducts();
}
function showAddProductForm() {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('feed-section').style.display = 'none';
  document.getElementById('add-product-section').style.display = 'block';
  document.getElementById('product-detail-section').style.display = 'none';
}
function showProductDetail(id) {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('feed-section').style.display = 'none';
  document.getElementById('add-product-section').style.display = 'none';
  document.getElementById('product-detail-section').style.display = 'block';
  fetchProduct(id);
}

// Auth form submission
document.getElementById('auth-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const username = document.getElementById('username').value;
  const isRegister = document.getElementById('auth-title').textContent === 'Register';
  const url = isRegister ? `${API_URL}/auth/register` : `${API_URL}/auth/login`;
  const body = isRegister ? { email, password, username } : { email, password };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      token = data.token;
      username = data.username;
      document.getElementById('user-info').textContent = `Welcome, ${username}`;
      showFeed();
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert('Error connecting to server');
  }
});

// Add product form submission
document.getElementById('add-product-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const product = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    category: document.getElementById('product-category').value,
    price: parseFloat(document.getElementById('price').value),
    imagePlaceholder: document.getElementById('image').value,
  };

  try {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    if (res.ok) {
      showFeed();
    } else {
      const data = await res.json();
      alert(data.message);
    }
  } catch (error) {
    alert('Error adding product');
  }
});

// Fetch and display products
async function fetchProducts() {
  const search = document.getElementById('search').value;
  const category = document.getElementById('category').value;
  const url = new URL(`${API_URL}/products`);
  if (search) url.searchParams.append('q', search);
  if (category) url.searchParams.append('category', category);

  try {
    const res = await fetch(url);
    const products = await res.json();
    const productsDiv = document.getElementById('products');
    productsDiv.innerHTML = products.map(p => `
      <div class="product-card">
        <img src="${p.imagePlaceholder || 'images/placeholder.jpg'}" alt="${p.title}">
        <h3>${p.title}</h3>
        <p>$${p.price}</p>
        <button onclick="showProductDetail('${p._id}')">View</button>
        <button onclick="deleteProduct('${p._id}')">Delete</button>
      </div>
    `).join('');
  } catch (error) {
    alert('Error fetching products');
  }
}

// Fetch single product
async function fetchProduct(id) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`);
    const p = await res.json();
    document.getElementById('product-detail').innerHTML = `
      <img src="${p.imagePlaceholder || 'images/placeholder.jpg'}" alt="${p.title}">
      <h2>${p.title}</h2>
      <p>Price: $${p.price}</p>
      <p>Category: ${p.category}</p>
      <p>${p.description}</p>
    `;
  } catch (error) {
    alert('Error fetching product');
  }
}

// Delete product
async function deleteProduct(id) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (res.ok) {
      fetchProducts();
    } else {
      const data = await res.json();
      alert(data.message);
    }
  } catch (error) {
    alert('Error deleting product');
  }
}

// Search and filter
document.getElementById('search').addEventListener('input', fetchProducts);
document.getElementById('category').addEventListener('change', fetchProducts);

// Initial load
if (token && username) {
  document.getElementById('user-info').textContent = `Welcome, ${username}`;
  showFeed();
} else {
  showAuth(true);
}