function getObjectValueByString(s, obj) {
    if (s == null || s === undefined)
        return null
    let properties;
    if (s.includes("."))
        properties = s.split(".");
    else
        properties = [s];
    properties.forEach(i => {
        obj = obj[i]
    })
    return obj
}