import React from 'react';
import './TagsInput.css';

// Valor que se envía: Una cadena de palabras separadas por comas (algo1, algo2, algo3)
let arrayTags = [];
const TagsInput = ({ name, stringTags = "", placeholder = "...", cls = "", id = "" }) => {
    if (name === undefined)
        console.error("Falta asignar un name al TagsInput");
    if (stringTags.includes(","))
        arrayTags = stringTags.split(',');

    if (arrayTags.length === 0) {
        return (
            <>
                <div className={cls + " TagsInputContainer"} id={id}>
                    <input type="hidden" name={name} value={stringTags} />
                    <div className="Tags">
                    </div>
                    <input placeholder={placeholder} onKeyUp={(e) => { AddTag(e) }} />
                </div>
            </>
        )
    }

    return (
        <>
            <div className={cls + " TagsInputContainer"} id={id}>
                <input type="hidden" name={name} value={stringTags} />
                <div className="Tags">
                    {arrayTags.map((tag, i) => {
                        return (
                            <div className="Tag" key={i}>
                                <span onClick={(e) => { DeleteTag(e.currentTarget.parentNode, i) }} className="DeleteTag"><i className="fa fa-times"></i></span>
                                <p>{tag}</p>
                            </div>
                        );
                    })}
                </div>
                <input placeholder={placeholder} onKeyUp={(e) => { AddTag(e) }} />
            </div>
        </>
        )
}

function DeleteTag(tag, i) {
    arrayTags.splice(i, 1);
    let newString = getNewString();
    tag.parentNode.parentNode.querySelector("input[type='hidden']").value = newString;
    tag.remove();
}
function getNewString() {
    let newString = "";
    
    arrayTags.forEach((item, i) => {
        if (i !== arrayTags.length - 1)
            newString += item + ",";
        else
            newString += item;
    });
    
    return newString;
}
function validateValue(e) {
    let value = e.currentTarget.value;
    let newValue = value.slice(0, value.length - 1).replace(/,/g, '');
    let valid = true;

    // Se resetean clases invalidas
    let tags = e.currentTarget.parentNode.querySelectorAll(".Tags .Tag");
    tags.forEach(tag => {
        tag.classList.remove("invalid");
    });

    arrayTags.forEach((item, i) => {
        if (item === newValue) {
            valid = false;
            e.currentTarget.value = e.currentTarget.value.replace(/,/g, '');
            tags[i].classList.add("invalid");
        }
    })
    return valid;
}
function AddTag(e) {
    let value = e.currentTarget.value
    if (value.length > 1) {
        if (e.key === ",") {
            if (validateValue(e) === true) {
                let parent = e.currentTarget.parentNode;
                let Tag = document.createElement("div");
                let Span = document.createElement("span");
                let P = document.createElement("p");
                let Icon = document.createElement("i");

                Icon.setAttribute("class", "fa fa-times");
                Span.setAttribute("class", "DeleteTag");
                Span.addEventListener("click", (e) => {
                    DeleteTag(e.currentTarget.parentNode, arrayTags.length - 1);
                });

                let newValue = value.slice(0, value.length - 1).replace(/,/g, '');
                P.innerText = newValue;
                Tag.setAttribute("class", "Tag");
                Span.appendChild(Icon);
                Tag.appendChild(Span);
                Tag.appendChild(P);
                parent.querySelector(".Tags").appendChild(Tag);
                e.currentTarget.value = "";
                arrayTags.push(newValue.replace(/,/g, ''));

                let newString = getNewString();
                parent.querySelector("input[type='hidden']").value = newString;
            }
        }
    }
}
export default TagsInput;

