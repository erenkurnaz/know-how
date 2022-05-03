interface QueryInputs {
  POST_QUERY: {
    id: string;
  };
  POSTS_BY_USER_ID_QUERY: {
    userId: string;
  };
  POST_SEARCH_QUERY: {
    keyword: string;
  };
}
export type QueryInput<Q> = Q extends keyof QueryInputs ? QueryInputs[Q] : null;
