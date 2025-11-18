#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { SampleLambdaTenantIsolationStack } = require('../lib/sample-lambda-tenant-isolation-stack');

const app = new cdk.App();

const st = new SampleLambdaTenantIsolationStack(app, 'SampleLambdaTenantIsolationStack');
