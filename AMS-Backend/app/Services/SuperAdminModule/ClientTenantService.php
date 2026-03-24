<?php

namespace App\Services\SuperAdminModule;

use App\Exceptions\ClientTenantNotFound;
use App\Models\SuperAdminModule\ClientTenant;

class ClientTenantService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function getBySubDomain(string $subdomain): ?ClientTenant
    {
        $res = ClientTenant::where('subdomain', $subdomain)->first();
        if(!$res) {
            throw new ClientTenantNotFound();
        }
        return $res;
    }
}
