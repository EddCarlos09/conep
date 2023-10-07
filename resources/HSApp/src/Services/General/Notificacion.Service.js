import http from "../../Http/Http-processcommon";

class NotificacionDataService {
    async getAll(email, limite = 0) {
        return await http.get(`/notificacion/get_all/${email}/${limite}`);
    }
    async getAllTable( search = '', page = 1, rows = 4) {
        return await http.get(`/Notificacion/GetNotificacionesTbl?search=${search}&page=${page}&rows=${rows}`);
    }
    async getTotalRecords(search) {
        return await http.get(`/Notificacion/GetTotalRecords?search=${search}`);
    }
    async destroy(email, proyecto_ley_id){
        return await http.delete(`/notificacion/${email}/${proyecto_ley_id}`);
    }
}
export default new NotificacionDataService();
