const AWS= require('aws-sdk');

const uploadToS3 = (data, filename) => {
    const BUCKET_NAME = 'expensetracker369';
    const IAM_USER_KEY = 'AKIA6C54ACFGRHL2EOAH';
    const IAM_USER_SECRED = 'YosTQA1exV6LDMW/YfnIB1O0eSZW3+nh6Y+AnI+1';  
 
 let s3Bucket = new AWS.S3( {
     accessKeyId: IAM_USER_KEY,
     secretAccessKey:IAM_USER_SECRED
 })
 
     const params = {
         Bucket: BUCKET_NAME,
         Key : filename,
         Body:data,
         ACL:'public-read'
     }
     return new Promise((resolve,reject) => {
         s3Bucket.upload(params, (err, s3response) => {
             if(err) {
                 console.log('something went wrong',err);
                 reject(err);
             } else {
                 console.log('success',s3response);
                  resolve(s3response.Location);
             }
         })
     })                                                                                                          
 }

 module.exports = {uploadToS3};