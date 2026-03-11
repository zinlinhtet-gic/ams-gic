<?php

namespace App\Models\SuperAdminModule;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class ClientTenant extends Model
{
    protected static function booted()
    {
        static::addGlobalScope('tenant', function (Builder $builder) {

            if (app()->bound('tenant')) {
                $builder->where(
                    'tenant_id',
                    app('tenant')->id
                );
            }

        });
    }
}
