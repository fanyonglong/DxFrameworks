const got=require('got');
const GitUrlParse=require('git-url-parse');
const sequest=require('sequest');
const fs=require('fs');
const {Gitlab}=require('gitlab');
const {request}=require('http');
const querystring=require('querystring')
const {getBlockListFromGit,fetchBlockList,fetchUmiBlock}=require('umi-build-dev/lib/plugins/commands/block/util');

//console.log(new URL('http://192.168.1.250/api/v4/projects/14/repository').host)
const api = new Gitlab({
    host: 'http://192.168.1.250',
    token: 'ah1nY6N7tgy2aykA8rLH',
});
//nodeRequest();
function nodeRequest(){
    let params={
        private_token:'ah1nY6N7tgy2aykA8rLH',
        path:'blocks',
        ref:'develop'
    }
    params=querystring.stringify(params);
    let url=`http://192.168.1.250/api/v4/projects/14/repository/tree?${params}`;
    let result='';
    let req=request(url,(res)=>{
 
        console.log(`状态码: ${res.statusCode}`);
        res.setEncoding('utf8');
        res.on('data',(data)=>{
            result+=data;
        })
        res.on('end',()=>{
            console.log(JSON.parse(result));
           // res.end();
        })
    });
    req.end();
}
function testGitlabAPI(){
    //http://192.168.1.250/api/v4/projects/14/repository/tree?private_token=ah1nY6N7tgy2aykA8rLH&ref=develop&path=blocks
    api.Repositories.tree(14,{
        ref:'develop',
        path:'blocks'
    }).then(d=>{
        console.log(d[0].path)
        //http://192.168.1.250/api/v4/projects/14/repository/files/blocks%2Fexmaple%2Fpackage.json/raw?ref=develop&private_token=ah1nY6N7tgy2aykA8rLH
        return api.RepositoryFiles.showRaw(14,`${d[0].path}/package.json`,'develop');
    }).then(d=>{
        console.log(JSON.parse(d).uiConfig)
    }).catch(d=>{
        console.log('error')
    })
}
testGitlabAPI();
function base64(str){
    return Buffer.from(str).toString('base64');
}
function getSSHData(){
    var key = fs.readFileSync(process.env.HOME + '/.ssh/id_rsa')
    sequest('ssh://git@192.168.1.250:10022/frontends-group/ifactory-blocks.git',{

    }, function (e, stdout) {
        if (e) throw e
        console.log(stdout.split('\n'))
      })
}
//getTokenData()
async function getTokenData(){
    const searchParams = new URLSearchParams([['private_token','ah1nY6N7tgy2aykA8rLH'],['ref', 'develop'], ['path', 'blocks']]);
    console.log(searchParams+'')
    let url=`http://192.168.1.250/api/v4/projects/14/repository/tree`;
    let d= await got(url,{
       // responseType:'json',
       method:'GET',
       searchParams
    });
    console.log(d.body)
}
async function getData(){
    //http://192.168.1.250/frontends-group/ifactory-blocks.git
    let gitUrl='http://192.168.1.250/frontends-group/ifactory-blocks';
    const { name, owner, resource } = GitUrlParse(gitUrl);
    console.log(name,owner)
    //    let url=`http://192.168.1.250/frontends-group/ifactory-blocks/tree/develop`;
    let url='ssh://git@192.168.1.250:10022/frontends-group/ifactory-blocks.git';
    let d= await got(url);

    console.log(d.body);
}
async function getData2(){
    //http://192.168.1.250/frontends-group/ifactory-blocks.git
    let gitUrl='http://192.168.1.250/frontends-group/ifactory-blocks/tree/develop';

    let d=await getBlockListFromGit(gitUrl,false);
    console.log(d)
}
//getData();
//getSSHData();
