// @ts-nocheck
export const handler = async (event: any) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { content, message } = JSON.parse(event.body || '{}');
    
    // Get GitHub token from environment variables
    const githubToken = process.env.GITHUB_TOKEN;
    const githubRepo = process.env.GITHUB_REPO || 'arminjamak/portfolio';
    const githubBranch = process.env.GITHUB_BRANCH || 'main';
    
    if (!githubToken) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'GitHub token not configured' }),
      };
    }

    // Get the current file SHA
    const getFileResponse = await fetch(
      `https://api.github.com/repos/${githubRepo}/contents/public/data.json?ref=${githubBranch}`,
      {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    let sha: string | undefined;
    if (getFileResponse.ok) {
      const fileData = await getFileResponse.json();
      sha = fileData.sha;
    }

    // Commit the updated content
    const commitResponse = await fetch(
      `https://api.github.com/repos/${githubRepo}/contents/public/data.json`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message || 'Update content from admin panel',
          content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
          branch: githubBranch,
          ...(sha && { sha }),
        }),
      }
    );

    if (!commitResponse.ok) {
      const error = await commitResponse.json();
      console.error('GitHub API error:', error);
      return {
        statusCode: commitResponse.status,
        body: JSON.stringify({ error: 'Failed to commit to GitHub', details: error }),
      };
    }

    const result = await commitResponse.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        commit: result.commit,
      }),
    };
  } catch (error) {
    console.error('Error updating content:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
