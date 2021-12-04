import React, { useState, useEffect } from "react";
import Card from "../Components/Card";

const ViewUser = () => {
  // dont forget to fetch key from request param
  const [dataKey] = useState(window.location.search.replace("?", "") || "");
  const [allData, setAllData] = useState({ data: {} });
  useEffect(() => {
    //for fetching specific data from firebase
    fetch(
      `https://assignment-ff008-default-rtdb.firebaseio.com/alldata/students/${dataKey}.json`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setAllData({ data: data });
      })
      .catch((err) => console.log(err));
  }, [dataKey]);
  // use '?' to render values after fetching is completed
  return (
    <React.Fragment>
      <div className="container">
        <Card alldata={allData} />
      </div>
    </React.Fragment>
  );
};

export default ViewUser;
