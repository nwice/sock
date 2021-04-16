import AWS from 'aws-sdk';
import fs from 'fs';
import { exit } from 'process';
AWS.config.update({ region: 'us-east-1' });
const s3 = new AWS.S3();

const bucket = 'powder.network'

const s3props = {
    ACL: 'public-read',
    ContentType: 'application/json',
}

const s3path = (path) => { 
    return {
        Key: path,
        Bucket: bucket,
    }
}

const getversion = async (path, version) => {  
    let versionpath = path.substring(0, path.length - 5) + `/${version}.json`
    let data = await s3.getObject(s3path(versionpath)).promise()
    let data_string = await data.Body.toString();
    return JSON.parse(data_string)
}

const getcurrent = async (path) => {  
    let current = { version: 0 }
    try {
        let data = await s3.getObject(s3path(path)).promise()
        let data_string = await data.Body.toString();
        current.json = JSON.parse(data_string)
        try {
            current.version = parseInt(data.WebsiteRedirectLocation.split('/').pop().split('.')[0]);
        } catch (err) {}        
    } catch (err) { 
        console.log('no previous:', path) 
    }
    return current
}

const versioning = async (o, path, conditional) => {
    let out = JSON.stringify(o, null, 2)
    let localpath = 'public/' + path
    let dirpath = localpath.substring(0, localpath.lastIndexOf('/') + 1)
    await fs.promises.mkdir(dirpath, { recursive: true });    
    fs.writeFileSync(localpath, out)          
    let current = await getcurrent(path)
    if ( !conditional || !current.json || conditional(o, current.json) ) {
        let next_version_location = s3path(path).Key.substring(0, s3path(path).Key.length - 5).concat(`/${current.version + 1}.json`)      
        console.log('new version location:', next_version_location)
        s3.upload(Object.assign({}, s3props, s3path(path), {        
            Body: out,
            WebsiteRedirectLocation: '/' + next_version_location
        })).promise();        
        s3.upload(Object.assign({}, s3props, s3path(path), {        
            Body: out,
            Key: next_version_location,
        })).promise();    
    }
}

export { versioning, getcurrent, getversion }