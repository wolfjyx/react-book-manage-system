
import {HashRouter} from 'react-router-dom';

export default function request (context, method, url, body) {
    method = method.toUpperCase();
    if (method === 'GET') {
        body = undefined;
    } else {
        body = body && JSON.stringify(body);
    }

    return fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Token': sessionStorage.getItem('access_token') || ''
        },
        body
    })
        .then((res) => {
            if (res.status === 401) {
                console.log(context)
                context.router.history.push('/login');
                return Promise.reject('Unauthorized.');
            } else {
                const token = res.headers.get('access-token');
                if (token) {
                    sessionStorage.setItem('access_token', token);
                }
                return res.json();
            }
        })
        .catch(err => console.log(err))
}

export const get = (context,url) => request(context,'GET', url);
export const post = (context, url, body) => request(context,'POST', url, body);
export const put = (context, url, body) => request(context, 'PUT', url, body);
export const del = (context, url, body) => request(context, 'DELETE', url, body);
