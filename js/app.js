document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const modal = document.getElementById('product-modal');
    const modalClose = document.getElementById('modal-close');
    const modalContent = document.getElementById('modal-content');

    // Fetch Data
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            renderProducts(data);
        })
        .catch(err => {
            console.error('Error fetching data:', err);
            productGrid.innerHTML = '<p class="text-center col-span-full text-red-800">Unable to load products. Please try again later.</p>';
        });

    function renderProducts(products) {
        productGrid.innerHTML = products.map(product => `
            <div class="product-card bg-white rounded-lg overflow-hidden shadow-md cursor-pointer border-b-4 border-transparent hover:border-yellow-500 group"
                 onclick="openModal('${product.id}')">
                <div class="relative overflow-hidden aspect-[3/4]">
                    <img src="${product.imageUrl}" alt="${product.title}" 
                         class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                </div>
                <div class="p-4">
                    <p class="text-xs text-red-800 uppercase tracking-widest mb-1 font-bold">${product.category}</p>
                    <h3 class="font-serif text-lg font-bold text-gray-900 leading-tight mb-2">${product.title}</h3>
                    <p class="text-yellow-600 font-bold">${product.price}</p>
                </div>
            </div>
        `).join('');

        // Attach data to window for modal access
        window.productsData = products;
    }

    // Modular Modal Function
    window.openModal = (id) => {
        const product = window.productsData.find(p => p.id === id);
        if (!product) return;

        const message = encodeURIComponent(`Hi, I am interested in buying: ${product.title} (ID: ${product.id}). Is it available?`);
        const messengerLink = `https://m.me/bongonarisharee?text=${message}`;

        // Populate Modal
        document.getElementById('modal-img').src = product.imageUrl;
        document.getElementById('modal-title').innerText = product.title;
        document.getElementById('modal-category').innerText = product.category;
        document.getElementById('modal-price').innerText = product.price;
        document.getElementById('modal-desc').innerText = product.description;

        const fbBtn = document.getElementById('modal-fb-btn');
        fbBtn.href = product.facebookPostUrl;

        const buyBtn = document.getElementById('modal-buy-btn');
        buyBtn.href = messengerLink;

        // Show Modal
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.classList.add('modal-open');
    };

    function closeModal() {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.classList.remove('modal-open');
    }

    modalClose.addEventListener('click', closeModal);

    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
});
