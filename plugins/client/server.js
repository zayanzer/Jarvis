const Heroku = require('heroku-client');
const Config = require('../../config');
const heroku = new Heroku({ token: Config.HEROKU_API_KEY });
const baseURI = `/apps/${Config.HEROKU_APP_NAME}`;
const axios = require('axios');
const pm2 = require('pm2');
const axiosConfig = {
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    Authorization: `Bearer ${Config.KOYEB_API}`,
  },
};
const axiosInstance = axios.create({
  baseURL: "https://api.render.com/v1",
  headers: {
    Authorization: `Bearer ${Config.RENDER_API}`
  }
});

async function getAppId() {
  try {
    const response = await axiosInstance.get('/services');
    const app = response.data.find(service => service.service.name === Config.RENDER_APP_NAME);
    return app ? app.service.id : false;
  } catch (error) {
    return false;
  }
};

async function setVar(key, value) {
  try {
    const response = await heroku.patch(`${baseURI}/config-vars`, {
      body: {
        [key.toUpperCase()]: value,
      },
    });
    return true;
  } catch (error) {
    return `Error setting config var: ${error}`;
  }
};

async function changeEnv(key, value) {
  try {
    const koyebResponse = await axios.get('https://app.koyeb.com/v1/services', axiosConfig);
    const serviceId = koyebResponse.data.services[0].id;
    const deploymentResponse = await axios.get(`https://app.koyeb.com/v1/deployments/${koyebResponse.data.services[0].latest_deployment_id}`, axiosConfig);
    const envVars = deploymentResponse.data.deployment.definition.env.map((envVar) => {
      if (envVar.key === key) {
        return { scopes: ['region:fra'], key, value };
      }
      return envVar;
    });
    if (!envVars.some((envVar) => envVar.key === key)) {
      envVars.push({ scopes: ['region:fra'], key, value });
    }
    const body = {
      definition: {
        ...deploymentResponse.data.deployment.definition,
        env: envVars,
      },
    };
    const updateResponse = await axios.patch(`https://app.koyeb.com/v1/services/${serviceId}`, body, axiosConfig);
    if (updateResponse.status === 200) {
      return `_*Successfully changed var ${key}:${value}*_`;
    } else {
      return '_Please put Koyeb api key in var KOYEB_API._\nEg: KOYEB_API:api key';
    }
  } catch (error) {
    return `_Error changing env var: ${error}_`;
  }
};

async function herokuRestart(message) {
  try {
    await heroku.delete(baseURI + "/dynos");
    return true;
  } catch (error) {
    return await message.send(`HEROKU : ${error.body.message}`);
  }
};

async function renderRestart() {
    try {
        const service = await getAppId(); 
        if (!service) return false;
        const response = await axiosInstance.post(`/services/${service}/restart`);
        await new Promise((resolve) => pm2.stop('jarvis-md', resolve));        
        return true; 
    } catch (error) {
        console.error('Error restarting the service:', error.response ? error.response.data : error.message);
        throw error;
    }
};

async function updateDeploy(options) {
    try {
        const service = await getAppId();
        if (!service) return false;
        const response = await axiosInstance.post(`/services/${service}/deploys`, { options });
        return true;
    } catch (error) {
        console.error('Error deploying the service:', error.response ? error.response.data : error.message);
        throw error; 
    }
};

async function setEnv(variableName, value) {
    const appId = await getAppId();
    if (!appId) return false;
    const payload = [
        {
            key: variableName,
            value: value
        }
    ];
    try {
        const response = await axiosInstance.put(`/services/${appId}/env-vars`, payload);
        await updateDeploy('do_not_clear');
        await new Promise((resolve) => pm2.stop('jarvis-md', resolve));
        return true;
    } catch (error) {
        console.error('Error setting variable:', error.response ? error.response.data : error.message);
        throw error;
    }
};

async function delEnv(variableName) {
    const appId = await getAppId();
    if (!appId) return false;

    try {
        const response = await axiosInstance.delete(`/services/${appId}/env-vars/${variableName}`);
        await updateDeploy('do_not_clear');
        await new Promise((resolve) => pm2.stop('jarvis-md', resolve));
        return true; 
    } catch (error) {
        console.error('Error deleting variable:', error.response ? error.response.data : error.message);
        throw error;
    }
};

async function fetchDynoInfo() {
    try {
        const { data: { id } } = await axios.get("https://api.heroku.com/account", {
            headers: {
                Authorization: `Bearer ${Config.HEROKU_API_KEY}`,
                Accept: "application/vnd.heroku+json; version=3"
            }
        });

        const { data: quotaData } = await axios.get(`https://api.heroku.com/accounts/${id}/actions/get-quota`, {
            headers: {
                Authorization: `Bearer ${Config.HEROKU_API_KEY}`,
                Accept: "application/vnd.heroku+json; version=3.account-quotas"
            }
        });

        const totalQuota = quotaData.account_quota / 3600; 
        const quotaUsed = quotaData.quota_used / 3600; 
        const remainingQuota = totalQuota - quotaUsed;
        const percentageUsed = ((quotaUsed / totalQuota) * 100).toFixed(2);

        return `\`\`\`Eco Dynos Plan\nTotal Quota   : ${totalQuota.toFixed(2)} hours\nUsed Quota    : ${quotaUsed.toFixed(2)} hours (${percentageUsed}%)\nRemaining     : ${remainingQuota.toFixed(2)} hours\`\`\``;
    } catch (error) {
        return "Error fetching Heroku quota:", error.message;
    }
};

module.exports = { setVar, changeEnv, herokuRestart, updateDeploy, delEnv, setEnv, renderRestart, fetchDynoInfo };

