const categories = ['Electronics', 'Home Appliances', 'Clothing', 'Sports', 'Gaming'];
const brands = ['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'Asus', 'Dell', 'LG', 'Logitech', 'Bose'];
const adjs = ['Pro', 'Max', 'Ultra', 'Plus', 'Lite', 'Smart', 'Elite', 'Premium', 'Essential', 'Advanced'];

// Category-specific Unsplash image pools (fixed seeds for consistency)
const categoryImages = {
  Electronics: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80', // smartphone
    'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&q=80', // phone back
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80', // phone flat
    'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&q=80', // laptop
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80', // laptop open
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80', // macbook
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80', // headphones
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&q=80', // headphones on white
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80', // earbuds
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', // watch
  ],
  'Home Appliances': [
    'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&q=80', // microwave
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80', // fridge
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80', // washing machine
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', // blender
    'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&q=80', // coffee maker
    'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=400&q=80', // iron
    'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&q=80', // kettle
    'https://images.unsplash.com/photo-1631390083899-4a7c842aa15a?w=400&q=80', // vacuum
    'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&q=80', // air purifier
    'https://images.unsplash.com/photo-1589816176769-af3d8acef8a0?w=400&q=80', // dishwasher
  ],
  Clothing: [
    'https://images.unsplash.com/photo-1503341338985-94577a9dbb01?w=400&q=80', // t-shirt
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&q=80', // t-shirt folded
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80', // white shirt
    'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?w=400&q=80', // hoodie
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80', // jacket
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80', // jeans
    'https://images.unsplash.com/photo-1594938298603-c8148c4b4f3f?w=400&q=80', // shorts
    'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80', // sweatshirt
    'https://images.unsplash.com/photo-1580657018950-c7f7d09a1942?w=400&q=80', // dress shirt
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80', // coat
  ],
  Sports: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', // running shoes
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80', // sneakers
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80', // white sneakers
    'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?w=400&q=80', // sports shoes
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', // gym equipment
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80', // dumbbell
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80', // yoga mat
    'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&q=80', // sports jersey
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80', // cycling
    'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=400&q=80', // football
  ],
  Gaming: [
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80', // gaming mouse
    'https://images.unsplash.com/photo-1593640408182-31c228ac77e3?w=400&q=80', // gaming setup
    'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&q=80', // gaming keyboard
    'https://images.unsplash.com/photo-1603481546579-65d935ba9cdd?w=400&q=80', // controller
    'https://images.unsplash.com/photo-1585620385456-4759f9b5c7d9?w=400&q=80', // gaming headset
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80', // monitor gaming
    'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=400&q=80', // joystick
    'https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?w=400&q=80', // console
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&q=80', // gaming chair
    'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400&q=80', // gaming pc
  ],
};

const generateProducts = () => {
  const products = [];
  let idCounter = 1;
  for (let i = 0; i < 100; i++) {
    const category = categories[i % categories.length];
    const brand = brands[i % brands.length];
    const adj = adjs[i % adjs.length];
    let name = '';
    
    if (category === 'Electronics') name = `${brand} Smartphone ${adj} ${i}`;
    if (category === 'Home Appliances') name = `${brand} Microwave ${adj}`;
    if (category === 'Clothing') name = `${brand} T-Shirt ${adj}`;
    if (category === 'Sports') name = `${brand} Running Shoes ${adj}`;
    if (category === 'Gaming') name = `${brand} Gaming Mouse ${adj}`;

    // Pick a category-specific image that cycles through the pool
    const imgPool = categoryImages[category];
    const image = imgPool[i % imgPool.length];

    products.push({
      id: idCounter++,
      name,
      category,
      brand,
      price: Math.floor(Math.random() * 900) + 99,
      rating: (Math.random() * 2 + 3).toFixed(1),
      image,
    });
  }
  return products;
};

export const products = generateProducts();

export const stores = [
  { id: 1, name: 'Kalol Electronics Hub', lat: 23.2323, lng: 72.4848 },
  { id: 2, name: 'University Gadget Store', lat: 23.2350, lng: 72.4900 },
  { id: 3, name: 'Gujarat Digital Mart', lat: 23.2400, lng: 72.5000 },
  { id: 4, name: 'Ahmedabad Highway Appliances', lat: 23.2200, lng: 72.4700 },
  { id: 5, name: 'Swaminarayan Tech Point', lat: 23.2300, lng: 72.4800 },
];

const generateInventory = () => {
  const inv = [];
  
  // Mapping of which stores specialize in which categories
  // Store 1: Kalol Electronics Hub -> Electronics, Gaming
  // Store 2: University Gadget Store -> Electronics, Home Appliances
  // Store 3: Gujarat Digital Mart -> Clothing, Sports
  // Store 4: Ahmedabad Highway Appliances -> Home Appliances, Gaming
  // Store 5: Swaminarayan Tech Point -> Gaming, Clothing, Sports

  const storeSpecialties = {
    1: ['Electronics', 'Gaming'],
    2: ['Electronics', 'Home Appliances'],
    3: ['Clothing', 'Sports'],
    4: ['Home Appliances', 'Gaming'],
    5: ['Gaming', 'Clothing', 'Sports']
  };

  products.forEach(p => {
    // Find stores that specialize in this product's category
    const specialistStores = stores.filter(s => storeSpecialties[s.id].includes(p.category));
    
    // Each product available in 1-2 stores from its specialty list
    const numStores = Math.floor(Math.random() * 2) + 1;
    const selectedStores = [...specialistStores].sort(() => 0.5 - Math.random()).slice(0, numStores);
    
    selectedStores.forEach(store => {
      inv.push({
        productId: p.id,
        storeId: store.id,
        stock: Math.floor(Math.random() * 20) + 1,
      });
    });
  });
  return inv;
};


export const inventory = generateInventory();

export const reservations = [];

export const analytics = {
  searchVolume: [], // Will be populated dynamically
  reservationStats: {
    completed: 45,
    expired: 12,
    active: 5
  },
  popularProducts: [],
  lostDemand: [] // Products searched but out of stock
};

export const searchHistory = [];
