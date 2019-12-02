const got=require('got');
const GitUrlParse=require('git-url-parse');
const {getBlockListFromGit,fetchBlockList,fetchUmiBlock}=require('umi-build-dev/lib/plugins/commands/block/util');

async function getData(){
    //http://192.168.1.250/frontends-group/ifactory-blocks.git
    let gitUrl='http://192.168.1.250/frontends-group/ifactory-blocks.git';
    const { name, owner, resource } = GitUrlParse(gitUrl);
    console.log(name,owner)
    let url=`https://api.github.com/repos/${owner}/${name}/git/trees/master`;
    let d=await got(url);

    console.log(d);
}
async function getData2(){
    //http://192.168.1.250/frontends-group/ifactory-blocks.git
    let gitUrl='http://192.168.1.250/frontends-group/ifactory-blocks.git';

    let d=await getBlockListFromGit(gitUrl,false);
    console.log(d)
}
getData2();
