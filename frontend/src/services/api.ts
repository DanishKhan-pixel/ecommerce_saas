// Service stubs for future backend API integration
// Replace these functions with real API calls when backend is ready
import { apiClient } from "@/lib/axios";

export const productService = {
  getAll: async (params: { page?: number; category?: string; vendor?: string; min_price?: number; max_price?: number; ordering?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.category) query.set("category", params.category);
    if (params.vendor) query.set("vendor", params.vendor);
    if (params.min_price !== undefined) query.set("min_price", String(params.min_price));
    if (params.max_price !== undefined) query.set("max_price", String(params.max_price));
    if (params.ordering) query.set("ordering", params.ordering);
    
    // We also support 'q' for search from the search method, but for Shop we use these:
    const qs = query.toString();
    return apiClient.get(`/api/products/${qs ? "?" + qs : ""}`);
  },
  getBySlug: async (slug: string) => apiClient.get(`/api/products/${slug}/`),
  getFeatured: async () => apiClient.get("/api/homepage/products/featured/"),
  getNewArrivals: async () => apiClient.get("/api/homepage/products/new-arrivals/"),
  search: async (query: string) => apiClient.get(`/api/products/?q=${encodeURIComponent(query)}`),
  create: async (_data: unknown) => {
    /* TODO: POST /api/products */
  },
  update: async (_id: string, _data: unknown) => {
    /* TODO: PUT /api/products/:id */
  },
  delete: async (_id: string) => {
    /* TODO: DELETE /api/products/:id */
  },
};

export const addressService = {
  list: async () => apiClient.get("/api/addresses/"),
  getById: async (id: number) => apiClient.get(`/api/addresses/${id}/get/`),
  create: async (data: {
    full_name: string;
    phone: string;
    address_line: string;
    city: string;
    state: string;
    country: string;
    is_default?: boolean;
  }) => apiClient.post("/api/addresses/create/", data),
  update: async (id: number, data: Record<string, string | boolean>) => apiClient.patch(`/api/addresses/${id}/update/`, data),
  delete: async (id: number) => apiClient.delete(`/api/addresses/${id}/delete/`),
};

export const orderService = {
  getAll: async (page = 1) => apiClient.get(`/api/orders/?page=${page}`),
  getById: async (id: string | number) => apiClient.get(`/api/orders/${id}/`),
  create: async () => apiClient.post("/api/orders/create/")
};

export const paymentService = {
  initialize: async (orderIds: number[], callbackUrl?: string) => 
    apiClient.post("/api/payments/initialize/", { order_ids: orderIds, callback_url: callbackUrl }),
  verify: async (reference: string) => 
    apiClient.post("/api/payments/verify/", { reference }),
};

