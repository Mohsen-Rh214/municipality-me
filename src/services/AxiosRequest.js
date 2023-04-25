import axios from "axios";
import { BASE_URL_MAYADIN } from '../configs/constants.js';
import { getToken } from './../utils/SessionStorage';

const mayadinAx = axios.create();
const withoutAuth = axios.create();

mayadinAx.defaults.baseURL = BASE_URL_MAYADIN
withoutAuth.defaults.baseURL = BASE_URL_MAYADIN

mayadinAx.interceptors.request.use(
    async config => {
        console.log('interceptors request url is', config.url);
        try {
            const token = getToken("token");
            if (!config.headers.Authorization) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (err) {

        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)


export { withoutAuth, mayadinAx }