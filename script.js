 var cart = []; // Array untuk menyimpan produk yang sudah dipesan
        var totalPrice = 0; // Total harga belanjaan

        // Fungsi untuk menambahkan item ke keranjang
        function addToCart(productName, price, quantity) {
            var itemExists = false;
            // Cari apakah produk sudah ada di keranjang
            cart.forEach(function(item) {
                if (item.productName === productName) {
                    item.quantity += quantity;
                    itemExists = true;
                }
            });

            // Jika produk belum ada di keranjang, tambahkan sebagai item baru
            if (!itemExists) {
                cart.push({
                    productName: productName,
                    price: price,
                    quantity: quantity
                });
            }

            // Hitung total harga belanjaan
            calculateTotal();
            // Perbarui tampilan keranjang
            displayCart();
        }

        // Fungsi untuk menghitung total harga belanjaan
        function calculateTotal() {
            totalPrice = 0;
            cart.forEach(function(item) {
                totalPrice += item.price * item.quantity;
            });
        }

        // Fungsi untuk menampilkan isi keranjang belanja
        function displayCart() {
            var cartItemsElement = document.getElementById("cartItems");
            cartItemsElement.innerHTML = "";

            cart.forEach(function(item) {
                var listItem = document.createElement("li");
                listItem.classList.add("cart-item");

                var itemDetails = document.createElement("div");
                itemDetails.classList.add("cart-item-details");

                var itemName = document.createElement("span");
                itemName.textContent = `${item.productName} x${item.quantity}`;
                itemDetails.appendChild(itemName);

                var itemPrice = document.createElement("span");
                itemPrice.textContent = `SATUAN: Rp ${item.price.toLocaleString()} x ${item.quantity} ( Rp ${(item.price * item.quantity).toLocaleString()} )`;
                itemPrice.classList.add("cart-item-price");
                itemDetails.appendChild(itemPrice);

                var itemActions = document.createElement("div");
                itemActions.classList.add("cart-item-actions");

                var reduceButton = document.createElement("button");
                reduceButton.textContent = "Kurangi";
                reduceButton.classList.add("reduce-btn");
                reduceButton.addEventListener("click", function() {
                    reduceCartItem(item.productName);
                });
                itemActions.appendChild(reduceButton);

                var removeButton = document.createElement("button");
                removeButton.textContent = "Hapus";
                removeButton.classList.add("remove-btn");
                removeButton.addEventListener("click", function() {
                    removeCartItem(item.productName);
                });
                itemActions.appendChild(removeButton);

                itemDetails.appendChild(itemActions);
                listItem.appendChild(itemDetails);

                cartItemsElement.appendChild(listItem);
            });

            // Tampilkan total harga belanjaan
            var cartTotalElement = document.getElementById("cartTotal");
            cartTotalElement.textContent = `Rp ${totalPrice.toLocaleString()}`;
        }

        // Fungsi untuk mengurangi jumlah produk dalam keranjang
        function reduceCartItem(productName) {
            cart.forEach(function(item, index) {
                if (item.productName === productName) {
                    item.quantity--;
                    if (item.quantity === 0) {
                        cart.splice(index, 1); // Hapus item jika jumlahnya menjadi 0
                    }
                }
            });
            // Hitung ulang total harga belanjaan dan tampilkan kembali keranjang
            calculateTotal();
            displayCart();
        }

        // Fungsi untuk menghapus produk dari keranjang
        function removeCartItem(productName) {
            cart = cart.filter(function(item) {
                return item.productName !== productName;
            });
            // Hitung ulang total harga belanjaan dan tampilkan kembali keranjang
            calculateTotal();
            displayCart();
        }

        // Menangani tombol "Add to Cart" di setiap produk
        var addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
        addToCartButtons.forEach(function(button, index) {
            button.addEventListener("click", function() {
                var productElement = this.closest(".product");
                var productName = productElement.querySelector("img").alt;
                var productPriceText = productElement.querySelector(".product-price").textContent;
                var productPrice = parseInt(productPriceText.replace("Rp ", "").replace(".", "").replace(",", ""));
                var quantity = parseInt(productElement.querySelector(".quantity-selector").value);

                // Tambahkan produk ke keranjang
                addToCart(productName, productPrice, quantity);
            });
        });

        // Fungsi untuk menampilkan konten setelah login
        function showStoreContent() {
            document.body.classList.add("retail-background");
            document.getElementById("loginPanel").style.display = "none";
            document.getElementById("storeContent").classList.add("show");
            document.getElementById("cart").style.display = "block"; // Tampilkan keranjang belanja setelah login
        }

        // Menangani submit form login
        document.getElementById("loginForm").addEventListener("submit", function(event) {
            event.preventDefault();
            var username = document.getElementById("username").value;
            var password = document.getElementById("password").value;

            // Periksa apakah username dan password sesuai
            if (username === "VdinsGames" && password === "AGUS") {
                // Tampilkan konten toko setelah login berhasil
                showStoreContent();
            } else {
                // Tampilkan pesan error dan tutup jendela setelah 2 detik
                document.getElementById("errorMessage").innerText = "Username atau password salah. Pecundang!";
                setTimeout(function() {
                    window.close();
                }, 2000);
            }
        });

        // Fungsi untuk mengirimkan total belanja ke WhatsApp
        function sendToWhatsApp() {
            var message = `Halo, saya ingin memesan barang sebagai berikut:\n`;
            cart.forEach(function(item) {
                message += `${item.productName} x${item.quantity} SATUAN: Rp ${item.price.toLocaleString()} x ${item.quantity} ( Rp ${(item.price * item.quantity).toLocaleString()} )\n`;
            });
            message += `\nTotal: Rp ${totalPrice.toLocaleString()}\n\nTerima kasih.`;
            var phoneNumber = "+6283895152817";
            var url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

            // Buka halaman WhatsApp dengan pesan yang sudah diisi
            window.open(url, '_blank');
        }
