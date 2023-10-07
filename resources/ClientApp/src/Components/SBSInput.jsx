// Step By Step Input

import React from 'react';
import './SBSInput.css';

const SBSInput = ({ name, steps = [], placeholderSteps = [], cls = "", id = "", readonly = false, getInputs = false, SBSServices = { HandlerAdd: "", HandlerUpd: "", HandlerDelete: "", HandlerSaveChanges: "" } }) => {
    if (name === undefined) {
        console.error("Falta asignar un name al SBSInput");
        return false;
    }
    if (SBSServices.HandlerAdd === "" && SBSServices.HandlerUpd === "" && SBSServices.HandlerDelete === "" && SBSServices.HandlerSaveChanges === "") {
        console.error("Es necesario enviar los servicios requeridos (HandlerAdd, HandlerUpd, HandlerDelete y HandlerSaveChanges). Puedes tomarlos accediendo al componente y en la parte inferior. Debes declararlos en el componente padre y después pasarlos al hijo.")
    }
    // Preservación de estado

    if (steps.length === 0) {
        return (
            <>
                <div className={cls + " SBSInputContainer"} id={id}>
                    <div className="SBTopActions" name={name}>
                        <button type="button" className="btn btn-success" onClick={(e) => { saveChanges(e.currentTarget, name, SBSServices.HandlerSaveChanges, getInputs) }}><i className="fa fa-save"></i> Guardar cambios</button>
                        <button type="button" className="btn btn-danger" ><i className="fa fa-times"></i> Cancelar</button>
                    </div>
                    <div className="SBSInputs">

                    </div>
                    <hr />
                    <label>Ingresa un paso</label>
                    <div className="TempStep">
                        <input readOnly={readonly} placeholder="Ingresa un paso a seguir" onChange={(e) => { showActions(e.currentTarget, true) }} />
                        <div className="actions">
                            <button type="button" className="btn-success" onClick={(e) => { steps = addStep(e.currentTarget, steps); }}><i className="fa fa-check"></i></button>
                            <button type="button" className="btn-danger" onClick={(e) => { cancelEdit(e.currentTarget, true) }}><i className="fa fa-times"></i></button>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    else {
        return (
            <>
                <div className={cls + " SBSInputContainer"} id={id}>
                    <div className="SBTopActions" name={name}>
                        <button type="button" className="btn btn-success" onClick={(e) => { saveChanges(e.currentTarget, name, SBSServices.HandlerSaveChanges, getInputs); e.currentTarget.parentNode.classList.remove("showActions") }}><i className="fa fa-save"></i> Guardar cambios</button>
                    </div>
                    <div className="SBSInputs">
                        {steps.map((val, i) => (
                            <div className="Item" key={i}>
                                <input readOnly={readonly} onChange={(e) => { SBSServices.HandlerUpd(e.currentTarget.value, i); showSaveChanges(name); }} placeholder="Ingresa un paso a seguir" name={name} value={val} />
                                <div className="dAction">
                                    <button type="button" className="btn-danger" onClick={(e) => { SBSServices.HandlerDelete(i); showSaveChanges(name); }}><i className="fa fa-trash-alt"></i></button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <hr />
                    <label>Ingresa un paso</label>
                    <div className="TempStep">
                        <input readOnly={readonly} placeholder="Ingresa un paso a seguir" onKeyUp={(e) => {
                            if (e.key === "Enter") {
                                SBSServices.HandlerAdd(e.currentTarget.value); closeActions(e.currentTarget, true);
                                showSaveChanges(name);
                            }
                            showActions(e.currentTarget, false);
                        }} />
                        <div className="actions">
                            <button type="button" className="btn-success" onClick={(e) => {
                                SBSServices.HandlerAdd(e.currentTarget.parentNode.parentNode.querySelector("input").value);
                                closeActions(e.currentTarget, false);
                                showSaveChanges(name);
                            }}><i className="fa fa-check"></i></button>
                            <button type="button" className="btn-danger" onClick={(e) => { cancelEdit(e.currentTarget, true) }}><i className="fa fa-times"></i></button>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

function saveChanges(element, name, saveHandler, getInputs) {
    // se asignan nombres a agregados
    let inputs = element.parentNode.parentNode.querySelectorAll(".SBSInputs input");
    let values = [];
    inputs.forEach(item => {
        item.setAttribute("name", name);
        values.push(item.value);
    })
    if (getInputs)
        saveHandler(inputs);
    else
        saveHandler(values);

}
function showActions(e, fromButton) {
    if (fromButton) {
        let input = e.parentNode.parentNode.querySelector("input");
        if (input.value != "") {
            e.parentNode.classList.add("showActions")
        } else {
            e.parentNode.classList.remove("showActions");
        }
    } else {
        if (e.value != "") {
            e.parentNode.querySelector(".actions").classList.add("showActions")
        } else {
            e.parentNode.querySelector(".actions").classList.remove("showActions")
        }
    }
}
function closeActions(e, fromInput) {
    if (fromInput) {
        e.parentNode.querySelector(".actions").classList.remove("showActions");
        e.value = "";
        e.focus();
    } else {
        e.parentNode.classList.remove("showActions");
        e.parentNode.parentNode.querySelector("input").value = "";
        e.parentNode.parentNode.querySelector("input").focus();
    }
}
function addStep(e, handlerUpd, steps) {
    let stepElement = e.parentNode.parentNode.querySelector("input");
    let item = CreateItem(stepElement.value, steps.length - 1);
    stepElement.value = "";
    stepElement.parentNode.querySelector(".actions").classList.remove("showActions");
    e.parentNode.parentNode.parentNode.querySelector(".SBSInputs").appendChild(item);

    // Se añade event de eliminación y upd desde aquí
    item.querySelector(".dAction button").addEventListener("click", (e) => { deleteItem(item) })
    item.querySelector("input").addEventListener("change", (e) => { handlerUpd(e.currentTarget, steps.length - 1) });
}
function showSaveChanges(name) {
    document.querySelector(`.SBTopActions[name="${name}"]`).classList.add("showActions");
}

function cancelEdit(element, isNew) {
    let input = element.parentNode.parentNode.querySelector("input");
    if (isNew) 
        input.value = "";
     else
        input.value = input.getAttribute("actual-value");
    element.parentNode.classList.remove("showActions");
}
function deleteItem(element) {
    element.remove();
}
function CreateItem(value, i) {
    let Item = document.createElement("div"),
        Input = document.createElement("input"),
        DAction = document.createElement("div"),
        ButtonD = document.createElement("button"),
        IconD = document.createElement("i");

    // Asignación de atributos
    Item.setAttribute("class", "Item");
    Item.setAttribute("index", i);
    Input.setAttribute("placeholder", "...");
    Input.setAttribute("value", value);
    
    DAction.setAttribute("class", "dAction");
    ButtonD.setAttribute("class", "btn-danger");
    ButtonD.setAttribute("type", "button");
    IconD.setAttribute("class", "fa fa-trash-alt");

    // Estructuración
    ButtonD.appendChild(IconD);
    DAction.appendChild(ButtonD);

    Item.appendChild(Input);
    Item.appendChild(DAction);

    return Item;
}

/* FUNCIONES DE BINDEO PARA ESTE COMPONENTE */

/* FUNCIONES PARA DENTRO DEL CONSTRUCTOR */
/*
 this.HandlerStepAdd = this.HandlerStepAdd.bind(this);
 this.HandlerStepUpd = this.HandlerStepUpd.bind(this);
 this.HandlerStepDelete = this.HandlerStepDelete.bind(this);
 this.HandlerSaveSteps = this.HandlerSaveSteps.bind(this); 
 */

/* FUNCIONES PARA FUERA DEL CONSTRUCTOR */

/* Estas funciones modifican el state declarado para los pasos. Es importante que se declaren junto a las anteriores. */

/*
    HandlerStepAdd = async (value) => {
        let temp = this.state.{nombre-que-contiene-los-pasos};
        temp.push(value);
        this.setState({
            {nombre-que-contiene-los-pasos}: temp
        })
    }

    HandlerStepUpd = async (value, i) => {
        let temp = this.state.{nombre-que-contiene-los-pasos};
        temp[i] = value;
        this.setState({
            {nombre-que-contiene-los-pasos}: temp
        })
    }

    HandlerStepDelete = async (i) => {
        let temp = this.state.{nombre-que-contiene-los-pasos};
        temp.splice(i, 1);
        this.setState({
            {nombre-que-contiene-los-pasos}: temp
        })
    }

    HandlerSaveSteps = async (arrayInputs) => {
        // Hacer lo que se deba para guardar o procesar los pasos obtenidos
        console.log(arrayInputs);
    }
 */


export default SBSInput;