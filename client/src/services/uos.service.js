import http from "../http-common";
import authHeader from "./auth-header";
class UOSDataService {
  getAll(sem_id) {
    return http.get(`/uos/all/${sem_id}`, { headers: authHeader() });
  }

  get(id) {
    return http.get(`/uos/${id}`, { headers: authHeader() });
  }

  create(data, sem_id) {
    return http.post(`/uos/${sem_id}`, data, { headers: authHeader() });
  }

  update(id, data) {
    return http.put(`/uos/${id}`, data, { headers: authHeader() });
  }
  
  delete(id) {
    return http.delete(`/uos/${id}`, { headers: authHeader() });
  }
}
export default new UOSDataService();
