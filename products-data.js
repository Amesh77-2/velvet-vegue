/* ══════════════════════════════════
   VÈLO — products-data.js
   Shared product store (localStorage)
══════════════════════════════════ */

const VELO_KEY = 'velo_products_v1';
const VELO_IMAGE_VERSION_KEY = 'velo_product_images_v2';
const VELO_CATALOG_VERSION_KEY = 'velo_catalog_v2';

const VELO_DEFAULT_PRODUCTS = [
  {
    id: 'p1', name: 'Silk Wrap Dress', category: 'Dresses', material: 'Mulberry Silk',
    price: 890, oldPrice: null, badgeType: 'new', badgeLabel: 'New', isNew: true,
    img: './assets/products/silk-wrap-dress.png',
    imgAlt: './assets/products/silk-wrap-dress.png',
    colors: ['#C9A89A', '#1C1C1C', '#F7F3EE'], sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'p2', name: 'Tailored Wool Coat', category: 'Outerwear', material: 'Virgin Wool',
    price: 1480, oldPrice: null, badgeType: 'limited', badgeLabel: 'Limited', isNew: false,
    img: './assets/products/tailored-wool-coat.png',
    imgAlt: './assets/products/tailored-wool-coat.png',
    colors: ['#1C1C1C', '#C4A882'], sizes: ['XS', 'S', 'M']
  },
  {
    id: 'p3', name: 'Ribbed Cashmere Top', category: 'Tops', material: '100% Cashmere',
    price: 420, oldPrice: 560, badgeType: 'sale', badgeLabel: '−25%', isNew: false,
    img: './assets/products/ribbed-cashmere-top.png',
    imgAlt: './assets/products/ribbed-cashmere-top.png',
    colors: ['#C4A882', '#1C1C1C', '#F7F3EE', '#9AAABF'], sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    id: 'p4', name: 'Wide Linen Trouser', category: 'Trousers', material: 'Belgian Linen',
    price: 338, oldPrice: 450, badgeType: 'none', badgeLabel: '', isNew: false,
    img: './assets/products/wide-linen-trouser.png',
    imgAlt: './assets/products/wide-linen-trouser.png',
    colors: ['#8A9E88', '#D9B8A8'], sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'p5', name: 'Satin Midi Skirt', category: 'Skirts', material: 'Duchess Satin',
    price: 580, oldPrice: null, badgeType: 'new', badgeLabel: 'New', isNew: true,
    img: './assets/products/satin-midi-skirt.png',
    imgAlt: './assets/products/satin-midi-skirt.png',
    colors: ['#A0432A', '#1C1C1C'], sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'p6', name: 'Leather Tote Bag', category: 'Accessories', material: 'Full-Grain Leather',
    price: 1150, oldPrice: null, badgeType: 'limited', badgeLabel: 'Exclusive', isNew: false,
    img: './assets/products/leather-tote-bag.png',
    imgAlt: './assets/products/leather-tote-bag.png',
    colors: ['#4E3A2E', '#C4A882', '#1C1C1C'], sizes: ['One Size']
  },
  {
    id: 'p7', name: 'Oversized Linen Blazer', category: 'Outerwear', material: 'Washed Linen',
    price: 760, oldPrice: 950, badgeType: 'none', badgeLabel: '', isNew: false,
    img: './assets/products/oversized-linen-blazer.png',
    imgAlt: './assets/products/oversized-linen-blazer.png',
    colors: ['#8A9E88', '#D9B8A8', '#1C1C1C'], sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'p8', name: 'Draped Jersey Maxi', category: 'Dresses', material: 'Viscose Jersey',
    price: 650, oldPrice: null, badgeType: 'new', badgeLabel: 'New', isNew: true,
    img: './assets/products/draped-jersey-maxi.png',
    imgAlt: './assets/products/draped-jersey-maxi.png',
    colors: ['#1C1C1C', '#A0432A'], sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'p9', name: 'Silk Camisole', category: 'Tops', material: 'Pure Silk',
    price: 280, oldPrice: 400, badgeType: 'sale', badgeLabel: '−30%', isNew: false,
    img: './assets/products/silk-camisole.png',
    imgAlt: './assets/products/silk-camisole.png',
    colors: ['#F7F3EE', '#C9A89A', '#1C1C1C'], sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'p10', name: 'Ivory Pleated Column Gown', category: 'Dresses', material: 'Pleated Silk Crêpe',
    price: 1290, oldPrice: null, badgeType: 'new', badgeLabel: 'New', isNew: true,
    img: './assets/products/ivory-pleated-column-gown.png',
    imgAlt: './assets/products/ivory-pleated-column-gown.png',
    colors: ['#F4EFE5', '#C8B79F', '#1C1C1C'], sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'p11', name: 'Noir Velvet Evening Gown', category: 'Dresses', material: 'Silk Velvet',
    price: 1580, oldPrice: null, badgeType: 'limited', badgeLabel: 'Atelier Exclusive', isNew: true,
    img: './assets/products/noir-velvet-evening-gown.png',
    imgAlt: './assets/products/noir-velvet-evening-gown.png',
    colors: ['#0E0D0C', '#4E2431', '#203026'], sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'p12', name: 'Sage Halter Maxi Dress', category: 'Dresses', material: 'Linen–Silk',
    price: 940, oldPrice: null, badgeType: 'new', badgeLabel: 'New', isNew: true,
    img: './assets/products/sage-halter-maxi-dress.png',
    imgAlt: './assets/products/sage-halter-maxi-dress.png',
    colors: ['#9AA287', '#E8DED0', '#B78972'], sizes: ['XS', 'S', 'M', 'L', 'XL']
  }
];

