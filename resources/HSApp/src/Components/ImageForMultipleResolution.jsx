import React from "react";
import "./ImageForMultipleResolution.css";

// Themes: horizontal-scroll, two-columns, four-columns

const ImageClass = "ImageForMultipleResolution";
const ImageForMultipleResolution = ({
    handlerOnLoad,
    handlerOnReset,
    preview = false,
    previewData = null,
    previewImageKey = "imagen",
    origin = null,
    controlName = null,
    accept = "image/png, image/jpg, image/jpeg, image/webp",
    prefix = "img",
    concatenateToName = [],
    resolutions = [8, 16, 32, 64, 128],
    handlerOnSubmit = null,
    showSubmitButton = false,
    theme = "horizontal-scroll",
    responsive = false,
}) => {
    if (controlName === null && !preview) {
        console.error(
            "Es necesario definir un nombre [controlName] al componente ImageForMultipleResolution"
        );
        return false;
    }
    if (preview) {
        if (previewData === null) {
            return false;
        }
    }
    if (preview) {
        return (
            <div className={`${ImageClass}Container`} id={controlName}>
                <div className="Content">
                    <div className={`${ImageClass}Body`}>
                        <div className="ImagesContainer">
                            {previewData.map((x, i) => {
                                return (
                                    <div key={i} className="Item">
                                        <div className="Image">
                                            <img
                                                src={
                                                    origin + x[previewImageKey]
                                                }
                                                alt=""
                                            />
                                        </div>
                                        <div className="Title">
                                            <p>
                                                {!x[previewImageKey] ||
                                                x[previewImageKey] === ""
                                                    ? ""
                                                    : getImageTitle(
                                                          x[previewImageKey]
                                                      )}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className={`${ImageClass}Container`} id={controlName}>
            <div className="InputFile">
                <input
                    accept={accept}
                    className="none"
                    onChange={(e) => {
                        onChangeForImage(
                            e,
                            controlName,
                            resolutions,
                            accept,
                            prefix,
                            concatenateToName,
                            theme,
                            responsive,
                            handlerOnLoad
                        );
                    }}
                    type="file"
                    name={`${controlName}-input-file`}
                />
                <button
                    type="button"
                    onClick={() => {
                        triggerFile(controlName);
                    }}
                    className="btn btn-primary"
                >
                    <i className="fa fa-file-photo-o"></i> Buscar imagen
                </button>
            </div>
            <div className="Content ContentHidden">
                <div className={`${ImageClass}Header`}>
                    <div className="Title">
                        <h3></h3>
                    </div>
                </div>
                <div className={`${ImageClass}Body`}>
                    <div className="ImagesContainer">
                        {/* Se insertan mediante onChangeForImage */}
                    </div>
                </div>
                <div className={`${ImageClass}Footer`}>
                    <div className="Actions">
                        <button
                            className={`btn btn-danger ${ImageClass}CloseButton`}
                            type="button"
                            onClick={() => {
                                if (handlerOnReset !== null)
                                    resetControl(controlName);
                                if (handlerOnReset) handlerOnReset();
                            }}
                        >
                            <i className="fa fa-ban"></i> Remover imágenes
                        </button>
                        <button
                            className={!showSubmitButton ? "none" : ""}
                            type="button"
                            onClick={() => {
                                if (handlerOnSubmit !== null) handlerOnSubmit();
                            }}
                        >
                            <i className="fa fa-save"></i> Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

function triggerFile(name) {
    name = `${name}-input-file`;
    document.querySelector(`input[name="${name}"]`).click();
}

function getImageTitle(url) {
    let urlParts = url.split("/");
    return urlParts[urlParts.length - 1];
}

function resetControl(controlName) {
    // Deshabilitamos contenedores
    let container = document.querySelector(`#${controlName}`);
    container.classList.remove("FileLoaded");
    container.querySelector(".Content").classList.add("ContentHidden");
    container.querySelector(".InputFile").classList.remove("ContentHidden");
    container.querySelector(".InputFile input").value = "";

    container.querySelector(
        `.Content .ImageForMultipleResolutionBody .ImagesContainer`
    ).innerHTML = "";
}

function onChangeForImage(
    e,
    controlName,
    resolutions = [],
    accept,
    prefix,
    concatenateToName,
    theme,
    responsive,
    handlerOnLoad
) {
    var arrayFiles = [];

    // Habilitamos contenedores
    let container = document.querySelector(`#${controlName}`);
    container.classList.add("FileLoaded");
    container.querySelector(".Content").classList.remove("ContentHidden");
    container.querySelector(".InputFile").classList.add("ContentHidden");

    // Images encoding to base64 for each image
    const file = e.currentTarget.files[0];
    if (!file) {
        return false;
    }
    // Se añade título
    container.querySelector(`.${ImageClass}Header h3`).textContent = file.name;

    resolutions.forEach((x, i) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = function (event) {
            const imgElement = document.createElement("img");
            imgElement.src = event.target.result;

            imgElement.onload = function (imgEvent) {
                const canvas = document.createElement("canvas");
                const MAX_WIDTH = x;
                const aspectRatio =
                    imgEvent.target.width / imgEvent.target.height;
                canvas.width = MAX_WIDTH;
                canvas.height = x / aspectRatio;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(
                    imgEvent.target,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                const srcEncoded = ctx.canvas.toDataURL(
                    imgEvent.target,
                    "image/jpeg"
                );

                // Se crea item
                let Item = document.createElement("div"),
                    Image = document.createElement("div"),
                    Title = document.createElement("div"),
                    imgResized = document.createElement("img"),
                    parraf = document.createElement("p");

                Item.className = "Item";
                Image.className = "Image";
                Title.className = "Title";

                imgResized.src = srcEncoded;
                imgResized.alt = generateNewFileName(
                    file.name,
                    prefix,
                    x,
                    concatenateToName
                );
                if (imgResized.alt === "x") return false;
                parraf.textContent = generateNewFileName(
                    file.name,
                    prefix,
                    x,
                    concatenateToName
                );

                Title.appendChild(parraf);
                Image.appendChild(imgResized);
                Item.appendChild(Image);
                Item.appendChild(Title);

                container
                    .querySelector(
                        `.Content .${ImageClass}Body .ImagesContainer`
                    )
                    .appendChild(Item);

                var ImageURL = srcEncoded;
                var block = ImageURL.split(";");
                var contentType = block[0].split(":")[1];
                var realData = block[1].split(",")[1];
                arrayFiles.push(
                    b64toBlob(
                        realData,
                        contentType,
                        null,
                        file,
                        parraf.textContent
                    )
                );
            };
        };
    });
    handlerOnLoad(arrayFiles);
}

function generateNewFileName(name, prefix, res, concatenateToName) {
    if (name.match(/\./g).length > 1) {
        console.error(
            "El archivo subido contiene demasiados '.' . Renómbrelo y vuelva a subirlo."
        );
        return "x";
    }
    let nameData = name.split(".");
    return prefix !== ""
        ? `${prefix}-${nameData[0]}-${res}px.${nameData[1]}`
        : `${nameData[0]}-${res}px.${nameData[1]}`;
}

function b64toBlob(b64Data, contentType, sliceSize, file, newName) {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    var tempFile = new File([blob], newName, {
        type: contentType,
        lastModified: file.lastModified,
    });
    return tempFile;
}

export default ImageForMultipleResolution;
