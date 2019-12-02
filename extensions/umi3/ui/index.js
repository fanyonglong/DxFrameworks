
const path = require('path');
const { readdir } = require('fs');
const { Gitlab } = require('gitlab');

module.exports = function (api, { root, blockUrl, token, branch, per_page = 100, repositorieId = 14 }) {
  let { log: { debug } } = api;
  let DATA_TYPES = {

    BLOCK: 'blocks',
    TEMPLATE: "templates"
  }
  let url = new URL(blockUrl);
  const gitLabApi = new Gitlab({
    host: url.origin,
    token: token
  });

  async function readGitData(path) {
    try {
      let result = []
      let data = await gitLabApi.Repositories.tree(repositorieId, {
        ref: branch,
        path: path,
        per_page
      });

      for (let d of data) {
        if (d.type.toLowerCase() !== 'tree') {
          continue;
        }
        try {
          let pkg = await gitLabApi.RepositoryFiles.showRaw(repositorieId, `${d.path}/package.json`, branch);
          pkg = JSON.parse(pkg);
          let item = {
            ...pkg.uiConfig,
            url: `${blockUrl}/tree/${branch}/${d.path}`
          };
          result.push(item);
        } catch (e) {

        }
      }
      return result;
    } catch (e) {
      return []
    }
  }
  async function readData(name) {
    try {
      let dir = path.join(root, name);
      let data = await new Promise((resolve, reject) => {
        readdir(dir, (error, modules) => {
          if (error) {
            reject();
            return;
          }
          modules = modules.filter(name => !name.startsWith('.'));
          modules = modules = modules.map(name => {
            let package = require(path.join(dir, name, 'package.json'));
            return package.uiConfig;
          }).filter(d => d !== undefined).map(data => ({ ...data }));
          resolve(modules);
        });
      })
      return data;
    } catch (e) {
      return [];
    }
  }
  async function getData(type) {
    try {
      const data = await readGitData(type)
      return {
        data: data,
        success: true,
      };
    } catch (error) {
      return {
        message: error.message,
        data: undefined,
        success: false,
      };
    }
  }


  api.addBlockUIResource([
    {
      id: 'ifactory-template',
      name: 'IFactory-Template',
      resourceType: 'custom',
      description: '基于 antd 的中台模板。',
      blockType: 'template',
      icon: 'https://img.alicdn.com/tfs/TB1e8gomAL0gK0jSZFAXXcA9pXa-64-64.png',
      getData: () => getData(DATA_TYPES.TEMPLATE),
    },
    {
      id: 'ifactory-block',
      name: 'IFactory-Block',
      resourceType: 'custom',
      description: '来自 antd 的 Demo 区块',
      blockType: 'block',
      icon: 'https://img.alicdn.com/tfs/TB1e8gomAL0gK0jSZFAXXcA9pXa-64-64.png',
      getData: () => getData(DATA_TYPES.BLOCK),
    }
  ])
}
