// AWS Cognito Configuration
export const awsConfig = {
  aws_project_region: process.env.NEXT_PUBLIC_AWS_REGION,
  aws_cognito_region: process.env.NEXT_PUBLIC_AWS_REGION,
  aws_user_pools_id: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID,
  aws_user_pools_web_client_id: process.env.NEXT_PUBLIC_AWS_CLIENT_ID,
  aws_cognito_identity_pool_id: process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID,
};

export const authConfig = {
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID,
  userPoolWebClientId: process.env.NEXT_PUBLIC_AWS_CLIENT_ID,
};