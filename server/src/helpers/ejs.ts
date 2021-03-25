import urljoin from 'url-join';

const pack = require('../../package.json');
const version = pack.version;

const image = (p: string) => {
  return assets('images', p);
}

const style = (p: string) => {
  return assets('styles', p);
}

const script = (p: string) => {
  return assets('scripts', p);
}

const assets = (...p: string[]) => {
  return  urljoin("/", "assets", ...p, `?v=${version}`)
}

const modules = {
  version,
  assets,
  image,
  style,
  script
};

export default modules;