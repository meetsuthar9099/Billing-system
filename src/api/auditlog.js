import axios from "axios";
// import { buildQuery } from '../exports/queryStringBuilder'

export default {
  // optionally filter by uer
  async fetch({ page, user_id,limit, type, date_from, date_to }) {
    return axios.get(`/logs?page=${page ? page : 1}&limit=${limit ? limit : '10'}&date_from=${date_from ? date_from : ''}&date_to=${date_to ? date_to : ''}&user_id=${user_id ? user_id :''}&type=${type ? type : ''} `)
  },
  async users() {
    return axios.get("/users");
  },
  async logTypes() {
    return axios.get("/logTypes");
  },
  async types() {
    const path = `auditlogs/audit_types`;
    return await axios.get(path);
  },
  async delete(id) {
    return await axios.delete(`auditlogs/${id}`);
  },
};
