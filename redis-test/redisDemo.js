const redis = require('redis');

const client = redis.createClient();

client.on('connect', () => {
  console.log('Redis client connected');
});


client.on('error', (err) => {
  console.log('Something went wrong ', err);
});


client.set('test1', 'value1', redis.print);
client.get('test1', (err, result) => {
  if (err) {
    console.log(err);
  }
  console.log('GET result: ', result);
});
