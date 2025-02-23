export interface TweetInterface {
  text: string;
  username: string;
  at: string;
  created_at: string;
  image: string | undefined;
  replies: number | null;
  retweets: number | null;
  likes: number | null;
  views: number | null;
  liked: boolean;
  id: number;
  index: number;
}

export interface BtnRefs {
  more: HTMLButtonElement | null;
  reply: HTMLButtonElement | null;
  retweet: HTMLButtonElement | null;
  like: HTMLButtonElement | null;
  view: HTMLButtonElement | null;
  bookmark: HTMLButtonElement | null;
  share: HTMLButtonElement | null;
  link: HTMLDivElement | null;
}
