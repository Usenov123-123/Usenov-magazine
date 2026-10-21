
const productsData = [
    {
        id: 1,
        name: "Наушники Studio Pro",
        category: "Электроника",
        price: 4500,
        tag: "ХИТ",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Смарт-часы Active",
        category: "Электроника",
        price: 6200,
        tag: "НОВИНКА",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Кроссовки Urban",
        category: "Одежда",
        price: 3900,
        tag: "",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Рюкзак Everyday",
        category: "Аксессуары",
        price: 2800,
        tag: "ПОПУЛЯРНОЕ",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Фотоаппарат Retro",
        category: "Электроника",
        price: 12500,
        tag: "",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Минималистичные часы",
        category: "Аксессуары",
        price: 3400,
        tag: "",
        image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7,
        name: "Настольная лампа",
        category: "Дом",
        price: 2100,
        tag: "",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8,
        name: "Солнцезащитные очки",
        category: "Аксессуары",
        price: 1800,
        tag: "ТРЕНД",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
    }
];

let cart = [];
let activeCategory = "Все";

const productsContainer = document.getElementById("products");
const categoriesContainer = document.getElementById("categories");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const productCount = document.getElementById("productCount");

function formatPrice(price) {
    return new Intl.NumberFormat("ru-RU").format(price) + " сом";
}

// Отображение каталога
function renderProducts() {
    const searchText = searchInput.value
        .trim()
        .toLowerCase();

    const filteredProducts = productsData.filter(product => {
        const matchesCategory =
            activeCategory === "Все" ||
            product.category === activeCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(searchText) ||
            product.category.toLowerCase().includes(searchText);

        return matchesCategory && matchesSearch;
    });

    productCount.textContent =
        `Найдено: ${filteredProducts.length}`;

    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = `
            <div class="empty-state">
                <h3>Товары не найдены</h3>
                <p>Попробуйте изменить запрос или выбрать другую категорию.</p>
            </div>
        `;
        return;
    }

    productsContainer.innerHTML = filteredProducts.map(product => `
        <article class="product-card">
            <div class="product-image">
                ${product.tag
                    ? `<span class="product-tag">${product.tag}</span>`
                    : ""
                }
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >
            </div>

            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-name">${product.name}</h3>

                <div class="product-bottom">
                    <span class="product-price">
                        ${formatPrice(product.price)}
                    </span>

                    <button
                        class="add-button"
                        data-add="${product.id}"
                        aria-label="Добавить ${product.name} в корзину"
                        title="Добавить в корзину"
                    >+</button>
                </div>
            </div>
        </article>
    `).join("");
}

// Переключение категорий
categoriesContainer.addEventListener("click", event => {
    const button = event.target.closest(".category");

    if (!button) return;

    activeCategory = button.dataset.category;

    document.querySelectorAll(".category").forEach(category => {
        category.classList.toggle(
            "active",
            category === button
        );
    });

    renderProducts();
});

// Добавление товара в корзину
productsContainer.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");

    if (!button) return;

    addToCart(Number(button.dataset.add));
});

function addToCart(productId) {
    const product = productsData.find(item => item.id === productId);

    if (!product) return;

    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    renderCart();
}

// Изменение количества и удаление товаров
cartItems.addEventListener("click", event => {
    const button = event.target.closest("button");

    if (!button) return;

    const productId = Number(button.dataset.id);

    if (button.dataset.action === "increase") {
        changeQuantity(productId, 1);
    }

    if (button.dataset.action === "decrease") {
        changeQuantity(productId, -1);
    }

    if (button.dataset.action === "remove") {
        cart = cart.filter(item => item.id !== productId);
        renderCart();
    }
});

function changeQuantity(productId, amount) {
    const item = cart.find(product => product.id === productId);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== productId);
    }

    renderCart();
}

// Обновление корзины
function renderCart() {
    const totalQuantity = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = formatPrice(totalPrice);

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <p style="font-size: 38px;">🛒</p>
                <h3>Корзина пока пуста</h3>
                <p>Добавьте товары из каталога.</p>
            </div>
        `;
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">

            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>${formatPrice(item.price * item.quantity)}</p>

                <div class="quantity">
                    <button
                        data-action="decrease"
                        data-id="${item.id}"
                        aria-label="Уменьшить количество"
                    >−</button>

                    <span>${item.quantity}</span>

                    <button
                        data-action="increase"
                        data-id="${item.id}"
                        aria-label="Увеличить количество"
                    >+</button>
                </div>
            </div>

            <button
                class="remove-button"
                data-action="remove"
                data-id="${item.id}"
                aria-label="Удалить товар"
                title="Удалить"
            >✕</button>
        </div>
    `).join("");
}

// Открытие и закрытие корзины
function openCart() {
    cartPanel.classList.add("open");
    overlay.classList.add("visible");
    document.body.style.overflow = "hidden";
}

function closeCart() {
    cartPanel.classList.remove("open");
    overlay.classList.remove("visible");
    document.body.style.overflow = "";
}

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeCart();
    }
});

// Поиск товаров
searchInput.addEventListener("input", renderProducts);
searchButton.addEventListener("click", renderProducts);

searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        renderProducts();
        document.getElementById("catalog").scrollIntoView({
            behavior: "smooth"
        });
    }
});

// Демонстрационное оформление заказа
document.getElementById("checkoutButton").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Ваша корзина пуста. Добавьте товары перед оформлением заказа.");
        return;
    }

    const orderSummary = cart
        .map(item => `${item.name} — ${item.quantity} шт.`)
        .join("\n");

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    alert(
        "Ваш заказ:\n\n" +
        orderSummary +
        "\n\nИтого: " + formatPrice(total) +
        "\n\nЭто демонстрация. Для реального заказа нужно подключить сервер."
    );
});

// Первый запуск
renderProducts();
renderCart();
