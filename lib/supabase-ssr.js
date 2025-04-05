const { createServerClient, parseCookieHeader, serializeCookieHeader } = require('@supabase/ssr');

//https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=express
https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=express#create-a-client
module.exports.createSSRClient = (context) => {
    return createServerClient(process.env.ENDPOINT, process.env.PUBLIC, {
        cookies: {
            getAll() {
                return parseCookieHeader(context.req.headers.cookie ?? '')
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) =>
                    context.res.appendHeader('Set-Cookie', serializeCookieHeader(name, value, options))
                )
            },
        },
    });
};