function veloGetProducts() {
  const raw = localStorage.getItem(VELO_KEY);
  if (!raw) {
    veloSaveProducts(VELO_DEFAULT_PRODUCTS);
    return VELO_DEFAULT_PRODUCTS.slice();
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return VELO_DEFAULT_PRODUCTS.slice();
    // Remove catalogue entries withdrawn by the latest rollback.
    let removedWithdrawnProduct = false;
    for (let index = parsed.length - 1; index >= 0; index -= 1) {
      if (['p13', 'p14', 'p15'].includes(parsed[index].id)) {
        parsed.splice(index, 1);
        removedWithdrawnProduct = true;
      }
    }
    if (removedWithdrawnProduct) veloSaveProducts(parsed);
    // Preserve customer/admin changes while adding new catalogue releases once.
    if (!localStorage.getItem(VELO_CATALOG_VERSION_KEY)) {
      const existingIds = new Set(parsed.map(product => product.id));
      VELO_DEFAULT_PRODUCTS.forEach(product => {
        if (!existingIds.has(product.id)) parsed.push(Object.assign({}, product));
      });
      veloSaveProducts(parsed);
      localStorage.setItem(VELO_CATALOG_VERSION_KEY, '1');
    }
    if (!localStorage.getItem(VELO_IMAGE_VERSION_KEY)) {
      parsed.forEach(product => {
        const updatedDefault = VELO_DEFAULT_PRODUCTS.find(item => item.id === product.id);
        if (updatedDefault) { product.img = updatedDefault.img; product.imgAlt = updatedDefault.imgAlt; }
      });
      veloSaveProducts(parsed);
      localStorage.setItem(VELO_IMAGE_VERSION_KEY, '1');
    }
    return parsed;
  } catch (e) {
    return VELO_DEFAULT_PRODUCTS.slice();
  }
}

function veloSaveProducts(products) {
  localStorage.setItem(VELO_KEY, JSON.stringify(products));
}

function veloAddProduct(product) {
  const products = veloGetProducts();
  product.id = 'p' + Date.now();
  products.push(product);
  veloSaveProducts(products);
  return product;
}

function veloUpdateProduct(id, updates) {
  const products = veloGetProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return null;
  products[idx] = Object.assign({}, products[idx], updates);
  veloSaveProducts(products);
  return products[idx];
}

function veloDeleteProduct(id) {
  const products = veloGetProducts().filter(p => p.id !== id);
  veloSaveProducts(products);
}

function veloResetProducts() {
  veloSaveProducts(VELO_DEFAULT_PRODUCTS);
}

function veloFormatPrice(n) {
  return '$' + Number(n).toLocaleString();
}

function veloBadgeClass(type) {
  if (type === 'new') return 'badge-new';
  if (type === 'sale') return 'badge-sale';
  if (type === 'limited') return 'badge-ltd';
  return '';
}
