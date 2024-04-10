import { Injectable } from '@angular/core';
import S3 from 'aws-sdk/clients/s3';
import { HttpClient } from '@angular/common/http';


enum APIEndPointUrls {
  nodeAPIURL = 'https://api.agentonline.io/v1/',
  getVideos = 'aws/getVideos/agent/',
}
@Injectable({
  providedIn: 'root'
})
export class UploadAwsService {

  constructor(private http: HttpClient) { }
  fileUpload(agentId, folderPath, file, name, type) {
    const contentType = type;
    const bucket = new S3(
      {
        accessKeyId: 'AKIAI4ZTGWQXPNQWNPAQ',
        secretAccessKey: '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',
        region: 'ca-central-1',

      }
    );
    const params = {
      Bucket: 'fiapps',
      Key: `Agents/${agentId}/${folderPath}/${name}`,
      Body: file,
      ACL: 'public-read',
      ContentType: contentType
    };
    return bucket.upload(params, function (err, data) {
      if (err) {
        console.log('EROOR: ', JSON.stringify(err));
        return false;
      }
      console.log('File Uploaded.', data);
      return true;
    });
  }
  getLibraryVideos(agentID) {
    return this.http.get(APIEndPointUrls.nodeAPIURL + APIEndPointUrls.getVideos + agentID);
  }
}
