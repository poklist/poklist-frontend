import { contractPathToRegExp, isStatusWhitelist } from '@/api/whitelist';
import { describe, expect, it } from 'vitest';

describe('contractPathToRegExp', () => {
  it('matches a static path exactly', () => {
    const re = contractPathToRegExp('/publish/limits/lists');
    expect(re.test('/publish/limits/lists')).toBe(true);
    expect(re.test('/publish/limits/listsX')).toBe(false);
    expect(re.test('/publish/limits')).toBe(false);
  });

  it('matches a single dynamic segment', () => {
    const re = contractPathToRegExp('/lists/:listID');
    expect(re.test('/lists/100')).toBe(true);
    expect(re.test('/lists/abc-def')).toBe(true);
    expect(re.test('/lists/100/order')).toBe(false);
    expect(re.test('/lists/')).toBe(false);
  });

  it('matches a leading dynamic segment', () => {
    const re = contractPathToRegExp('/:userCode/lists');
    expect(re.test('/usera/lists')).toBe(true);
    expect(re.test('/usera/lists/100')).toBe(false);
  });

  it('matches a dynamic segment followed by a static segment', () => {
    const re = contractPathToRegExp('/lists/:listID/order');
    expect(re.test('/lists/100/order')).toBe(true);
    expect(re.test('/lists/100/reorder')).toBe(false);
  });

  it('escapes regex metacharacters in static segments', () => {
    const re = contractPathToRegExp('/a.b/c');
    expect(re.test('/a.b/c')).toBe(true);
    expect(re.test('/aXb/c')).toBe(false); // '.' 必須被跳脫
  });
});

describe('isStatusWhitelist', () => {
  it('silences 403 on the list endpoint', () => {
    expect(isStatusWhitelist('GET', '/lists/100', 403)).toBe(true);
  });

  it('is case-insensitive on method', () => {
    expect(isStatusWhitelist('get', '/lists/100', 403)).toBe(true);
  });

  it('does not silence other statuses', () => {
    expect(isStatusWhitelist('GET', '/lists/100', 404)).toBe(false);
  });

  it('does not silence other paths', () => {
    expect(isStatusWhitelist('GET', '/usera/info', 403)).toBe(false);
  });
});
