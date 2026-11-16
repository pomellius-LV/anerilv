// Cloudflare Pages Function: Cloudflare Access Identity Check (v1.13)
// GET, POST /api/admin/auth
// Validates cryptographic signature and claims of Cloudflare Access JWT
import { validateCloudflareAccessRequest, Env } from '../_middleware';

export const onRequestGet = async (context: {
  request: Request;
  env: Env;
  data?: Record<string, unknown>;
}) => {
  const { request, env, data } = context;

  // If already authenticated by middleware, we have verified data
  let email = data?.adminEmail as string | undefined;

  if (!email) {
    const auth = await validateCloudflareAccessRequest(request, env);
    if (!auth.authorized) {
      return new Response(
        JSON.stringify({
          ok: false,
          authenticated: false,
          error: auth.error,
          email: auth.email || null,
        }),
        {
          status: auth.status || 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    email = auth.email;
  }

  return new Response(
    JSON.stringify({
      ok: true,
      authenticated: true,
      user: {
        email: email,
        role: 'owner',
        accessProvider: 'Cloudflare Access Zero Trust (RS256 Verified)'
      }
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};

export const onRequestPost = async (context: {
  request: Request;
  env: Env;
  data?: Record<string, unknown>;
}) => {
  return onRequestGet(context);
};
