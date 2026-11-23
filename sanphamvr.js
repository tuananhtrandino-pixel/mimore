
let VR_PRODUCTS = [];
let selectedProduct = null;

const vr$ = id => document.getElementById(id);

const vrMoney = value =>
  new Intl.NumberFormat("vi-VN").format(Number(value) || 0) + "₫";

// TẢI DANH SÁCH SẢN PHẨM
async function loadVRProducts() {
  try {
    const response = await fetch("./products.json");

    if (!response.ok) {
      throw new Error("Không tải được dữ liệu sản phẩm.");
    }

    VR_PRODUCTS = await response.json();

    const select = vr$("vrProduct");

    select.innerHTML =
      '<option value="">Chọn sản phẩm muốn trải nghiệm</option>' +
      VR_PRODUCTS.map(product => `
        <option value="${product.id}">
          ${product.name}
        </option>
      `).join("");

  } catch (error) {
    console.error(error);
    vr$("vrProduct").innerHTML =
      '<option value="">Không tải được sản phẩm</option>';
  }
}

// LỌC DANH MỤC
vr$("vrCategory").addEventListener("change", function() {
  const category = this.value;

  const filtered = category
    ? VR_PRODUCTS.filter(p => p.category === category)
    : VR_PRODUCTS;

  vr$("vrProduct").innerHTML =
    '<option value="">Chọn sản phẩm</option>' +
    filtered.map(product => `
      <option value="${product.id}">
        ${product.name}
      </option>
    `).join("");

  selectedProduct = null;
  resetVRProduct();
});

// CHỌN SẢN PHẨM
vr$("vrProduct").addEventListener("change", function() {
  selectedProduct = VR_PRODUCTS.find(
    p => String(p.id) === String(this.value)
  );

  if (!selectedProduct) {
    resetVRProduct();
    return;
  }

  vr$("vrProductName").textContent = selectedProduct.name;
  vr$("vrProductCategory").textContent = selectedProduct.category;
  vr$("vrProductPrice").textContent = vrMoney(selectedProduct.price);

  vr$("vrProductDescription").textContent =
    selectedProduct.description || "Sản phẩm handmade độc đáo từ BOL.";

  const model = vr$("productModel");
  const placeholder = vr$("vrPlaceholder");

  if (selectedProduct.modelGlb) {
    model.src = selectedProduct.modelGlb;
    model.style.display = "block";
    placeholder.style.display = "none";
  } else {
    model.removeAttribute("src");
    model.style.display = "none";
    placeholder.style.display = "block";
    placeholder.querySelector("h3").textContent = selectedProduct.name;
    placeholder.querySelector("p").textContent =
      "Sản phẩm này chưa có mô hình 3D.";
  }
});

// CHỌN CHẾ ĐỘ 3D / AR / VR
vr$("vrMode").addEventListener("change", function() {
  const model = vr$("productModel");

  if (!selectedProduct) {
    alert("Vui lòng chọn sản phẩm trước.");
    this.value = "3d";
    return;
  }

  if (!selectedProduct.modelGlb) {
    alert("Sản phẩm này chưa có mô hình 3D để trải nghiệm.");
    this.value = "3d";
    return;
  }

  if (this.value === "ar") {
    if (model.canActivateAR) {
      model.activateAR();
    } else {
      alert("Thiết bị hoặc trình duyệt chưa hỗ trợ AR.");
    }
  }

  if (this.value === "vr") {
    alert("Chế độ VR không gian riêng sẽ được tích hợp khi có mô hình và môi trường VR tương thích.");
  }
});

// ĐẶT LẠI GÓC NHÌN
vr$("vrReset").addEventListener("click", function() {
  const model = vr$("productModel");

  if (model.src) {
    model.cameraOrbit = "auto auto auto";
    model.fieldOfView = "auto";
  }
});

// MUA SẢN PHẨM NGAY
vr$("vrBuyNow").addEventListener("click", function() {
  if (!selectedProduct) {
    alert("Vui lòng chọn sản phẩm trước khi mua.");
    return;
  }

  const quantity = Number(vr$("vrQuantity").value);

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    alert("Vui lòng chọn số lượng từ 1 đến 99.");
    return;
  }

  let cart = {};

  try {
    cart = JSON.parse(localStorage.getItem("bol-cart") || "{}");

    if (!cart || typeof cart !== "object" || Array.isArray(cart)) {
      cart = {};
    }
  } catch (error) {
    cart = {};
  }

  cart[selectedProduct.id] =
    (Number(cart[selectedProduct.id]) || 0) + quantity;

  localStorage.setItem("bol-cart", JSON.stringify(cart));

  window.location.href = "./cart.html";
});

// ĐẶT LẠI THÔNG TIN
function resetVRProduct() {
  vr$("vrProductName").textContent = "Chào mừng đến với BOL";
  vr$("vrProductCategory").textContent = "Sản phẩm handmade";
  vr$("vrProductPrice").textContent = "Hãy chọn một sản phẩm";

  vr$("vrProductDescription").textContent =
    "Mỗi món quà tại BOL đều mang một câu chuyện riêng.";

  vr$("productModel").removeAttribute("src");
  vr$("productModel").style.display = "none";
  vr$("vrPlaceholder").style.display = "block";
  vr$("vrPlaceholder").querySelector("h3").textContent =
    "Không gian trải nghiệm BOL";

  vr$("vrPlaceholder").querySelector("p").textContent =
    "Chọn một sản phẩm phía trên để bắt đầu khám phá.";
}

// KHỞI CHẠY
loadVRProducts();
