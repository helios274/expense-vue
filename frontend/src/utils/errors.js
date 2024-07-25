import { toast } from "react-toastify";

const handleErrors = (error, defaultMessage = "Internal Server Error") => {
  const errorMessage = error.response?.data?.message || defaultMessage;
  toast.error(errorMessage);
};

export default handleErrors;
