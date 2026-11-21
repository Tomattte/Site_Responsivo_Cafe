
async function fetchData(apiUrl) {
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(
        `Erro na requisição: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Erro ao buscar os dados:", error);
    throw error;
  }
}

let globalCoffeeData = [];
let cartIsOpen = false;

const apiEndpoint = "http://localhost:3000/coffee";

fetchData(apiEndpoint)
  .then((data) => {
    console.log("Dados obtidos da API:", data);
    globalCoffeeData = data;
    atualizaRoot(globalCoffeeData);
  })
  .catch((error) => {
    console.error("Erro durante a obtenção dos dados:", error);
  });

// Cria os cards dos cafés
function createCard(data) {
  const root = document.getElementById("root");

  const colDiv = document.createElement("div");
  colDiv.className = "col-12 col-sm-6 col-md-4 col-lg-3 mb-4";

  const card = document.createElement("div");
  card.className = "card h-100 shadow-sm";

  if (data.image) {
    const image = document.createElement("img");
    image.src = data.image;
    image.alt = data.title;
    image.className = "card-img-top";
    card.appendChild(image);
  }

  const cardBody = document.createElement("div");
  cardBody.className = "card-body d-flex flex-column";

  const title = document.createElement("h3");
  title.textContent = data.title;
  title.className = "card-title h5 fw-bold";
  cardBody.appendChild(title);

  const description = document.createElement("p");
  description.textContent = data.description;
  description.className = "card-text text-muted mb-3";
  cardBody.appendChild(description);

  if (data.ingredients && data.ingredients.length > 0) {
    const ingredientsTitle = document.createElement("h4");
    ingredientsTitle.textContent = "Ingredients:";
    ingredientsTitle.className = "h6 fw-semibold mt-2 mb-2";
    cardBody.appendChild(ingredientsTitle);

    const ingredientsList = document.createElement("ul");
    ingredientsList.className = "list-group list-group-flush mb-3";

    data.ingredients.forEach((ingredient) => {
      const ingredientItem = document.createElement("li");
      ingredientItem.textContent = ingredient;
      ingredientItem.className =
        "list-group-item px-0 py-1 border-0 small";

      ingredientsList.appendChild(ingredientItem);
    });

    cardBody.appendChild(ingredientsList);
  }

  card.appendChild(cardBody);

  if (data.price !== undefined && data.price !== null) {
    const purchaseFooter = document.createElement("div");

    purchaseFooter.className =
      "card-footer text-white d-flex justify-content-between align-items-center";

    purchaseFooter.style = "background-color: #5E3023 !important";

    const footerTitle = document.createElement("h6");
    footerTitle.textContent = "R$ " + Number(data.price).toFixed(2);
    footerTitle.className = "fw-semibold m-0";

    purchaseFooter.appendChild(footerTitle);

    const buttonGroup = document.createElement("div");
    buttonGroup.className = "d-flex align-items-center gap-2";

    const cartStorage =
      JSON.parse(localStorage.getItem("shopCart")) || [];

    const amountInCart = cartStorage.filter(
      item => item.id === data.id
    ).length;

    if (amountInCart > 0) {
      const cartMinusButton = document.createElement("button");

      cartMinusButton.className =
        "btn btn-outline-light p-2 border-0 text-decoration-none d-flex align-items-center";

      cartMinusButton.title = "Remover do carrinho";

      cartMinusButton.onclick = () => {
        removeFromCart(data);
      };

      const cartIcon = document.createElement("span");
      cartIcon.className = "material-symbols-outlined";
      cartIcon.textContent = "remove_shopping_cart";

      cartMinusButton.appendChild(cartIcon);
      buttonGroup.appendChild(cartMinusButton);

      const badgeCount = document.createElement("span");
      badgeCount.className = "small fw-bold text-white px-1";
      badgeCount.textContent = amountInCart;

      buttonGroup.appendChild(badgeCount);
    }

    const cartPlusButton = document.createElement("button");

    cartPlusButton.className =
      "btn btn-outline-light p-2 border-0 text-decoration-none d-flex align-items-center";

    cartPlusButton.title = "Adicionar ao carrinho";

    cartPlusButton.onclick = () => {
      addToCart(data);
    };

    const cartIcon = document.createElement("span");
    cartIcon.className = "material-symbols-outlined";
    cartIcon.textContent = "add_shopping_cart";

    cartPlusButton.appendChild(cartIcon);
    buttonGroup.appendChild(cartPlusButton);

    purchaseFooter.appendChild(buttonGroup);
    card.appendChild(purchaseFooter);
  }

  colDiv.appendChild(card);
  root.appendChild(colDiv);
}

// Atualiza a lista de produtos
function atualizaRoot(data) {
  const root = document.getElementById("root");

  cartIsOpen = false;
  root.innerHTML = "";

  for (let card of data) {
    createCard(card);
  }
}

// Adiciona produto ao carrinho
function addToCart(coffee) {
  let cart = JSON.parse(localStorage.getItem("shopCart")) || [];

  cart.push(coffee);

  localStorage.setItem("shopCart", JSON.stringify(cart));

  if (cartIsOpen) {
    createCart();
  } else {
    atualizaRoot(globalCoffeeData);
  }

  createNavbar();

  console.log("Produto adicionado:", coffee.title);
}

// Remove uma unidade do produto
function removeFromCart(coffee) {
  let cart = JSON.parse(localStorage.getItem("shopCart")) || [];

  const index = cart.findIndex(
    item => item.id === coffee.id
  );

  if (index !== -1) {
    cart.splice(index, 1);
  }

  localStorage.setItem("shopCart", JSON.stringify(cart));

  if (cartIsOpen) {
    createCart();
  } else {
    atualizaRoot(globalCoffeeData);
  }

  createNavbar();

  console.log("Produto removido:", coffee.title);
}

// Cria a tela do carrinho
function createCart() {
  const root = document.getElementById("root");

  cartIsOpen = true;
  root.innerHTML = "";

  const cart = JSON.parse(localStorage.getItem("shopCart")) || [];

  const title = document.createElement("h2");
  title.className = "col-12 mb-4";
  title.textContent = "Meu Carrinho";

  root.appendChild(title);

  if (cart.length === 0) {
    const empty = document.createElement("p");
    empty.className = "col-12 text-muted";
    empty.textContent = "Seu carrinho está vazio.";

    root.appendChild(empty);

    createBackButton(root);
    return;
  }

  // Agrupa produtos iguais
  const groupedCart = [];

  cart.forEach(coffee => {
    const existing = groupedCart.find(
      item => item.id === coffee.id
    );

    if (existing) {
      existing.quantity++;
    } else {
      groupedCart.push({
        ...coffee,
        quantity: 1
      });
    }
  });

  let total = 0;

  groupedCart.forEach(coffee => {
    const subtotal = Number(coffee.price) * coffee.quantity;
    total += subtotal;

    const item = document.createElement("div");
    item.className = "col-12 mb-3";

    const card = document.createElement("div");
    card.className = "card shadow-sm";

    const body = document.createElement("div");
    body.className =
      "card-body d-flex justify-content-between align-items-center flex-wrap gap-3";

    const information = document.createElement("div");

    const name = document.createElement("h5");
    name.textContent = coffee.title;

    const quantity = document.createElement("p");
    quantity.className = "mb-1";
    quantity.textContent = "Quantidade: " + coffee.quantity;

    const price = document.createElement("p");
    price.className = "mb-0 text-muted";
    price.textContent =
      "Preço unitário: R$ " + Number(coffee.price).toFixed(2);

    information.appendChild(name);
    information.appendChild(quantity);
    information.appendChild(price);

    const actions = document.createElement("div");

    const subtotalText = document.createElement("strong");
    subtotalText.textContent = "R$ " + subtotal.toFixed(2);

    const removeButton = document.createElement("button");
    removeButton.className = "btn btn-danger btn-sm ms-3";
    removeButton.textContent = "Remover 1";

    removeButton.onclick = () => {
      removeFromCart(coffee);
    };

    actions.appendChild(subtotalText);
    actions.appendChild(removeButton);

    body.appendChild(information);
    body.appendChild(actions);

    card.appendChild(body);
    item.appendChild(card);

    root.appendChild(item);
  });

  // Exibe o valor total
  const totalArea = document.createElement("div");
  totalArea.className = "col-12 text-end mt-3";

  const totalText = document.createElement("h3");
  totalText.textContent = "Total: R$ " + total.toFixed(2);

  totalArea.appendChild(totalText);
  root.appendChild(totalArea);

  createBackButton(root);
}

// Botão para voltar à lista de cafés
function createBackButton(root) {
  const button = document.createElement("button");

  button.className = "btn btn-secondary mt-3";
  button.textContent = "Voltar aos cafés";

  button.onclick = () => {
    atualizaRoot(globalCoffeeData);
  };

  root.appendChild(button);
}

// Cria a barra de navegação
function createNavbar() {
  const nav = document.createElement("nav");

  nav.className = "navbar navbar-light bg-light shadow-sm mb-4";
  nav.style = "background-color: #C08552 !important";

  const container = document.createElement("div");

  container.className =
    "container d-flex justify-content-between align-items-center px-3";

  // Logo
  const cafeLogo = document.createElement("span");

  cafeLogo.className = "material-symbols-outlined me-2 lh-1";
  cafeLogo.textContent = "coffee";

  const siteLink = document.createElement("a");

  siteLink.className =
    "navbar-brand fw-bold fs-4 d-flex align-items-center text-white text-decoration-none m-0";

  siteLink.href = "index.html";

  siteLink.appendChild(cafeLogo);

  const textNode = document.createTextNode("Barões do Café");

  siteLink.appendChild(textNode);
  container.appendChild(siteLink);

  // Carrinho
  const cartStorage =
    JSON.parse(localStorage.getItem("shopCart")) || [];

  const totalItemsInCart = cartStorage.length;

  const cartButton = document.createElement("button");

  cartButton.className =
    "btn btn-outline-light position-relative d-flex align-items-center border-0";

  cartButton.title = "Ver Carrinho";

  cartButton.onclick = () => {
    createCart();
  };

  const cartIcon = document.createElement("span");

  cartIcon.className = "material-symbols-outlined fs-3";
  cartIcon.textContent = "shopping_cart";

  cartButton.appendChild(cartIcon);

  if (totalItemsInCart > 0) {
    const badgeCount = document.createElement("span");

    badgeCount.className =
      "position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger";

    badgeCount.textContent = totalItemsInCart;

    cartButton.appendChild(badgeCount);
  }

  container.appendChild(cartButton);
  nav.appendChild(container);

  const oldNav = document.querySelector("nav.navbar");

  if (oldNav) {
    oldNav.remove();
  }

  document.body.prepend(nav);
}

// Inicializa a barra de navegação
createNavbar();
