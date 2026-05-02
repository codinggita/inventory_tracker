import BASE_URL from './apiConfig';

const productService = {
  getAllProducts: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.q) queryParams.append('q', params.q);
    const queryString = queryParams.toString();
    const url = `${BASE_URL}/products${queryString ? `?${queryString}` : ''}`;
    
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
    const queryParams = new URLSearchParams();
    if (query) queryParams.append('q', query);
    if (location && location.lat && location.lng) {
      queryParams.append('lat', location.lat);
      queryParams.append('lng', location.lng);
    }
    const queryString = queryParams.toString();
    const url = `${BASE_URL}/products${queryString ? `?${queryString}` : ''}`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to search products');
    return await res.json();
  },
  
  getProductStores: async (productId, location) => {
    const queryParams = new URLSearchParams();
    queryParams.append('productId', productId);
    if (location && location.lat && location.lng) {
      queryParams.append('lat', location.lat);
      queryParams.append('lng', location.lng);
    }
    const queryString = queryParams.toString();
    const url = `${BASE_URL}/inventory${queryString ? `?${queryString}` : ''}`;

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
