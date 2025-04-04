<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Faq;
use App\Models\General;
use App\Models\Post;
use App\Models\System;
use App\Models\SystemColor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use SoDe\Extend\Crypto;
use SoDe\Extend\File;
use SoDe\Extend\JSON;
use Illuminate\Support\Facades\Schema;

class SystemController extends BasicController
{
    public $model = System::class;
    public $reactView = 'System';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        $path = $request->server('REQUEST_URI') ?? '/';
        $pages = JSON::parse(File::get(storage_path('app/pages.json')));
        $components = JSON::parse(File::get(storage_path('app/components.json')));

        $props = [
            'pages' => $pages,
            'systems' => [],
            'params' => []
        ];

        if ($path === '/base-template') {
            $props['systems'] = System::whereNull('page_id')->get();
            $props['page'] = ['name' => 'Template base'];
            $this->reactData = $props['page'];
            $this->reactData['colors'] = SystemColor::all();
            $generals = [];
            foreach ($props['systems'] as $system) {
                if ($system->component == 'content') continue;
                $parent = collect($components)->firstWhere('id', $system->component);
                $component = collect($parent['options'])->firstWhere('id', $system->value);
                if (isset($component['generals'])) {
                    $generals = array_merge($generals, $component['generals']);
                }
            }
            $props['generals'] = General::whereIn('correlative', $generals)->get();
            return $props;
        }

        $page = collect($pages)->filter(function ($item) use ($path) {
            $path2check = isset($item['pseudo_path']) && $item['pseudo_path'] ?  $item['pseudo_path'] : $item['path'];
            return strpos($path, $path2check) === 0; // Filtra las páginas que comienzan con el path
        })->sortByDesc(function ($item) {
            return strlen($item['pseudo_path'] ?? $item['path']);
        })->first();

        if (!$page) {
            abort(404);
        }

        $page['using'] = $page['using'] ?? [];

        $props['page'] = $page;
        $this->reactData = $page;
        $this->reactData['colors'] = SystemColor::all();

        $systems = [];
        if (isset($page['extends_base']) && $page['extends_base']) {
            $systems = System::whereNull('page_id')->orWhere('page_id', $page['id'])->get();
        } else {
            $systems = System::where('page_id', $page['id'])->get();
        }

        $generals = [];
        foreach ($systems as $key => $system) {
            if ($system->component == 'content') continue;
            $parent = collect($components)->firstWhere('id', $system->component);
            $component = collect($parent['options'])->firstWhere('id', $system->value);
            if (isset($component['using'])) {
                $using = 'App\\Models\\' . $component['using']['model'];
                $query = $using::select($component['using']['fields'] ?? ['*']);

                if (isset($component['using']['with'])) {
                    $query->with($component['using']['with']);
                }

                if ($system->filters) {
                    foreach ($system->filters as $field) {
                        if ($field === 'views') {
                            // Ordenar por vistas de manera descendente
                            $query->orderBy('views', 'desc');
                        } else {
                            // Aplicar filtro booleano para otros campos
                            $query->where($field, true);
                        }
                    }
                }

                if (isset($component['using']['limit'])) {
                    $query->limit($component['using']['limit']);
                }

                // aquí filtrar visible & status
                $table = (new $using)->getTable();
                if (Schema::hasColumn($table, 'visible')) {
                    $query->where('visible', true);
                }
                if (Schema::hasColumn($table, 'status')) {
                    $query->where('status', true);
                }

                // MODIFICACIÓN PARA MANEJAR VARIANTES DE COLOR:
                // Si es el modelo Item, agrupar por nombre y tomar solo un representante
                if ($component['using']['model'] === 'Item') {
                    $query->selectRaw('items.*')
                        ->join(
                            DB::raw('(SELECT MIN(id) as min_id FROM items GROUP BY name) as grouped'),
                            function ($join) {
                                $join->on('items.id', '=', 'grouped.min_id');
                            }
                        );
                }


                $shortID = Crypto::short();
                $system->itemsId = $shortID;
                $props['systemItems'][$shortID] = $query->get();
            }

            if (isset($component['generals'])) {
                $generals = array_merge($generals, $component['generals']);
            }
        }

        $props['systems'] = $systems;
        $props['params'] = $request->route() ? $request->route()->parameters() : [];
        $props['filteredData'] = [];
        $props['generals'] = General::whereIn('correlative', $generals)->get();
        $props['contacts'] = General::where('status', true)->get();
        $props['faqs'] = Faq::where('status', true)->get();
        // Procesar el campo 'using'
        foreach ($page['using'] as $key => $using) {
            $model = $using['model'] ?? null;
            $field = $using['field'] ?? null;
            $value = $request->$key ?? null;
            $relations = $using['relations'] ?? [];

            if ($model && $field && $value) {
                // Cargar un registro específico
                $class = 'App\\Models\\' . $model;
                $result = $class::with($relations)
                    ->where($field, $value)
                    ->first();
                $props['filteredData'][$model] = $result;
            } elseif ($model) {
                // Cargar todos los registros
                $class = 'App\\Models\\' . $model;
                $query = $class::select($using['fields'] ?? ['*']);
                if (isset($using['relations'])) {
                    $query->with($using['relations']);
                }
                $props['filteredData'][$key] = $query->get();
            } elseif (isset($using['static'])) {
                // Datos estáticos
                $props['filteredData'][$key] = $using['static'];
            }
        }
        $props['headerPosts'] = Post::with('category')->where('status', true)->latest()->take(3)->get();
        $props['postsLatest'] = Post::with('category')->where('status', true)->latest()->take(6)->get();
        // Verificar si hay una sesión activa
        $props['isUser'] = Auth::user();

        return $props;
    }
}
