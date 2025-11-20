# Lambda Tenant Isolation Sample

This repository demonstrates how to use Lambda Tenant Isolation mode together with API Gateway

## Install
Clone this repo and use AWS CDK to provision resources in your account. Note that provisioning this stack in your account might incur costs. 

Install dependencies and deploy the CDK Stack

```bash
(cd src/authorizer && npm install)
cdk deploy
```

After successful deployment, note that REST API endpoint output, it should looks similar to this

```
https://{random-string}.execute-api.{region}.amazonaws.com/prod/
```

Use CURL, or any other HTTP client to send requests to this URL, specifying the tenant-specific `Authorization` HTTP header. 

> For simplicity, the sample CURL commands below already include two pre-generated JWTs, one for Blue tenant, another for Green tenant. These JWTs are cryptographically signed using the RS256 algorithm, public key used for token validation can be found in the Lambda Authorizer function. 
> 
> Always use designated key management services, such as [AWS Key Management Service](https://aws.amazon.com/kms/) (AWS KMS) for securely generating and storing your keys, and ensure that the [keys are rotated](https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html) periodically.  

### For BlueTenant use:
```
curl https://{random-string}.execute-api.{region}.amazonaws.com/prod/ -H 'Authorization:eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ0ZW5hbnRJZCI6IkJsdWVUZW5hbnQifQ.mEpaMKLXUwWkbXWGj9u8pa8nr0kywN9OG-wxXXPuM5FxTpHZ_4oQ17SFt3LcOJTRVIwT6tS8Caqcf1afBCY3Bhw3GVIwORYXhMNJvofDJbNjWoP90mkkCNGh7XJ0zrsXN98irayRQK6H_ulbYC27Prm6_2-4NtB6a0Hn5gjW6-b8LE8iayFVvB-GhP7mufpiN41Eg06p7_mPdk3bblIqMDoDbzlAzVVrAbDSm3I6PiYygS5sxrPcd93uozJmH-fHSDb2rMJfgUgFbT92iN7Ys76KjubLS7cPlgj-fZUX33vBiNcWfVkoUnn7JsgILJf2qEqcHGjBlsAoKzUmCS_4qw'
```

Decoded token:
```
{
  "typ": "JWT",
  "alg": "RS256"
}
{
  "tenantId": "BlueTenant"
}
```

### For GreenTenant use:
```
curl https://{random-string}.execute-api.{region}.amazonaws.com/prod/ -H 'Authorization:eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ0ZW5hbnRJZCI6IkdyZWVuVGVuYW50In0.UFIf5OB0meE0cvYjnjkrnqayRuATqlqEd-d7zM0kg7My84rCimH1t4McCgfJIwKRMU-nty6pRDBWVRXy3uC5K8gqs1MHptAx2Dw7beEzpiUatkdgJ2tjTzXMIUy5o0bfnz4xqHEJugNJNcB6GvqUYsYOTiYMioussKZwxL28xSQtaGq66AX1-1n7x6i8RqAvvLRhIC0pxWcKKj8Ek91jTEwShp12yz1Hn94pV52e9EzvxSfNRFazQ1JXH4a5DjEGOOuq6AtJ7pU4psrJLrWDzb2WXt8xCfaQSPb8Y4mUS9U_SWOlEqKDfPCgvFdGTV0mGm9LhuGHnhOczyO849g44w'
```

Decoded token:
```
{
  "typ": "JWT",
  "alg": "RS256"
}
{
  "tenantId": "GreenTenant"
}
```


## Clean up

Clean up the CDK stack once you're done to avoid undesired charges. 

```
cdk destroy
```

