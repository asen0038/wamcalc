import http from "../http-common";
import authHeader from "./auth-header";
class AssessmentDataService {

    getAll(uos_id) {
        return http.get(`/assessment/all/${uos_id}`, { headers: authHeader() });
    }

    get(id) {
        return http.get(`/assessment/${id}`, { headers: authHeader() });
    }

    create(data, uos_id) {
        return http.post(`/assessment/${uos_id}`, data, { headers: authHeader() });
    }

    createMark(data, uos_id) {
        return http.post(`/assessment/mark/${uos_id}`, data, { headers: authHeader() });
    }

    update(data, id) {
        return http.put(`/assessment/${id}`, data, { headers: authHeader() });
    }

    delete(id) {
        return http.delete(`/assessment/${id}`, { headers: authHeader() });
    }
}
export default new AssessmentDataService();