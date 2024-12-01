export const checkAuth = () => {
  let isAuthenticated = false;
  let token = document.cookie
    ? document.cookie
        ?.split("; ")
        ?.find((row) => row.startsWith("authtoken="))
        ?.split("=")[1]
    : undefined;

  if (token !== undefined && token.length > 1) {
    isAuthenticated = true;
  }
  return isAuthenticated;
};

export const formatDate = (value) => {
  const date = new Date(value);

  const options = {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC", // Specify UTC to avoid local time zone issues
  };

  return date.toLocaleString("en-US", options);
};

export const formatDateTime = (value) => {
  const date = new Date(value);

  const options = {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // To display the time in 12-hour format with AM/PM
  };

  return date.toLocaleString("en-US", options);
};
