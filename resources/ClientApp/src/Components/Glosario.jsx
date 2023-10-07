import React from 'react';
import './Glosario.css';

const Glosario = ({ returnableObject = null, settableKeyValue = "", settableObjectValue = "", unselectWordHandler = null, selectWordHandler = null, glosarioData = [], glosarioSelected = [], accesableKey = "palabra"}) => {
    let abecedario = [];
    let strabc =  'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
    if(glosarioData !== null && glosarioData.length > 0){
        [...strabc].forEach(letra => {
            let palabrasSegunLetra = glosarioData.filter((p)=>{ return p[accesableKey].toUpperCase().startsWith(letra) })
            abecedario[letra] = palabrasSegunLetra
        });
    }else{
        return false
    }

    return (
        <div className="glosarioContainer">
           {
            [...strabc].map((letra, i) => {
                return (
                    <div key={i} className="glosarioPalabrasContainer">
                        <h3>{letra}</h3>
                        <div className="palabras">
                        {
                            abecedario[letra].map((p, j) => {
                                let cFiltred = glosarioSelected.filter((x)=>{ return x.id === p.id })[0]
                                if(typeof cFiltred === 'undefined'){
                                    return (
                                        <p key={j} onClick={(e)=>{
                                            if(e.currentTarget.classList.contains("selected")){
                                                e.currentTarget.classList.remove("selected")
                                                unselectWordHandler(p)
                                            }
                                            else{
                                                e.currentTarget.classList.add("selected")
                                                selectWordHandler(p)
                                            }
                                            }}
                                        >{p[accesableKey]}</p>
                                    )
                                }else{
                                    return (
                                        <p className="selected" key={j} onClick={(e)=>{
                                            if(e.currentTarget.classList.contains("selected")){
                                                e.currentTarget.classList.remove("selected")
                                                unselectWordHandler(p)
                                            }
                                            else{
                                                e.currentTarget.classList.add("selected")
                                                selectWordHandler(p)
                                            }
                                            }}
                                        >{p[accesableKey]}</p>
                                    )
                                }
                            })
                        }
                        </div>
                    </div>
                )
            })
           }
        </div>
    );
}
export default Glosario;