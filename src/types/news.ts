/** One article from the CryptoCompare news feed. */
export interface NewsArticle {
  id: string;
  title: string;
  body: string;
  url: string;
  source: string;
  imageUrl: string;
  publishedAt: number;
  tags: string;
  categories: string;
}

export interface NewsResponse {
  Data: Array<{
    id: string;
    title: string;
    body: string;
    url: string;
    source: string;
    imageurl: string;
    published_on: number;
    tags: string;
    categories: string;
  }>;
}
