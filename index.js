#!/usr/bin/env node

const os = require('os');
const fs = require('fs');
const readline = require('readline');
const stream = require('stream');
const path = require('path');

const AWS = require('aws-sdk');
const yargs = require('yargs');
const tail = require('tail');

const JSON_SPACES = 4;
const MILLISECONDS_MULTIPLIER = 1000;

const argv = yargs
    .option('metrics', {
        description: 'Path to the metrics files',
        required: true,
        default: process.env.AGENT_METRICS,
        type: 'array'
    })
    .option('aws-region', {
        description: 'AWS region',
        required: true,
        default: process.env.AGENT_AWS_REGION,
        type: 'string'
    })
    .option('server', {
        description: 'Server id to be sent to cloudwatch',
        required: false,
        default: process.env.AGENT_SERVER || os.hostname(),
        type: 'string'
    })
    .option('separator', {
        description: 'Record items separator',
        required: false,
        default: process.env.AGENT_SEPARATOR || ':',
        type: 'string'
    })
    .option('namespace', {
        description: 'Namespace to use',
        default: process.env.AGENT_NAMESPACE,
        required: true,
        type: 'string'
    })
    .option('verbose', {
        description: 'Be verbose',
        alias: 'v',
        type: 'boolean',
        default: process.env.AGENT_VERBOSE || false
    })
    .locale('en')
    .help()
    .alias('help', 'h')
    .argv;

let cloudwatch = new AWS.CloudWatch({region: argv['aws-region']});

for (let metric of argv.metrics) {
    const tracker = new tail.Tail(metric, {follow: true});
    const source = path.basename(metric);
    tracker.on('line', (line) => {
        let [timestamp, key, val] = line.split(argv.separator, 3);
        let metricsData = {
            Namespace: argv.namespace,
            MetricData: [
                {
                    MetricName: key,
                    Timestamp: new Date(timestamp * MILLISECONDS_MULTIPLIER),
                    Dimensions: [{
                        Name: 'Server',
                        Value: argv.server
                    }, {
                        Name: 'Source',
                        Value: source
                    }],
                    Value: Number(val)
                }
            ]
        };
        if (argv.verbose) {
            console.info(
                'caught event:',
                JSON.stringify(metricsData, null, JSON_SPACES));
        }
        cloudwatch.putMetricData(metricsData, (err, data) => {
            if (err) {
                console.error('%s: %s', err, line);
            } else if (argv.verbose) {
                console.info('ok sent');
            }
        });
    });

    tracker.on('error', (error) => {
        console.error('unable to read from %s: %s', argv.metrics, error);
        tracker.unwatch();
    });
}

if (argv.verbose) {
    console.info('listening on %s', argv.metrics);
}
