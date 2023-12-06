import axios from "axios";
import { useCallback, useState } from "react";


export const IMAGE_URL = "http://localhost:5001";
const API_URL = "http://localhost:5001/api";

const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // using callback to avoid re-execute the method whenever this hook (useHttpClient) is called. S10 L12
  const get = useCallback(async (action) => {
    setIsLoading(true);
    let urlParams = {};
    let path = `${API_URL}` + action.path;
    let headers = {
      "Content-Type": "application/json",
      // "Access-Control-Allow-Origin": "*",
      // Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    let options = { headers: headers, params: urlParams };
    try {
      const response = await axios.get(path, options);
      return response;
    } catch (err) {
      setError(
        err.response.data.message || "Something went wrong, please try again."
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const post = useCallback(async (action) => {
    setIsLoading(true);
    let urlParams = {};
    let path = `${API_URL}` + action.path;
    // let body = JSON.stringify(action.body);
    let body = action.body;
    let headers = action.headers;
    /* let headers = {
      "Content-Type": "application/json",
      // "Access-Control-Allow-Origin": "*",
      // Authorization: `Bearer ${localStorage.getItem("token")}`,
    }; */
    let options = { headers: headers, params: urlParams };
    try {
      return await axios.post(path, body, options);
      //console.log(response);
    } catch (err) {
      setError(
        err.response.data.message || "Something went wrong, please try again."
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const patch = useCallback(async (action) => {
    setIsLoading(true);
    let urlParams = {};
    let path = `${API_URL}` + action.path;
    let body = JSON.stringify(action.body);
    let headers = action.headers;
    /* let headers = {
      "Content-Type": "application/json",
      // "Access-Control-Allow-Origin": "*",
      // Authorization: `Bearer ${localStorage.getItem("token")}`,
    }; */
    let options = { headers: headers, params: urlParams };
    try {
      return await axios.patch(path, body, options);
      //console.log(response);
    } catch (err) {
      setError(
        err.response.data.message || "Something went wrong, please try again."
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const remove = useCallback(async (action) => {
    setIsLoading(true);
    let urlParams = {};
    let path = `${API_URL}` + action.path;
    let headers = action.headers;
    /* let headers = {
      // "Access-Control-Allow-Origin": "*",
      // Authorization: `Bearer ${localStorage.getItem("token")}`,
    }; */
    let options = { headers: headers, params: urlParams };
    try {
      return await axios.delete(path, options);
    } catch (err) {
      setError(
        err.response.data.message || "Something went wrong, please try again."
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = () => {
    setError(null);
  };

  return { isLoading, error, get, post, patch, remove, clearError };
};

export default useHttpClient;
