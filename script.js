// ================================
// سبد خرید
// ================================

let cart = JSON.parse(localStorage.getItem("myCart")) || [];


// ================================
// آدرس Google Apps Script
// ================================

const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycby7XNIJ2upcuL9Dl4OEfdgLIwaiHUEXXYxr4lL1CpgvIxJU2jGM2iJ7k9wvqKCPGXEtkA/exec";


// ================================
// ذخیره سبد خرید
// ================================

function saveCart() {
  localStorage.setItem("myCart", JSON.stringify(cart));
}


// ================================
// تبدیل عدد به فارسی
// ================================

function persianNumber(number) {
  return Number(number).toLocaleString("fa-IR");
}


// ================================
// نمایش سبد خرید
// ================================

function updateCart() {

  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  cartItems.innerHTML = "";

  let total = 0;
  let count = 0;


  if (cart.length === 0) {

    cartItems.innerHTML =
      '<p style="text-align:center;color:#777;">سبد خرید شما خالی است.</p>';

  }


  cart.forEach((item, index) => {

    total += item.price * item.quantity;

    count += item.quantity;


    const div = document.createElement("div");

    div.className = "cart-item";

    div.innerHTML = `
      <div class="cart-item-name">
        ${item.name}
      </div>

      <div class="cart-item-price">
        ${persianNumber(item.price)} تومان
      </div>

      <div class="quantity-controls">

        <button onclick="increaseQuantity(${index})">
          +
        </button>

        <strong>
          ${persianNumber(item.quantity)}
        </strong>

        <button onclick="decreaseQuantity(${index})">
          −
        </button>

      </div>

      <button
        class="remove-item"
        onclick="removeItem(${index})"
      >
        حذف محصول
      </button>
    `;

    cartItems.appendChild(div);

  });


  cartCount.textContent = persianNumber(count);

  cartTotal.textContent =
    persianNumber(total) + " تومان";
}


// ================================
// اضافه کردن محصول
// ================================

document.querySelectorAll(".add-to-cart").forEach(button => {

  button.addEventListener("click", () => {

    const name = button.dataset.name;

    const price = Number(button.dataset.price);


    const existingItem = cart.find(
      item => item.name === name
    );


    if (existingItem) {

      existingItem.quantity++;

    } else {

      cart.push({
        name: name,
        price: price,
        quantity: 1
      });

    }


    saveCart();

    updateCart();


    const cartPanel =
      document.getElementById("cartPanel");

    cartPanel.classList.add("open");


    alert("محصول به سبد خرید اضافه شد 🛒");

  });

});


// ================================
// افزایش تعداد
// ================================

function increaseQuantity(index) {

  cart[index].quantity++;

  saveCart();

  updateCart();
}


// ================================
// کاهش تعداد
// ================================

function decreaseQuantity(index) {

  if (cart[index].quantity > 1) {

    cart[index].quantity--;

  } else {

    cart.splice(index, 1);

  }

  saveCart();

  updateCart();
}


// ================================
// حذف محصول
// ================================

function removeItem(index) {

  cart.splice(index, 1);

  saveCart();

  updateCart();
}


// ================================
// باز کردن سبد
// ================================

document
  .getElementById("cartButton")
  .addEventListener("click", () => {

    document
      .getElementById("cartPanel")
      .classList.toggle("open");

  });


// ================================
// بستن سبد
// ================================

document
  .getElementById("closeCart")
  .addEventListener("click", () => {

    document
      .getElementById("cartPanel")
      .classList.remove("open");

  });


// ================================
// ثبت سفارش
// ================================

document
  .getElementById("submitOrder")
  .addEventListener("click", async () => {

    const name =
      document
        .getElementById("customerName")
        .value
        .trim();

    const phone =
      document
        .getElementById("customerPhone")
        .value
        .trim();

    const address =
      document
        .getElementById("customerAddress")
        .value
        .trim();


    // بررسی سبد

    if (cart.length === 0) {

      alert("سبد خرید شما خالی است 🛒");

      return;
    }


    // بررسی نام

    if (name === "") {

      alert("لطفاً نام خود را وارد کنید.");

      return;
    }


    // بررسی شماره

    if (phone === "") {

      alert("لطفاً شماره تماس خود را وارد کنید.");

      return;
    }


    // بررسی آدرس

    if (address === "") {

      alert("لطفاً آدرس خود را وارد کنید.");

      return;
    }


    // محاسبه مبلغ

    let total = 0;

    cart.forEach(item => {

      total += item.price * item.quantity;

    });


    // اطلاعات سفارش

    const orderData = {

      name: name,

      phone: phone,

      address: address,

      total: total,

      items: cart

    };


    const submitButton =
      document.getElementById("submitOrder");


    submitButton.disabled = true;

    submitButton.textContent =
      "در حال ارسال سفارش...";


    try {

      await fetch(WEB_APP_URL, {

        method: "POST",

        mode: "no-cors",

        headers: {
          "Content-Type":
            "text/plain;charset=utf-8"
        },

        body: JSON.stringify(orderData)

      });


      alert(
        "سفارش شما ثبت شد 🎉\n\n" +
        "اطلاعات سفارش برای گالری ارسال شد."
      );


      // خالی کردن سبد

      cart = [];

      saveCart();

      updateCart();


      // خالی کردن فرم

      document
        .getElementById("customerName")
        .value = "";

      document
        .getElementById("customerPhone")
        .value = "";

      document
        .getElementById("customerAddress")
        .value = "";


    } catch (error) {

      console.error(error);

      alert(
        "در ارسال سفارش مشکلی پیش آمد. لطفاً دوباره امتحان کنید."
      );

    }


    submitButton.disabled = false;

    submitButton.textContent =
      "ثبت سفارش";

  });


// ================================
// اجرای اولیه
// ================================

updateCart();
