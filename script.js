// ===== Product Modal =====
function openProductModal(title, image, price, description) {
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalImage").src = image;
  document.getElementById("modalDescription").textContent = description;
  document.getElementById("modalPrice").textContent = price;
  document.getElementById("productModal").style.display = "block";
}

function closeProductModal() {
  document.getElementById("productModal").style.display = "none";
}

// ===== Request Modal =====
function openRequestModal() {
  document.getElementById("requestModal").style.display = "block";
}

function closeRequestModal() {
  document.getElementById("requestModal").style.display = "none";
}

// ===== Cart Modal =====
let cart = [];

function addToCart() {
  const title = document.getElementById("modalTitle").textContent;
  const price = document.getElementById("modalPrice").textContent;
  cart.push({ title, price });
  updateCart();
  closeProductModal();
  openCart();
}

function openCart() {
  document.getElementById("cartModal").style.display = "block";
  updateCart();
}

function closeCart() {
  document.getElementById("cartModal").style.display = "none";
}

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";
  let orderDetails = "";

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.title} - ${item.price}`;
    // Remove button
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.onclick = () => {
      cart.splice(index, 1);
      updateCart();
    };
    li.appendChild(removeBtn);
    cartItems.appendChild(li);

    orderDetails += `${item.title} - ${item.price}\n`;
  });

  document.getElementById("orderDetails").value = orderDetails;
}

// ===== Search Bar =====
document.getElementById("searchBar").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const products = document.querySelectorAll(".product-card");

  products.forEach(product => {
    const name = product.querySelector("h3").textContent.toLowerCase();
    if (name.includes(query)) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
});

// ===== Close Modals on Outside Click =====
window.onclick = function(event) {
  const productModal = document.getElementById("productModal");
  const requestModal = document.getElementById("requestModal");
  const cartModal = document.getElementById("cartModal");

  if (event.target === productModal) productModal.style.display = "none";
  if (event.target === requestModal) requestModal.style.display = "none";
  if (event.target === cartModal) cartModal.style.display = "none";
};
