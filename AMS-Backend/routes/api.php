<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::domain('admin.'.parse_url(config('app.url'), PHP_URL_HOST))->group(function () {
    // Define your admin-specific routes here
    // For example:
    // Route::get('/dashboard', [AdminDashboardController::class, 'index']);
});

Route::domain('{tenant}.'.parse_url(config('app.url'), PHP_URL_HOST))->group(function () {
    Route::middleware('subdomain')->group(function () {
        // Define your tenant-specific routes here
        // For example:
        // Route::get('/dashboard', [DashboardController::class, 'index']);
    });
});

