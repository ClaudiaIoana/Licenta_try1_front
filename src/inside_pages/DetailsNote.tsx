import React, {CSSProperties, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import { useLocation } from 'react-router-dom';

const DetailsNote = () => {
    const location = useLocation();
    const noteDetail = location.state?.noteDetail || {};

    const [formData, setFormData] = useState({
        title: "",
        topic: "",
        content: "",
        importance: 0,
        observations: "",
    });

    useEffect(() => {
        setFormData({
            title: noteDetail.title,
            topic: noteDetail.topic,
            content: noteDetail.content,
            importance: noteDetail.importance,
            observations: noteDetail.observations,
        });

    }, [noteDetail]);

    return (
       <div>
           <h2>Recipe Information: </h2>
           <p>
               <b>
                   {"Title: ".concat(
                       String(formData.title)
                   )}
               </b>
           </p>
           <p>
               <b>
                   {"Topic: ".concat(
                       String(formData.topic)
                   )}
               </b>
           </p>
           <p>
               <b>
                   {"Content: ".concat(
                       String(formData.content)
                   )}
               </b>
           </p>
           <p>
               <b>
                   {"Observations: ".concat(
                       String(formData.observations)
                   )}
               </b>
           </p>
           <p>
               <b>
                   {"Importance: ".concat(
                       String(formData.importance)
                   )}
               </b>
           </p>
           <Link to="/update-note" state={{ noteDetail: noteDetail }} className="details-button">Update</Link>

       </div>
    );
};

export default DetailsNote;