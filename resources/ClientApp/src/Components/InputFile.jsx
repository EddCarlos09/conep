import React from 'react';
import './InputFile.css';

const renderPhotos = (source) => {
    if (!source) return;

    let random = String(Math.random()).substring(2);
    let preview = "preview-" + random;
    
    if (Array.isArray(source)) {
        Array.from(source).map((file) => URL.createObjectURL(file));
        return source.map((photo) => {
            return (
                <div className="file-preview-frame" id={preview} key={photo}>
                    <img
                        src={photo}
                        className="file-preview-image"
                        title={random}
                        alt={random}
                        style={{ width: "auto", height: "160px" }}/>
                </div>);
        });
    } else {
        source = URL.createObjectURL(source);
        return (
            <div className="file-preview-frame" id={preview} key={source}>
                <img
                    src={source}
                    className="file-preview-image"
                    title={random}
                    alt={random}
                    style={{ width: "auto", height: "160px" }} />
            </div>);
    }
};

const setClassHaveFiles = (source) => {
    if (Array.isArray(source)) {
        return source.length === 0 ? "file-input file-input-new" : "file-input";
    } else {
        return source === '' ? "file-input file-input-new" : "file-input";
    }
    
}
const setMultiple = (isMultiple) => {
    return isMultiple === true ? "multiple" : "";
}

const InputFile = ({ divClass, inputId, onChange, Text, isMultiple, spanTextError, spanClassError, selectedFiles, clearSelectedFiles, inputAccept}) => {
   
    return (
        <div>
            <div className={divClass}>
                <span className={setClassHaveFiles(selectedFiles)}>
                    <div className="file-preview ">
                        <div className="close fileinput-remove text-right" onClick={clearSelectedFiles}>×</div>
                        <div className="file-preview-thumbnails">
                            {renderPhotos(selectedFiles)}
                            </div>
                        <div className="clearfix" />
                        <div className="file-preview-status text-center text-success" />
                    </div>
                    <button type="button" className="btn btn-default fileinput-remove fileinput-remove-button" onClick={clearSelectedFiles}>
                        <i className="glyphicon glyphicon-ban-circle" /> Remove</button>
                    <div className="btn btn-primary btn-file">
                        <i className="glyphicon glyphicon-folder-open" /> &nbsp; {Text}
                        <input type="file" id={inputId} onChange={onChange} multiple={setMultiple(isMultiple)} accept={inputAccept}/></div>
                </span>
            </div>
            <span className={spanClassError}>{spanTextError}</span>
        </div>
    );
}
export default InputFile;