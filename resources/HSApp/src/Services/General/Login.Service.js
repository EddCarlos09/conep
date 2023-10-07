import http from "../../Http/Http-processcommon";

class LoginDataService {
    async create(data) {
        return await http.post(`/login`, data);
    }
}

export default new LoginDataService();
