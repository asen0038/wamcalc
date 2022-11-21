import http from "../http-common";
import authHeader from "./auth-header";
class FileService {

    upload(username, data,type,title) {
        return http.post(`/upload/${username}/${type}/${title}`, data, { headers: authHeader() });
    }
}
export default new FileService();