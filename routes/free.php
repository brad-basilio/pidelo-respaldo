<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\RemainingHistoryController;
use Illuminate\Support\Facades\Route;

Route::get('/remainings-history', [RemainingHistoryController::class, 'set']);
// Route::post('/clients', [ClientController::class, 'save']);
