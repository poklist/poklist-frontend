import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { getState, MockList, resetState } from './state';

// 「已登入」= 帶 Authorization header。不驗簽 —— E2E 的假 token 只需存在即可。
// 這一分歧正是重現 SSR hydration 匿名汙染的關鍵：Server Component 不帶 token。
// The real axios interceptor (src/api/axios.ts) sets `Authorization: Bearer ${accessToken}`
// unconditionally, even when logged out and accessToken is ''. That means a logged-out
// browser still sends a truthy `Authorization: Bearer ` header, so we can't treat mere
// presence of the header as proof of auth — we must extract the bearer token itself and
// treat an absent, empty, or whitespace-only token as unauthenticated. The header must
// also actually use the Bearer scheme (case-insensitive) — a value with no `Bearer`
// prefix at all is not valid bearer auth and must not authenticate.
const viewerOf = (req: IncomingMessage): string | null => {
  const header = req.headers.authorization ?? '';
  const match = header.match(/^Bearer\s*(.*)$/i);
  const token = match ? match[1].trim() : '';
  return token ? 'usera' : null;
};

const ok = (res: ServerResponse, content: unknown, extra: object = {}) => {
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  });
  res.end(
    JSON.stringify({ code: '0000', message: 'success', content, ...extra })
  );
};

const fail = (res: ServerResponse, status: number) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({ code: String(status), message: 'error', content: null })
  );
};

const readBody = async (
  req: IncomingMessage
): Promise<Record<string, unknown>> => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  if (chunks.length === 0) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString()) as Record<
      string,
      unknown
    >;
  } catch {
    return {};
  }
};

const listPayload = (list: MockList, viewer: string | null) => ({
  id: list.id,
  title: list.title,
  description: list.description,
  coverImage: list.coverImage,
  externalLink: list.externalLink,
  categoryID: list.categoryID,
  type: list.type,
  likeCount: list.likeCount,
  // 匿名一律 false —— 這就是汙染源，測試要驗證它不會被 hydrate 進 client cache
  isLiked: viewer ? list.likedBy.has(viewer) : false,
  createdAt: list.createdAt,
  updatedAt: list.updatedAt,
  ideaTotalCount: list.ideas.length,
  owner: {
    id: getState().users.get(list.ownerUserCode)?.id ?? 0,
    displayName: getState().users.get(list.ownerUserCode)?.displayName ?? '',
    userCode: list.ownerUserCode,
    profileImage: '',
  },
});

// 前端 axios 直接從瀏覽器打 NEXT_PUBLIC_API_BASE_URL(跨源到 :4000),
// 需要 CORS header 才能通過瀏覽器的 preflight 檢查。
const setCorsHeaders = (req: IncomingMessage, res: ServerResponse) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin ?? '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

export const createMockServer = () =>
  createServer((req, res) => {
    setCorsHeaders(req, res);
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }
    void handle(req, res);
  });

