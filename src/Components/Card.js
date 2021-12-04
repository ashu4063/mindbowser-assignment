import React from "react";
import PropTypes from "prop-types";

const Card = (props) => {
  return (
    <div className="card p-4 mx-auto " id="singleUserCard">
      <p>Name Of the Student:{props.alldata.data.name}</p>
      <p>Gender:{props.alldata.data.gender}</p>
      <p>Birth Date:{props.alldata.data.birthDate}</p>
      <p>Address:{props.alldata.data.address}</p>
      <p>College Name:{props.alldata.data.collegeName}</p>
      <p>
        Hobbies:
        {props.alldata.data.hobby !== undefined
          ? props.alldata.data.hobby?.join(",")
          : ""}
        {props.alldata.data.otherHobby !== ""
          ? "," + props.alldata.data.otherHobby
          : ""}
      </p>
    </div>
  );
};

Card.propTypes = {
  alldata: PropTypes.object.isRequired,
};

export default Card;
