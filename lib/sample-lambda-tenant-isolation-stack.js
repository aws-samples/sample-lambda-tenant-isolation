const { Stack, CfnOutput } = require('aws-cdk-lib');
const ApiGw = require('aws-cdk-lib/aws-apigateway');
const Lambda = require('aws-cdk-lib/aws-lambda');
const Logs = require('aws-cdk-lib/aws-logs');

class SampleLambdaTenantIsolationStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Authorizer
    const authorizerFn = new Lambda.Function(this, 'AuthorizerFn', {
      runtime: Lambda.Runtime.NODEJS_22_X,
      memorySize: 512,
      handler: 'index.handler',
      code: Lambda.Code.fromAsset('./src/authorizer'),
      environment: {
        JWT_SIGNATURE_SECRET: 'super-secret-hs256-token-signing-key'
      }
    });

    const fn = Lambda.Function.fromFunctionName(this, 'LambdaFunction', 'sample-lambda-tenant-isolation');

    const apiLogGroup = new Logs.LogGroup(this, 'Api')

    const restApi = new ApiGw.RestApi(this, 'RestApi', {
      restApiName: 'sample-multi-tenant-api',
    });

    const authorizer = new ApiGw.TokenAuthorizer(this, 'Authorizer', {
      handler: authorizerFn
    });

    const requestValidator = new ApiGw.RequestValidator(this, 'RequestValidator', {
      restApi,
      requestValidatorName: 'required-header-validator',
      validateRequestBody: true,
      validateRequestParameters: true
    })

    const lambdaIntegration = new ApiGw.LambdaIntegration(fn, {
      requestParameters: {
        'integration.request.header.X-Amz-Tenant-Id': 'context.authorizer.tenantId'
      }
    });

    restApi.root.addMethod('GET', lambdaIntegration, {
      requestValidator,
      authorizer
    });

  }
}

module.exports = { SampleLambdaTenantIsolationStack }
