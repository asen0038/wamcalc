import http from "../http-common";
import authHeader from "./auth-header";

class WAMDataService {

    getAll(username) {
        return http.get(`/wam/all/${username}`, { headers: authHeader() });
    }

    update(id, data) {
        return http.put(`/wam/${id}`, data, { headers: authHeader() });
    }

    delete(id) {
        return http.delete(`/wam/${id}`, { headers: authHeader() });
    }
}
export default new WAMDataService();