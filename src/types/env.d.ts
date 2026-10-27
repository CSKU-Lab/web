interface Env {
  env: {
    API_URL: string;
  };
}

type ClientEnv = {
  env: {
    [key in keyof Env["env"] as `CLIENT_${key}`]: string;
  };
};
