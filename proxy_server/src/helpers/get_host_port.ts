export const getHostPortFromString = function (hostString: string, defaultPort: number) {
  let host = hostString;
  let port = defaultPort;
  const regex_hostport = /^([^:]+)(:([0-9]+))?$/;

  const result = regex_hostport.exec(hostString);
  if (result != null) {
    host = result[1];
    if (result[2] != null) {
      port = <number><unknown>result[3];
    }
  }
  return { host, port };
};