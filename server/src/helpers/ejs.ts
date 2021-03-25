const pack = require('../../package.json');
const version = pack.version;

const image = (path: string) => {
  return assets(`images/${path}`);
}

const style = (path: string) => {
  return assets(`styles/${path}`);
}

const script = (path: string) => {
  return assets(`scripts/${path}`);
}

const assets = (path: string) => {
  return `/assets/${path}?v=${version}`;
}

const modules = {
  version,
  assets,
  image,
  style,
  script
};

export default modules;