const Service = require('node-windows').Service;
const yargs = require('yargs');
const env = [
    {
        name: 'AGENT_AWS_REGION',
        value: 'eu-west-1'
    },
    {
        name: 'AGENT_METRICS',
        value: 'C:\\Somewhere\\metrics1.txt C:\\Somewhere\\metrics2.txt'
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

const scriptPath = require.resolve('aws-metrics-sender');
const service = new Service({
    name: 'aws-metrics-sender',
    description: 'AWS custom metrics sender',
    script: scriptPath,
    env: env
});
service.on('install',function() {
    console.log('Installation complete');
    service.start();
    console.log('Service started');
});
service.on('uninstall', function() {
    console.log('Uninstall complete');
});

const argv = yargs
    .command('install', 'Install the service', {}, () => {
        service.install();
    })
    .command('uninstall', 'Uninstall the service', {}, () => {
        service.uninstall();
    })
    .demandCommand()
    .locale('en')
    .help()
    .alias('help', 'h')
    .argv;
