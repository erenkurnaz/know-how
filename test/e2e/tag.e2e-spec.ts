import { clearDatabase } from '../utils/helpers/app.helper';
import { GqlBuilder } from '../utils/graphql';

describe('Tags', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it('should return all tags', async () => {
    const { data: tags } = await new GqlBuilder()
      .setQuery('TAGS_QUERY', null)
      .execute();

    expect(tags).toEqual([]);
  });
});
