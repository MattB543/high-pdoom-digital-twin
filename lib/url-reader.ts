/**
 * URL detection and content extraction using Jina Reader API
 */

const URL_REGEX = /(https?:\/\/[^\s]+)/gi;

/**
 * Extracts all URLs from a text string
 */
export function extractUrls(text: string): string[] {
  const matches = text.match(URL_REGEX);
  return matches || [];
}

/**
 * Fetches webpage content as markdown using Jina Reader API
 * @param url - The URL to fetch
 * @returns Markdown content or error message
 */
export async function fetchUrlAsMarkdown(url: string): Promise<string> {
  try {
    const response = await fetch(`https://r.jina.ai/${url}`, {
      headers: {
        'Accept': 'text/plain',
      },
    });

    if (!response.ok) {
      throw new Error(`Jina API failed with status: ${response.status}`);
    }

    const markdown = await response.text();

    // Truncate if too long (to avoid overwhelming the context)
    const maxLength = 8000;
    const truncated = markdown.length > maxLength
      ? markdown.slice(0, maxLength) + '\n\n[Content truncated due to length...]'
      : markdown;

    return `\n\n---\n**Content from URL: ${url}**\n\n${truncated}\n---\n`;
  } catch (error) {
    console.error(`Failed to fetch URL ${url}:`, error);
    return `\n\n[Failed to fetch content from ${url}]\n`;
  }
}

/**
 * Processes a message, detecting URLs and fetching their content
 * @param content - The original message content
 * @returns Enhanced message with URL content appended
 */
export async function processMessageWithUrls(content: string): Promise<string> {
  const urls = extractUrls(content);

  if (urls.length === 0) {
    return content;
  }

  // Fetch all URLs in parallel
  const urlContents = await Promise.all(
    urls.map(url => fetchUrlAsMarkdown(url))
  );

  // Append all fetched content to the original message
  const enhancedContent = content + '\n\n' + urlContents.join('\n');

  return enhancedContent;
}
