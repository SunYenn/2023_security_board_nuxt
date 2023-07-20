import axios from 'axios';
import { getCookie } from '@/utils/cookie'

export function setHeader() {

    const token = getCookie('token');

    if (token != null) {
        axios.defaults.headers.common['accesstoken'] = token;
        return token;
    } else {
        window.location.href = 'http://' + window.location.host
    }

}