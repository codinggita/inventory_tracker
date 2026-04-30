const categories = ['Electronics', 'Home Appliances', 'Clothing', 'Sports', 'Gaming'];
const brands = {
  Electronics: ['Apple', 'Samsung', 'Google', 'Sony', 'Dell'],
  'Home Appliances': ['LG', 'Samsung', 'Whirlpool', 'Dyson', 'Panasonic'],
  Clothing: ['Nike', 'Adidas', 'Uniqlo', 'Zara', 'North Face'],
  Sports: ['Wilson', 'Decathlon', 'Yonex', 'Puma', 'Spalding'],
  Gaming: ['Razer', 'Logitech', 'Asus', 'Alienware', 'SteelSeries']
};

const productModels = {
  Electronics: ['iPhone 15 Pro', 'Galaxy S24 Ultra', 'Pixel 8 Pro', 'MacBook Air M3', 'Sony WH-1000XM5'],
  'Home Appliances': ['Smart Inverter Fridge', 'Active-Clean Dishwasher', 'V15 Detect Vacuum', 'TurboWash 360', 'Panasonic Nanoe Hair Dryer'],
  Clothing: ['Tech-Fit Training Tee', 'Performance Windbreaker', 'Ultra Light Down Vest', 'Merino Wool Hoodie', 'Dry-Ex Crew Neck'],
  Sports: ['Pro Staff 97 Tennis Racket', 'Kipsta FG Soccer Boots', 'Nanoray 10 Badminton Racket', 'NBA Official Basketball', 'Velocity Running Shoes'],
  Gaming: ['DeathAdder V3 Pro', 'G502 X Plus', 'ROG Swift 360Hz', 'Aurora R15 Desktop', 'Apex Pro TKL']
};

const categoryImages = {
  Electronics: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
    'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&q=80',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80',
    'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
  ],
  'Home Appliances': [
    'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&q=80',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&q=80',
  ],
  Clothing: [
    'https://images.unsplash.com/photo-1503341338985-94577a9dbb01?w=400&q=80',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&q=80',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
    'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?w=400&q=80',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80',
  ],
  Sports: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80',
    'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?w=400&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  ],
  Gaming: [
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80',
    'https://images.unsplash.com/photo-1593640408182-31c228ac77e3?w=400&q=80',
    'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&q=80',
    'https://images.unsplash.com/photo-1603481546579-65d935ba9cdd?w=400&q=80',
    'https://images.unsplash.com/photo-1585620385456-4759f9b5c7d9?w=400&q=80',
  ],
};

const generateProducts = () => {
  const products = [];
  let idCounter = 1;
  for (let i = 0; i < 50; i++) {
    const category = categories[i % categories.length];
    const categoryBrands = brands[category];
    const categoryModels = productModels[category];
    
    const brand = categoryBrands[i % categoryBrands.length];
    const model = categoryModels[i % categoryModels.length];
    const name = `${model}`;

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

const products = generateProducts();

const stores = [
  { id: 1, name: 'Apex Digital Hub - Gandhinagar', lat: 23.2323, lng: 72.4848 },
  { id: 2, name: 'Elite Electronics Center', lat: 23.2350, lng: 72.4900 },
  { id: 3, name: 'Metro Digital Mart', lat: 23.2400, lng: 72.5000 },
  { id: 4, name: 'Prime Appliances Plaza', lat: 23.2200, lng: 72.4700 },
  { id: 5, name: 'Nexus Tech Lounge', lat: 23.2300, lng: 72.4800 },
];

const generateInventory = () => {
  const inv = [];
  const storeSpecialties = {
    1: ['Electronics', 'Gaming'],
    2: ['Electronics', 'Home Appliances'],
    3: ['Clothing', 'Sports'],
    4: ['Home Appliances', 'Gaming'],
    5: ['Gaming', 'Clothing', 'Sports']
  };

  products.forEach(p => {
    const specialistStores = stores.filter(s => storeSpecialties[s.id].includes(p.category));
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

const inventory = generateInventory();

module.exports = { products, stores, inventory };
