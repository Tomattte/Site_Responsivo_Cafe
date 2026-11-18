async function fetchData(apiUrl) {
  try {
    // Faz a requisição à API
    const response = await fetch(apiUrl);

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      throw new Error(
        `Erro na requisição: ${response.status} - ${response.statusText}`
      );
    }

    // Converte os dados para JSON
    const data = await response.json();

    // Retorna os dados obtidos
    return data;
  } catch (error) {
    // Exibe erros no console
    console.error("Erro ao buscar os dados:", error);
    throw error; // Propaga o erro para ser tratado posteriormente
  }
}

let globalCoffeeData = [];

const apiEndpoint = "http://localhost:3000/coffee"; // Substitua pelo URL da API desejada

fetchData(apiEndpoint)
  .then((data) => {
    console.log("Dados obtidos da API:", data);
    globalCoffeeData = data;
    atualizaRoot(globalCoffeeData);
  })
  .catch((error) => {
    console.error("Erro durante a obtenção dos dados:", error);
  });

// Função para criar os cards dos cafés
function createCard(data) {
  // Seleciona a div com id "root"
  const root = document.getElementById("root");

  // Cria a coluna responsiva (col-lg-3 garante exatamente 4 cards por linha em telas grandes)
  const colDiv = document.createElement("div");
  colDiv.className = "col-12 col-sm-6 col-md-4 col-lg-3 mb-4";

  // Cria a div principal do card
  const card = document.createElement("div");
  card.className = "card h-100 shadow-sm"; // h-100 garante que todos tenham a mesma altura na linha

  // Adiciona a imagem
  if (data.image) {
    const image = document.createElement("img");
    image.src = data.image;
    image.alt = data.title;
    image.className = "card-img-top";
    card.appendChild(image);
  }

  // Cria o corpo do card
  const cardBody = document.createElement("div");
  cardBody.className = "card-body d-flex flex-column";

  // Adiciona o título
  const title = document.createElement("h3");
  title.textContent = data.title;
  title.className = "card-title h5 fw-bold";
  cardBody.appendChild(title);

  // Adiciona a descrição
  const description = document.createElement("p");
  description.textContent = data.description;
  description.className = "card-text text-muted mb-3";
  cardBody.appendChild(description);

  // Adiciona a lista de ingredientes
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
      ingredientItem.className = "list-group-item px-0 py-1 border-0 small";
      ingredientsList.appendChild(ingredientItem);
    });

    cardBody.appendChild(ingredientsList);
  }

  // Adiciona o corpo dentro do card
  card.appendChild(cardBody);

  if (data.price) {
    const purchaseFooter = document.createElement("div");
    purchaseFooter.className = "card-footer text-white d-flex justify-content-between align-items-center";
    purchaseFooter.style = 'background-color: #5E3023 !important';

    const footerTitle = document.createElement("h6");
    footerTitle.textContent = "R$ " + data.price.toFixed(2);
    footerTitle.className = "fw-semibold m-0";
    purchaseFooter.appendChild(footerTitle);

    const buttonGroup = document.createElement("div");
    buttonGroup.className = "d-flex align-items-center gap-2";

    const cartStorage = JSON.parse(localStorage.getItem("shopCart")) || [];
    const ammountInCart = cartStorage.filter(item => item.title === data.title).length;

    if (ammountInCart > 0) {
      const cartMinusButton = document.createElement("button");
      cartMinusButton.className = "btn btn-outline-light p-2 border-0 text-decoration-none d-flex align-items-center";
      cartMinusButton.title = "Remover do carrinho";
      cartMinusButton.onclick = () => {
        removeFromCart(data);
      };
    
      const cartIcon = document.createElement("span");
      cartIcon.className = "material-symbols-outlined";
      cartIcon.textContent = "remove_shopping_cart";
      cartMinusButton.appendChild(cartIcon);

      buttonGroup.appendChild(cartMinusButton);

      // Quantidade da bebida no carrinho atualmente
      const badgeCount = document.createElement("span");
      badgeCount.className = "small fw-bold text-white px-1";
      badgeCount.textContent = ammountInCart;
      buttonGroup.appendChild(badgeCount);
    }

    const cartPlusButton = document.createElement("button");
    cartPlusButton.className = "btn btn-outline-light p-2 border-0 text-decoration-none d-flex align-items-center";
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

  // Coloca o card dentro da coluna responsiva
  colDiv.appendChild(card);
  // Adiciona a coluna à div root
  root.appendChild(colDiv);
}

