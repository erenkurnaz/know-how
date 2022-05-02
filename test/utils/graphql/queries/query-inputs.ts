import * as QUERIES from './index';

interface QueryInputs {
  POST_QUERY: {
    id: string;
  };
  POSTS_BY_USER_ID_QUERY: {
    userId: string;
  };
}
export type QueryInput<Q> = Q extends keyof QueryInputs ? QueryInputs[Q] : null;
