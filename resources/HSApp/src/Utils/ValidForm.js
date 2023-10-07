
export default class ValidForm {
    cleanErrors = (errors) => {
        Object.keys(errors).forEach(function (key) {
            let keyE = key.charAt(0).toLowerCase() + key.slice(1);
            if (!Array.isArray(errors[keyE])) {
                errors[keyE] = "";
            }
            else {
                errors[keyE].map(selectArray0 => {
                    Object.keys(selectArray0).forEach(function (keyArray0) {
                        let keyEArray0 = keyArray0.charAt(0).toLowerCase() + keyArray0.slice(1);
                        if (!Array.isArray(errors[keyE][keyArray0])) {
                            errors[keyE][keyEArray0] = ""
                        }
                        else {
                            errors[keyE][keyArray0].map(selectArray1 => {
                                Object.keys(selectArray1).forEach(function (keyArray1) {
                                    let keyEArray1 = keyArray1.charAt(0).toLowerCase() + keyArray1.slice(1);
                                    errors[keyE][keyArray0][keyEArray1] = ""
                                });
                            });
                        }
                    });
                });
            }
        });
        return errors;
    }
    resetObject = (fields) => {
        for (var key in fields) {
            if (fields.hasOwnProperty(key)) {
                switch (typeof (fields[key])) {
                    case 'number':
                        fields[key] = 0;
                        break;
                    case 'string':
                        fields[key] = '';
                        break;
                    case 'boolean':
                        fields[key] = false;
                        break;
                    case 'object':
                        fields[key] = this.resetObject(fields[key]);
                        break;
                    default:
                }
            }
        }
        return fields;
    }
    displayErrors = (errorsApi, errors) => {
        let errorsText = '';
        let keyClean1 = ''
        let keyClean2 = ''
        let regex = /\.(.*)\./;
        Object.keys(errorsApi).forEach(function (key) {
            errorsText = '';
            keyClean1 = ''
            regex = /\.(.*)\./
            let match = regex.exec(key);

            if (match === null) {
                keyClean1 = key.charAt(0).toLowerCase() + key.slice(1);
                Object.keys(errorsApi[key]).forEach(function (key2) {
                    errorsText += errorsApi[key][key2];
                });
                errors[keyClean1] = errorsText;
            }
            else {
                keyClean1 = key.substring(0, key.indexOf(match[0]));
                console.log(keyClean1);
                keyClean2 = key.substring((keyClean1.length + match[0].length), key.length);
                console.log("keyClean2" + keyClean2);

                keyClean1 = keyClean1.charAt(0).toLowerCase() + keyClean1.slice(1);
                let index = parseInt(match[0].replace('.', '').replace('.', ''));
                console.log(index);
                keyClean2 = keyClean2.charAt(0).toLowerCase() + keyClean2.slice(1);
                console.log(keyClean2);

                Object.keys(errorsApi[key]).forEach(function (key2) {
                    errorsText += errorsApi[key][key2];
                });
                errors[keyClean1][index][keyClean2] = errorsText;
            }
        });
        return errors;
    }
    handleChangeField(field, fields, e) {
        fields[field] = e.target.value;                    
        return fields; 
    }
    handleChangeFieldJodiEditor(field, fields, e) {
        fields[field] = e;
        return fields; 
    }
    handleChangeDateField(field, fields, e) {
        fields[field] = e;
        return fields;
    }
    handleChangeErrors(field, errors, e) {
        errors[field] = "";
        return errors;
    }
    handleSelectChangeField(field, fields, e) {
        fields[field] = e;
        fields[field.replace("Select", "")] = e.value;
        return fields;
    }
    handleSelectChangeErrors(field, errors, e) {
        errors[field] = "";
        errors[field.replace("Select", "")] = ""
        return errors;
    }
    handleArrayChangeField(field, index, field2, fields, e) {
        fields[field][index][field2] = e.target.value;
        return fields; 
    }
    handleArrayChangeErrors(field, index, field2, errors, e) {
        errors[field][index][field2] = "";
        return errors;
    }
    handleSelectArrayChangeField(field, index, field2, fields, e) {
        fields[field][index][field2] = e;
        fields[field][index][field2.replace("Select", "")] = e.value;
        return fields;
    }
    handleSelectArrayChangeErrors(field, index, field2, errors, e) {
        errors[field][index][field2] = "";
        errors[field][index][field2.replace("Select", "")] = "";
        return errors;
    }
    handleDatetArrayChangeField(field, index, field2, fields, e) {    
        fields[field][index][field2] = e;
        return fields;
    }
    getDateForApi(date) {
        if(date != null){
            if (typeof date === 'object') {
                let [year, month, day] = [date.getFullYear(), date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1), date.getDate() > 9 ? date.getDate() : "0" + date.getDate()]
                return `${year}-${month}-${day}`
            } else{
                let d = date.slice(0, 10);
                let [year, month, day] = d.split("-");
                return `${year}-${month}-${day}`;
            }
        }
        return null
    }
    getColoquialDate(date){
        if(date != null){
            if (typeof date === 'object') {
                let [year, month, day] = [date.getFullYear(), date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1), date.getDate() > 9 ? date.getDate() : "0" + date.getDate()]
                return `${day}/${month}/${year}`
            } else{
                let d = date.slice(0, 10);
                let [year, month, day] = d.split("-");
                return `${day}/${month}/${year}`
            }
        }
    }
}