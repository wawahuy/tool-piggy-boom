import { Job as JobBull } from "bullmq";
import moment from "moment";
import proxy, { Proxy } from "proxy-lists";
import { mainQueueInstance, playQueueInstance } from "../director";
import { Job, JobRunPlayerData } from "../../models/Job";
import ModelIPProxyConfig from "../../models/schema/ip_proxy_config";
import ModelIPProxy from "../../models/schema/ip_proxy";

export const nameJobRunProxy = "RUN_PROXY_JOB";


export const jobRunProxy: Job = {
  name: nameJobRunProxy,
  data: null,
  ops: {
    attempts: 0,
  },
};

export async function hasJobRunProxy() {
  const queue = mainQueueInstance.queue;
  const watting = await queue.getWaiting(0, await queue.getWaitingCount());
  const active = await queue.getActive(0, await queue.getActiveCount());

  for(let item of watting) {
    if (item.name === nameJobRunProxy) {
      return true;
    }
  }

  for(let item of active) {
    if (item.name === nameJobRunProxy) {
      return true;
    }
  }

  return false;
}

export const jobRunProxyProccess = async (job: JobBull) => {
  let results: (Proxy[])[] = [];
  let p = proxy.getProxies({
    defaultRequestOptions: {
      timeout: 5000,
    },
  })
  p.on('data', proxies => {
    if (proxies?.length) {
      results.push(proxies);
    }
  })

  await new Promise(resolve => p.once('end', resolve));

  await ModelIPProxy.deleteMany({});

  for(let proxies of results) {
    for(let pr of proxies) {
      await ModelIPProxy.insertMany({ ipAddress: pr.ipAddress, port: pr.port });
    }
  }

  await ModelIPProxyConfig.updateOne({}, { syncDate: moment().toDate() }, { upsert: true });

  return await ModelIPProxy.count().catch(err => 0);
};