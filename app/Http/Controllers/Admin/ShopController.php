<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Shop;
use Illuminate\Http\Request;

class ShopController extends BasicController
{
    public $model = Shop::class;
    public $reactView = 'Admin/Shops';
    public $imageFields = ['logo'];
}