export const vendorService = {
  getDashboard: async () => apiClient.get("/api/vendors/dashboard/"),
  getRecentOrders: async () => apiClient.get("/api/vendors/dashboard/recent-orders/"),
  // Apply to become a vendor — POST /api/vendors/apply/
  apply: async (formData: FormData) => {
    return apiClient.post("/api/vendors/apply/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  // Fetch the authenticated user's store — GET /api/vendors/my-store/
  myStore: async () => {
    return apiClient.get("/api/vendors/my-store/");
  },
  // Update the authenticated user's store — PATCH /api/vendors/my-store/update/
  updateStore: async (formData: FormData) => {
    return apiClient.patch("/api/vendors/my-store/update/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getAll: async () => apiClient.get("/api/vendors/"),
  getById: async (id: string) => apiClient.get(`/api/vendors/${id}/`),
  getFeatured: async () => apiClient.get("/api/vendors/featured/"),
};

export const authService = {
  login: async (email: string, password: string) => {
    return apiClient.post("/api/auth/login/", { email, password });
  },
  register: async (data: Record<string, unknown>) => {
    // Expected fields from register serializer: first_name, last_name, email, password
    return apiClient.post("/api/auth/register/", data);
  },
  me: async () => {
    return apiClient.get("/api/auth/me/");
  },
};

export const adminVendorService = {
  // GET /api/admin/vendors/?page=N&search=X
  getAll: async (params: { page?: number; search?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.search) query.set("search", params.search);
    const qs = query.toString();
    return apiClient.get(`/api/admin/vendors/${qs ? "?" + qs : ""}`);
  },
  // GET /api/admin/vendors/{id}/
  getById: async (id: number | string) =>
    apiClient.get(`/api/admin/vendors/${id}/`),
  // PATCH /api/admin/vendors/{id}/approve/
  approve: async (id: number | string) =>
    apiClient.patch(`/api/admin/vendors/${id}/approve/`),
  // PATCH /api/admin/vendors/{id}/reject/
  reject: async (id: number | string) =>
    apiClient.patch(`/api/admin/vendors/${id}/reject/`),
  // PATCH /api/admin/vendors/{id}/suspend/
  suspend: async (id: number | string) =>
    apiClient.patch(`/api/admin/vendors/${id}/suspend/`),
  // PATCH /api/admin/vendors/{id}/toggle-featured/
  toggleFeatured: async (id: number | string) =>
    apiClient.patch(`/api/admin/vendors/${id}/toggle-featured/`),
};

export const categoryService = {
  getAll: async () => apiClient.get("/api/categories/"),
  getHomepage: async () => apiClient.get("/api/categories/homepage/"),
  getById: async (id: number | string) =>
    apiClient.get(`/api/categories/${id}/`),
  create: async (formData: FormData) => {
    return apiClient.post("/api/categories/create/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  update: async (id: number | string, formData: FormData) => {
    return apiClient.patch(`/api/categories/${id}/update/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  delete: async (id: number | string) =>
    apiClient.delete(`/api/categories/${id}/delete/`),
};

export const reviewService = {
  getByProduct: async (_productId: string) => {
    /* TODO: fetch /api/products/:id/reviews */
  },
  create: async (_data: unknown) => {
    /* TODO: POST /api/reviews */
  },
  update: async (_id: string, _data: unknown) => {
    /* TODO: PUT /api/reviews/:id */
  },
  delete: async (_id: string) => {
    /* TODO: DELETE /api/reviews/:id */
  },
};

export const adminProductService = {
  // GET /api/admin/products/?page=N&store_name=X&category=Y
  getAll: async (params: { page?: number; store_name?: string; category?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.store_name) query.set("store_name", params.store_name);
    if (params.category) query.set("category", params.category);
    const qs = query.toString();
    return apiClient.get(`/api/admin/products/${qs ? "?" + qs : ""}`);
  },
  // PATCH /api/admin/products/{id}/toggle-featured/
  toggleFeatured: async (id: number | string) =>
    apiClient.patch(`/api/admin/products/${id}/toggle-featured/`),
};

export const vendorProductService = {
  // GET /api/vendor/products/
  getAll: async () => apiClient.get("/api/vendor/products/"),
  
  // POST /api/vendor/products/create/
  create: async (formData: FormData) => {
    return apiClient.post("/api/vendor/products/create/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  
  // PATCH /api/vendor/products/{id}/update/
  update: async (id: number | string, formData: FormData) => {
    return apiClient.patch(`/api/vendor/products/${id}/update/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  
  // DELETE /api/vendor/products/{id}/delete/
  delete: async (id: number | string) =>
    apiClient.delete(`/api/vendor/products/${id}/delete/`),

  // GET /api/vendor/products/categories/
  getCategories: async () => apiClient.get("/api/vendor/products/categories/"),

  // POST /api/vendor/products/generate-description/
  generateDescription: async (title: string) => {
    return apiClient.post("/api/vendor/products/generate-description/", { title });
  },
};

export const vendorOrderService = {
  // GET /api/vendor/orders/?page=N&customer_name=X
  getAll: async (params: { page?: number; customer_name?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.customer_name) query.set("customer_name", params.customer_name);
    const qs = query.toString();
    return apiClient.get(`/api/vendor/orders/${qs ? "?" + qs : ""}`);
  },
  // GET /api/vendor/orders/{id}/
  getById: async (id: string | number) =>
    apiClient.get(`/api/vendor/orders/${id}/`),
  // PATCH /api/vendor/orders/{id}/update-status/
  updateStatus: async (id: string | number, status: string) =>
    apiClient.patch(`/api/vendor/orders/${id}/update-status/`, { status }),
};

export const cartService = {
  getCart: async () => apiClient.get("/api/cart/"),
  addToCart: async (productId: number | string, quantity: number = 1) => 
    apiClient.post("/api/cart/add/", { product_id: productId, quantity }),
  updateCartItem: async (itemId: number | string, quantity: number) => 
    apiClient.patch(`/api/cart/items/${itemId}/update/`, { quantity }),
  removeCartItem: async (itemId: number | string) => 
    apiClient.delete(`/api/cart/items/${itemId}/delete/`),
  clearCart: async () => apiClient.delete("/api/cart/clear/"),
  mergeCart: async (sessionId: string) => 
    apiClient.post("/api/cart/merge/", { session_id: sessionId }),
};

export const adminAnalyticsService = {
  getDashboardStats: async () => apiClient.get("/api/admin/dashboard-stats/"),
};
