const {PubSub} = require('@google-cloud/pubsub');

const topicNameOrId = 'projects/learning-gcp-396121/topics/topic-1';
const subscriptionName = 'projects/learning-gcp-396121/subscriptions/topic-1-sub';

const pubSubClient = new PubSub(); 
const subscription = pubSubClient.subscription(subscriptionName);

async function publishMessage(data) {
    const dataBuffer = Buffer.from(data);
    try {
      const messageId = await pubSubClient
        .topic(topicNameOrId)
        .publishMessage({data: dataBuffer});
      console.log(`Message ${messageId} published.`);
      return true;
    } catch (error) {
        console.error(`Received error while publishing: ${error.message}`);  
        return false;
    }
  }

 exports.subscription = subscription;
 exports.publishMessage = publishMessage;
