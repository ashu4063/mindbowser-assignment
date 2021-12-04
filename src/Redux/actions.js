import axios from "axios";
// action for fetching data from firebase
export const fetchData = () => async (depatch) => {
  const response = await axios.get(
    "https://assignment-ff008-default-rtdb.firebaseio.com/.json"
  );

  depatch({ type: "FETCH_DATA", payload: response });
};
