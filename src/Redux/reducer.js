const initialState = [];
// return state based on the action
// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  switch (action.type) {
    case "FETCH_DATA":
      return action.payload;

    default:
      return state;
  }
}
