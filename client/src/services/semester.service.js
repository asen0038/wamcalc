import http from "../http-common";
import authHeader from "./auth-header";
class SemesterDataService {

    getAll(username) {
        return http.get(`/semester/all/${username}`, { headers: authHeader() });
    }

    get(id) {
        return http.get(`/semester/${id}`, { headers: authHeader() });
    }

    create(data, username) {
        return http.post(`/semester/${username}`, data, { headers: authHeader() });
    }

    update(id, data) {
        return http.put(`/semester/${id}`, data, { headers: authHeader() });
    }

    delete(id) {
        return http.delete(`/semester/${id}`, { headers: authHeader() });
    }
}
export default new SemesterDataService();