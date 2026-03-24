<?php

namespace App\Http\Middleware;

use App\Exceptions\ClientTenantNotFound;
use App\Models\SuperAdminModule\ClientTenant;
use App\Services\SuperAdminModule\ClientTenantService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class checkSubDomain
{
    private ClientTenantService $clientTenantService;
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $tenantHost = $request->header('X-Tenant-Host');

        if (!$tenantHost) {
            abort(400, 'Tenant host missing');
        }

        $subdomain = $tenantHost;
        try{
            $tenant = $this->clientTenantService->getBySubDomain($subdomain);
        }
        catch (ClientTenantNotFound $e) {
            abort(404, $e->getMessage());
        }


        // store tenant globally
        app()->instance('tenant', $tenant);

        return $next($request);
    }
}
