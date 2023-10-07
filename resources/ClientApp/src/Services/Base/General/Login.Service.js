import http from "../../../Http/Http-processcommon";

class LoginDataService {
    async create(data) {
        return await http.post(`/login`, data);
    }
    async loginGetsucursales(data) {
        return await http.post(`/login/LoginGetsucursales`, data);
    }
}

export default new LoginDataService();
