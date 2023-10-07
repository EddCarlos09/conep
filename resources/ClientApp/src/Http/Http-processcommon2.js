import axios from "axios";
import AuthLogin from "../Utils/AuthLogin";

const auth = new AuthLogin();
let instance = axios.create({
     baseURL: 'http://localhost:8000/api',
    // baseURL: 'https://anepobservatorio.com/aservice/api',
    // baseURL: 'https://api.observatoriolegislativoconep.com/api',
    // baseURL: 'https://pruebasmorant.com.mx/clienteoit.pruebasmorant.com.mx/aservice/api',
    headers: {
        'Authorization': 'Bearer ' + auth.token(),
        'X-HTTP-Method-Override': 'PUT',
        'Content-Type': 'multipart/form-data'
    }
});

// Request interceptor for API calls
instance.interceptors.request.use(
    async config => {
        if(config.data){
            let data = ToFormData(config.data);
            config.data = data;
        }
        return config;
    },
    error => {
        Promise.reject(error);
});

function ToFormData (data){
    if(data instanceof FormData)
        return data;
    let formData = new FormData();
    Object.keys(data).forEach(key => {
        if (Array.isArray(data[key])) {
            let array = data[key];
            for (let i = 0; i < array.length; i++) {
                let obj = array[i];
                if (obj instanceof File) {
                    formData.append(`${key}[${i}]`, obj);
                }else{
                    for (let objKey in obj) {
                        if (obj[objKey] === null) {
                            obj[objKey] = "";
                        }
                        if (Array.isArray(obj[objKey])) {
                            let array2 = obj[objKey];
                            for (let ii = 0; ii < array2.length; ii++) {
                                let obj2 = array2[ii];
                                if (obj2 instanceof File) {
                                    formData.append(`${key}[${i}][${objKey}][${ii}]`, obj2);
                                }else{
                                    for (let objKey2 in obj2) {
                                        if (obj2[objKey2] === null) {
                                            obj2[objKey2] = "";
                                        }
                                        formData.append(`${key}[${i}][${objKey}][${ii}][${objKey2}]`, obj2[objKey2]);
                                    }
                                }
                            }
                        }else{
                            formData.append(`${key}[${i}][${objKey}]`, obj[objKey]);
                        }
                    }
                }
            }
        } else if (typeof data[key] === 'object') {
            if (data[key] instanceof File) {
                formData.append(key, data[key]);
            }
            else {
                if (data[key] === null) {
                    data[key] = "";
                    formData.append(key, data[key]);
                }
                else {
                    let obj = data[key];

                    for (var objKey in obj) {
                        if (obj[objKey] === null) {
                            obj[objKey] = "";
                        }
                        formData.append(`${key}[${objKey}]`, obj[objKey]);
                    }
                }
            }
        }
        else {
            if (data[key] === null) {
                data[key] = "";
            }
            formData.append(key, data[key]);
        }
    });

    return formData;
}

export { instance as default };