const handle = async (req: IncomingMessage, res: ServerResponse) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const path = url.pathname;
  const method = req.method ?? 'GET';
  const viewer = viewerOf(req);
  const state = getState();

  // --- 測試控制端點 ---
  if (path === '/__test__/reset' && method === 'POST') {
    resetState();
    return ok(res, null);
  }

  // --- GET /lists/:listID ---
  const listMatch = /^\/lists\/([^/]+)$/.exec(path);
  if (listMatch && method === 'GET') {
    const list = state.lists.get(listMatch[1]);
    if (!list) return fail(res, 404);
    // private list 對非擁有者回 403（匿名 SSR 也會拿到 403）
    if (list.type === 1 && viewer !== list.ownerUserCode) return fail(res, 403);

    const offset = Number(url.searchParams.get('offset') ?? 0);
    const limit = Number(url.searchParams.get('limit') ?? 3);
    return ok(
      res,
      {
        ...listPayload(list, viewer),
        ideas: list.ideas.slice(offset, offset + limit),
      },
      { offset, limit, totalElements: list.ideas.length }
    );
  }

  // --- GET /ideas?listID&offset&limit ---
  if (path === '/ideas' && method === 'GET') {
    const list = state.lists.get(url.searchParams.get('listID') ?? '');
    if (!list) return fail(res, 404);
    if (list.type === 1 && viewer !== list.ownerUserCode) return fail(res, 403);
    const offset = Number(url.searchParams.get('offset') ?? 0);
    const limit = Number(url.searchParams.get('limit') ?? 20);
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    });
    return res.end(
      JSON.stringify({
        ideas: list.ideas.slice(offset, offset + limit),
        ideaTotalCount: list.ideas.length,
      })
    );
  }

  // --- POST /ideas ---
  if (path === '/ideas' && method === 'POST') {
    if (!viewer) return fail(res, 401);
    const body = await readBody(req);
    const list = state.lists.get(String(body.listID));
    if (!list) return fail(res, 404);
    const idea = {
      id: `${list.id}-idea-new-${list.ideas.length + 1}`,
      title: String(body.title ?? ''),
      description: String(body.description ?? ''),
      coverImage: String(body.coverImage ?? ''),
      externalLink: String(body.externalLink ?? ''),
    };
    list.ideas.unshift(idea);
    return ok(res, { ...idea, listID: list.id });
  }

  // --- DELETE /ideas/:ideaID ---
  const ideaMatch = /^\/ideas\/([^/]+)$/.exec(path);
  if (ideaMatch && method === 'DELETE') {
    if (!viewer) return fail(res, 401);
    for (const list of state.lists.values()) {
      const index = list.ideas.findIndex((i) => i.id === ideaMatch[1]);
      if (index >= 0) {
        list.ideas.splice(index, 1);
        return ok(res, null);
      }
    }
    return fail(res, 404);
  }

  // --- POST /like, POST /unlike ---
  if ((path === '/like' || path === '/unlike') && method === 'POST') {
    if (!viewer) return fail(res, 401);
    const listID =
      url.searchParams.get('listID') ?? String((await readBody(req)).listID);
    const list = state.lists.get(listID);
    if (!list) return fail(res, 404);
    if (path === '/like' && !list.likedBy.has(viewer)) {
      list.likedBy.add(viewer);
      list.likeCount += 1;
    }
    if (path === '/unlike' && list.likedBy.has(viewer)) {
      list.likedBy.delete(viewer);
      list.likeCount -= 1;
    }
    return ok(res, null);
  }

  // --- POST /follow, POST /unfollow ---
  if ((path === '/follow' || path === '/unfollow') && method === 'POST') {
    if (!viewer) return fail(res, 401);
    const target = [...state.users.values()].find(
      (u) => String(u.id) === url.searchParams.get('userID')
    );
    if (!target) return fail(res, 404);
    if (path === '/follow') target.followedBy.add(viewer);
    else target.followedBy.delete(viewer);
    target.followerCount = target.followedBy.size;
    return ok(res, null);
  }

  // --- GET /publish/limits/lists, /publish/limits/ideas ---
  if (path.startsWith('/publish/limits/') && method === 'GET') {
    if (!viewer) return fail(res, 401);
    return ok(res, {
      usedCount: 2,
      limitCount: 10,
      remainingCount: 8,
      isUnlimited: false,
    });
  }

  // --- GET /:userCode/lists ---
  const userListsMatch = /^\/([^/]+)\/lists$/.exec(path);
  if (userListsMatch && method === 'GET') {
    const owner = userListsMatch[1];
    const all = [...state.lists.values()].filter(
      (l) => l.ownerUserCode === owner && (l.type === 0 || viewer === owner)
    );
    const offset = Number(url.searchParams.get('offset') ?? 0);
    const limit = Number(url.searchParams.get('limit') ?? 10);
    return ok(
      res,
      all.slice(offset, offset + limit).map((l) => ({
        id: l.id,
        title: l.title,
        description: l.description,
        coverImage: l.coverImage,
        externalLink: l.externalLink,
        categoryID: l.categoryID,
        type: l.type,
      })),
      { offset, limit, totalElements: all.length }
    );
  }

  // --- GET /:userCode/info ---
  const infoMatch = /^\/([^/]+)\/info$/.exec(path);
  if (infoMatch && method === 'GET') {
    const user = state.users.get(infoMatch[1]);
    if (!user) return fail(res, 404);
    return ok(res, {
      id: user.id,
      displayName: user.displayName,
      userCode: user.userCode,
      profileImage: user.profileImage,
      listCount: user.listCount,
      followerCount: user.followerCount,
      followingCount: user.followingCount,
      // 匿名一律 false —— follow 版的同款汙染源
      isFollowing: viewer ? user.followedBy.has(viewer) : false,
    });
  }

  return fail(res, 404);
};
