<?php

namespace App\Http\Middleware;

use App\Models\SuperAdminModule\ClientTenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class checkSubDomain
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost();

        // a1.pos.hehe.com -> a1
        $subdomain = explode('.', $host)[0];

        $tenant = ClientTenant::where('subdomain', $subdomain)->first();

        if (!$tenant) {
            abort(404, 'Tenant not found');
        }

        // store tenant globally
        app()->instance('tenant', $tenant);

        return $next($request);
    }
}
