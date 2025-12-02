// @ts-nocheck
export const handler = async (event: any) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { url } = event.queryStringParameters || {};
    
    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing url parameter' }),
      };
    }

    // Fetch the URL
    const response = await fetch(url);
    
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Failed to fetch: ${response.statusText}` }),
      };
    }

    // Check content type
    const contentType = response.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      // Return JSON
      const data = await response.json();
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(data),
      };
    } else if (contentType.includes('image')) {
      // Return image as base64
      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          data: `data:${contentType};base64,${base64}`,
          contentType,
        }),
      };
    } else {
      // Return text/html
      const text = await response.text();
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ data: text }),
      };
    }
  } catch (error) {
    console.error('Error fetching deployed data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
