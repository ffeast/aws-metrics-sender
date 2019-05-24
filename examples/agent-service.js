const Service = require('node-windows').Service;

const env = [
    {
        name: 'AGENT_AWS_REGION',
        value: 'eu-west-1'
    },
    {
        name: 'AGENT_METRICS',
        value: 'C:\\Somewhere\\metrics.txt'
    },
    {
        name: 'AGENT_NAMESPACE',
        value: 'Test'
    },
    {
        name: 'AWS_ACCESS_KEY_ID',
        value: 'YOUR_ACCESS_KEY'
    },
    {
        name: 'AWS_SECRET_ACCESS_KEY',
        value: 'YOUR_SECRET_KEY'
    }
];

const svc = new Service({
  name: 'aws-metrics-sender',
  description: 'AWS custom metrics sender',
  script: 'aws-metrics-sender',
  env: env
});

svc.on('install',function() {
  svc.start();
});

svc.install();
