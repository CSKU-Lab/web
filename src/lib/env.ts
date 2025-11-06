export const env = (key: keyof Env["env"]) => {
  if (typeof window === "undefined") {
    return process.env["SERVER_" + key];
  }

  if (window.env === undefined) {
    throw new Error("window.env is not defined.");
  }

  return window.env[("CLIENT_" + key) as keyof ClientEnv["env"]];
};
