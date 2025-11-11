// Debug function to check environment variables
export const handler = async (event: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      siteId: process.env.NETLIFY_SITE_ID || 'Not found',
      url: process.env.URL || 'Not found',
      deployUrl: process.env.DEPLOY_URL || 'Not found',
      hasBlobs: !!process.env.NETLIFY_BLOBS_TOKEN,
      env: Object.keys(process.env).filter(key => key.includes('NETLIFY')),
    }),
  };
};
