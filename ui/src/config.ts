const dev = {
  api: "http://localhost/api/",
};

const prod = {
  api: "/api/",
};

const config = process.env.REACT_APP_STAGE === "production" ? prod : dev;
export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config,
};
