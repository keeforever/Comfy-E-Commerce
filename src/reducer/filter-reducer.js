import { UPDATE_FILTER, SET_PRODUCTS, SORT_PRODUCTS } from "../actions";

let filtered_products = [];

const filterReducer = (state, { type, payload }) => {
  if (type === SET_PRODUCTS) {
    const products = payload;

    if (!products) {
      return { ...state };
    }

    // catogories in products
    let categories = { all: "all" };
    products.forEach(({ category }) => {
      categories[category] = category;
    });
    categories = Object.values(categories);

    // companies in products
    let companies = { all: "all" };
    products.forEach(({ company }) => {
      companies[company] = company;
    });
    companies = Object.values(companies);

    // colors in products
    let colors = {};
    products.forEach(({ colors: colorsArr }) => {
      colorsArr.forEach((color) => {
        colors[color] = color;
      });
    });
    colors = Object.values(colors);

    // min,max price of products
    const minPrice = products.reduce((final, { price }) => {
      return Math.min(final, price);
    }, Infinity);
    const maxPrice = products.reduce((final, { price }) => {
      return Math.max(final, price);
    }, -Infinity);

    const filter = {
      categories,
      companies,
      colors,
      minPrice,
      maxPrice,
    };
    const priceRange = filter.maxPrice;
    return {
      ...state,
      products,
      filtered_products: products,
      filter,
      isReady: true,
      priceRange,
    };
  }

  if (type === UPDATE_FILTER) {
    const filtered_products = state.products
      .filter(({ name }) => {
        const searchQuery = payload.searchQuery || state.searchQuery;
        if (searchQuery === "") return true;
        return name.startsWith(searchQuery);
      })
      .filter(({ category }) => {
        const _category = payload.category || state.category;
        if (_category === "all") return true;
        return _category === category;
      })
      .filter(({ company }) => {
        const _company = payload.company || state.company;
        if (_company === "all") return true;
        return _company === company;
      })
      .filter(({ colors }) => {
        const color = payload.color || state.color;
        if (color === "all") return true;
        return colors.includes(color);
      });
    return {
      ...state,
      filtered_products,
      ...payload,
    };
  }

  if (type === SORT_PRODUCTS) {
    return { ...state };
  }
  throw new Error("Action type - mis-matched." + type);
};

export default filterReducer;
