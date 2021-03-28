import { networkInterfaces } from "os";

export default function showNets() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets?.[name] || []) {
        if (net.family === 'IPv4' && !net.internal) {
            console.log(name, net.address);
        }
    }
  }
}