<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->group(function () {
    // Define your admin-specific routes here
    // For example:
    // Route::get('/dashboard', [AdminDashboardController::class, 'index']);
});

Route::prefix('api')->group(function () {
    Route::middleware('subdomain')->group(function () {
        // Define your tenant-specific routes here
        // For example:
        // Route::get('/dashboard', [DashboardController::class, 'index']);
    });
});

