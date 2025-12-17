import axios from 'axios';
import qs from "qs";

export const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        const clientKey = import.meta.env.VITE_CLIENT_KEY;
        if (clientKey) {
            config.headers['X-Client-Key'] = clientKey;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const apiService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },
    signup: async (email, password) => {
        const response = await api.post('/auth/signup', { email, password });
        return response.data;
    },
    getGenres: async () => {
        const response = await api.get('/filters/genres');
        return response.data;
    },
    getFormats: async () => {
        const response = await api.get('/filters/formats');
        return response.data;
    },
    getYears: async () => {
        const response = await api.get('/filters/years');
        return response.data;
    },
    getShowDetails: async (tconst) => {
        const response = await api.get(`/show-details/${tconst}`);
        return response.data;
    },
    logTitleClick: async (tconst) => {
        await api.post(`/titles/${tconst}/click`);
    },
    getCards: async (filters, page = 0, size = 20) => {
        const response = await api.get('/filters/cards', {
            params: {
                page,
                size,
                search: filters.search || null,
                year: filters.year !== 'any' ? Number(filters.year) : null,
                format: filters.format !== 'any' ? filters.format : null,
                sortBy: filters.sortBy && filters.sortBy !== 'POPULARITY' ? filters.sortBy : null,
                ...(filters.genres && filters.genres.length > 0 ? { genres: filters.genres } : {})
            },
            paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
        });
        return response.data;
    },
    getWatchlistEntry: async (titleId) => {
        const response = await api.get('/watchlist/entry', { params: { titleId } });
        return response.data;
    },
    getWatchlist: async () => {
        const response = await api.get('/watchlist');
        return response.data;
    },
    updateWatchlist: async (titleId, category) => {
        const response = await api.post(`/watchlist/${titleId}`, { category });
        return response.data;
    },
    getSliderContent: async () => {
        const response = await api.get('/slider-content');
        return response.data;
    },
    getTrendingTitles: async () => {
        const response = await api.get('/homepage/trending');
        return response.data;
    },
    getRecentlyAddedTitles: async () => {
        const response = await api.get('/homepage/recently-added');
        return response.data;
    },
    getAdminTitles: async (filters, page = 0, itemsPerPage = 12) => {
        const params = {
            page: page,
            size: itemsPerPage,
            search: filters.search || null,
            sortBy: filters.sortBy,
            genres: filters.genres,
            year: filters.year === 'any' ? null : filters.year,
            format: filters.format === 'any' ? null : filters.format,
        };
        const response = await api.get('/admin/titles', {
            params,
            paramsSerializer: p => qs.stringify(p, { arrayFormat: 'repeat' })
        });
        return response.data;
    },
    addTitle: async (payload) => {
        const response = await api.post('/admin/titles', payload);
        return response.data;
    },
    updateTitle: async (tconst, payload) => {
        const response = await api.put(`/admin/titles/${tconst}`, payload);
        return response.data;
    },
    deleteTitle: async (tconst) => {
        await api.delete(`/admin/titles/${tconst}`);
    },
    updateTitleActors: async (tconst, actors) => {
        const response = await api.put(`/admin/titles/${tconst}/actors`, actors);
        return response.data;
    },
    findActors: async (search = '', page = 0, size = 15) => {
        const params = new URLSearchParams({ page, size });
        if (search) {
            params.append('search', search);
        }
        const response = await api.get(`/admin/actors?${params.toString()}`);
        return response.data;
    },
    addActor: async (actorData) => {
        const response = await api.post('/admin/actors', actorData);
        return response.data;
    },
    updateActor: async (nconst, actorData) => {
        const response = await api.put(`/admin/actors/${nconst}`, actorData);
        return response.data;
    },
    getAdminActorDetails: async (nconst) => {
        const response = await api.get(`/admin/actors/${nconst}`);
        return response.data;
    },
    deleteActor: async (nconst) => {
        await api.delete(`/admin/actors/${nconst}`);
    },

    getAdminUsers: async (page = 0, size = 10, emailSearch = '') => {
        const params = new URLSearchParams({ page, size });
        if (emailSearch) {
            params.append('emailSearch', emailSearch);
        }
        const response = await api.get(`/admin/users?${params.toString()}`);
        return response.data;
    },
    getAdminUserDetails: async (userId) => {
        const response = await api.get(`/admin/users/${userId}`);
        return response.data;
    },
    getAdminUserWatchlist: async (userId) => {
        const response = await api.get(`/admin/users/${userId}/watchlist`);
        return response.data;
    },
    updateAdminUserRole: async (userId, newRole) => {
        const response = await api.put(`/admin/users/${userId}/role`, { role: newRole });
        return response.data;
    },
    deleteAdminUser: async (userId) => {
        await api.delete(`/admin/users/${userId}`);
    }
};

export default apiService;