function atualizaRoot(data) {
  const root = document.getElementById("root");
  root.innerHTML = "";

  for (let card of data) {
    createCard(card);
  }
}

function addToCart(coffee) {
  let cart = JSON.parse(localStorage.getItem("shopCart")) || [];
  cart.push(coffee);

  localStorage.setItem('shopCart', JSON.stringify(cart));

  atualizaRoot(globalCoffeeData);
  
  console.log(`"${coffee.title}" foi adicionado ao carrinho!`, cart);
}

function removeFromCart(coffee) {
  let cart = JSON.parse(localStorage.getItem("shopCart")) || [];
  
  const index = cart.findIndex(item => item.title === coffee.title);
  if (index !== -1) {
    cart.splice(index, 1);
  }

  localStorage.setItem("shopCart", JSON.stringify(cart));

  atualizaRoot(globalCoffeeData);
  
  console.log(`"${coffee.title}" foi removido do carrinho!`, cart);
}

//ARIELARIELARIELARIELARIEL

function createCart() {
  const root = document.getElementById("root");
  root.innerHTML = "";

}

//ARIELARIELARIELARIELARIEL

function createNavbar() {
  const nav = document.createElement("nav");
  nav.className = "navbar navbar-light bg-light shadow-sm mb-4";
  nav.style = 'background-color: #C08552 !important';

  const container = document.createElement("div");
  container.className = "container d-flex justify-content-between align-items-center px-3";

  //Esquerda da Navbar

  const cafeLogo = document.createElement("span");
  cafeLogo.className = "material-symbols-outlined me-2 lh-1";
  cafeLogo.textContent = "coffee";

  const siteLink = document.createElement("a");
  siteLink.className = "navbar-brand fw-bold fs-4 d-flex align-items-center text-white text-decoration-none m-0";
  siteLink.href = "index.html";

  siteLink.appendChild(cafeLogo);

  const textNode = document.createTextNode("Barões do Café");
  siteLink.appendChild(textNode);
  container.appendChild(siteLink);

  //Direita da Navbar

  const cartStorage = JSON.parse(localStorage.getItem("shopCart")) || [];
  const totalItemsInCart = cartStorage.length; // Quantidade total de cafés no carrinho

  const cartButton = document.createElement("button");
  // ms-auto empurra este elemento totalmente para a direita
  cartButton.className = "btn btn-outline-light position-relative d-flex align-items-center border-0";
  cartButton.title = "Ver Carrinho";
  
  // Ação ao clicar no botão do carrinho (pode redirecionar para a página do carrinho futuramente)
  cartButton.onclick = () => {
    console.log("Abrir carrinho, itens atuais:", cartStorage);
    alert(`Você tem ${totalItemsInCart} item(ns) no carrinho.`);
  };

  const cartIcon = document.createElement("span");
  cartIcon.className = "material-symbols-outlined fs-3";
  cartIcon.textContent = "shopping_cart";
  cartButton.appendChild(cartIcon);

  // Badge de contagem (apenas exibe se houver mais de 0 itens)
  if (totalItemsInCart > 0) {
    const badgeCount = document.createElement("span");
    // Classes do Bootstrap para criar uma badge vermelha flutuante no canto do ícone
    badgeCount.className = "position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger";
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

createNavbar();