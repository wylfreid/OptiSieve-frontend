import axios from "axios";

export const fetchUserRequest = () => ({
  type: "FETCH_USER_REQUEST",
});

export const fetchUserSuccess = (user) => ({
  type: "FETCH_USER_SUCCESS",
  payload: user,
});

export const fetchUserFailure = (error) => ({
  type: "FETCH_USER_FAILURE",
  payload: error,
});

export const fetchUser = () => {
  return async (dispatch) => {
    dispatch(fetchUserRequest());

    const response = axios
      .get(`https://jsonplaceholder.typicode.com/users/1`)
      .then((response) => {
        dispatch(fetchUserSuccess(response.data));
      })
      .catch((err) => {
        dispatch(fetchUserFailure(err.message));
      });
  };
};
