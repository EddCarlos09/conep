import React from 'react';
import './TitleCustomCard.css';
const TitleCustomCard = ({ item }) => {

    return (
        <>
            <div className="post-item">
                <div className="leftSide">
                    <img src={item.photo} className="img-responsive img-text" alt={item.altPhoto} />
                </div>
                <div className="rightSide">
                    <div className="post-title">
                        <h3><a href={item.link}>{item.title}</a></h3>
                        <p><i className="fa fa-calendar"></i>{item.subtitle}</p>
                    </div>
                    <div className="post-text">
                        <p>{item.text}</p>
                    </div>
                    <div className="post-footer">
                        <a href={item.link} >Leer más ...</a>
                    </div>
                </div>
            </div>
            </>
        );
}

export default TitleCustomCard;