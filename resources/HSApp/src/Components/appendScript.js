
export const appendScript = (scriptToAppend) => {
    const script = document.createElement("script");
    script.src = scriptToAppend;
    script.async = false;
    script.type = "text/javascript";
    document.body.appendChild(script);
}

