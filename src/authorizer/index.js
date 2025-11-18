import jwt from 'jsonwebtoken';
import fs from 'fs';

const publicKey = fs.readFileSync('./public-key.pem','utf-8');

export const handler = async (event, ctx) => {
    console.log(JSON.stringify(event, null, 4));

    const principalId = "some-principal-id";
    const methodArn = event.methodArn;
    let effect = "deny";
    let tenantId = null;

    try {
        const authToken = event.authorizationToken;
        const claims = jwt.verify(authToken, publicKey, {
            algorithms: ['RS256']
        });
        
        effect = "allow";
        tenantId = claims.tenantId;
    } catch (e) {
        console.error(e);
    }

    const response = buildResponse(principalId, methodArn, effect, tenantId);
    console.log({response});
    return response;

}

function buildResponse(principalId, resource, effect, tenantId) {
    return {
        principalId,
        policyDocument: {
            Version: "2012-10-17",
            Statement: [
                {
                    Action: "execute-api:Invoke",
                    Effect: effect,
                    Resource: resource
                }
            ]
        },
        context: {
            tenantId
        }
    }

}
