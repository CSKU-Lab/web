export const ClientEnv = () => {
  const envs: Record<string, any> = {};
  Object.entries(process.env).forEach(([key, value]) => {
    if (typeof key === "string") {
      if (key.startsWith("CLIENT_")) envs[key] = value;
    }
  });

  return (
    <script
      id="client-env"
      dangerouslySetInnerHTML={{
        __html: `window.env = {${Object.entries(envs)
          .map(([key, value]) => `${key}:${JSON.stringify(value)}`)
          .join(",")}}`,
      }}
    />
  );
};
