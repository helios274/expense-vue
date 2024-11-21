import { toast } from "react-toastify";

const handleErrors = (error, defaultMessage = "Internal Server Error") => {
  if (import.meta.env.DEV) console.log(error);
  const errorMessage = error.response?.data?.message || defaultMessage;
  toast.error(errorMessage);
};

export default handleErrors;
