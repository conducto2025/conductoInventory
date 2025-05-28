import axios from 'axios';

const API_BASE = 'https://conbackend222.onrender.com';

export const requestOtp = (email, password) => {
  return axios.post(`${API_BASE}/api/admin/login/request-otp`, { email, password },
    {
        headers : {
                      'apikey' : 310424
        }
    }
  );
};

export const verifyOtp = (email, otp) => {
  return axios.post(`${API_BASE}/api/admin/login/verify-otp`, { email, otp },
    {
        headers : {
                      'apikey' : 310424
        }
    }
  );
};
