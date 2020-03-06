const AWS = require('aws-sdk');

class Topic {
    //Create SES Client Obj
    createSNSClient() {
        return new AWS.SNS({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: 'us-east-1',
            apiVersion: '2010-12-01',
        });

    }
    checkTopicExist(topicName) {
        return new Promise((resolve, reject) => {
            try {
                const listTopics = this.createSNSClient()
                    .listTopics({})
                    .promise();

                listTopics
                    .then(data => {
                        if (data.Topics.includes(topicName)) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    })
                    .catch(err => {
                        throw err;
                    });
            } catch (e) {
                reject(e);
            }
        });
    }

    createTopic(topicName) {
        return new Promise((resolve, reject) => {
            try {
                const createTopic = this.createSNSClient()
                    .createTopic({
                        Name: topicName
                    })
                    .promise();
                createTopic
                    .then(data => {
                        console.log(`Created Topic - ${topicName}`);
                        console.log('data', data);
                        resolve(data.TopicArn);
                        //   topicARN = data.TopicArn;
                    })
                    .catch(err => {
                        throw err;
                    });
            } catch (e) {
                reject(e);
            }
        });
    }
}
module.exports = Topic;