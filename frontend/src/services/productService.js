import BASE_URL from './apiConfig';

const productService = {
  getAllProducts: async (params = {}) => {
    const url = new URL(`${BASE_URL}/products`);
    if (params.q) url.searchParams.append('q', params.q);
    
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  },
  
  getProductById: async (id) => {
    const res = await fetch(`${BASE_URL}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const products = await res.json();
    const product = products.find(p => p.id === parseInt(id));
    if (!product) throw new Error('Product not found');
    return product;
  },
  
  searchProducts: async (query, location) => {
    const url = new URL(`${BASE_URL}/products`);
    if (query) url.searchParams.append('q', query);
    if (location && location.lat && location.lng) {
      url.searchParams.append('lat', location.lat);
      url.searchParams.append('lng', location.lng);
    }
    
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to search products');
    return await res.json();
  },
  
  getProductStores: async (productId, location) => {
    const url = new URL(`${BASE_URL}/inventory`);
    url.searchParams.append('productId', productId);
    if (location && location.lat && location.lng) {
      url.searchParams.append('lat', location.lat);
      url.searchParams.append('lng', location.lng);
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch inventory');
    return await res.json();
  },
  
  updateStock: async (productId, storeId, stock) => {
    const res = await fetch(`${BASE_URL}/admin/inventory/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, storeId, stock })
    });
    if (!res.ok) throw new Error('Failed to update stock');
    return await res.json();
  }
};

export default productService;
