export const LoadingReducer = (
  prevState = {
    isLoading: false,
  },
  action
) => {
  //   console.log(action);
  let { type, payload } = action;
  switch ((type, payload)) {
    case "change_loading":
      let newState = { ...prevState };
      newState.isLoading = payload;
      return newState;
    default:
      return prevState;
  }
};
