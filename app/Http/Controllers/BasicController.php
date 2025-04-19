<?php

namespace App\Http\Controllers;

use App\Http\Classes\dxResponse;
use App\Models\Aboutus;
use App\Models\dxDataGrid;
use App\Models\General;
use App\Models\Slider;
use App\Models\Social;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use SoDe\Extend\Crypto;
use SoDe\Extend\Response;
use SoDe\Extend\Text;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;


class BasicController extends Controller
{
  public $model = Model::class;
  public $softDeletion = true;
  public $reactView = 'Home';
  public $reactRootView = 'admin';
  public $imageFields = [];
  public $prefix4filter = null;
  public $throwMediaError = false;
  public $reactData = null;
  public $with4get = [];

  public function get(Request $request, string $id)
  {
    $response = Response::simpleTryCatch(function () use ($id) {
      $jpa  = $this->model::with($this->with4get)->find($id);
      if (!$jpa) throw new Exception('El pedido que buscas no existe');
      return $jpa;
    });
    return \response($response->toArray(), $response->status);
  }

  public function media(Request $request, string $uuid)
  {
    try {
      $snake_case = Text::camelToSnakeCase(str_replace('App\\Models\\', '', $this->model));
      if ($snake_case === 'item_image') {
        $snake_case = 'item';
      }
      //dump($snake_case);
      if (Text::has($uuid, '.')) {
        $route = "images/{$snake_case}/{$uuid}";
      } else {
        $route = "images/{$snake_case}/{$uuid}.img";
      }
      $content = Storage::get($route);
      if (!$content) throw new Exception('Imagen no encontrado');
      return response($content, 200, [
        'Content-Type' => 'application/octet-stream'
      ]);
    } catch (\Throwable $th) {
      $content = Storage::get('utils/cover-404.svg');
      $status = 200;
      if ($this->throwMediaError) return null;
      return response($content, $status, [
        'Content-Type' => 'image/svg+xml'
      ]);
    }
  }

  public function setPaginationInstance(Request $request, string $model)
  {
    return $model::select();
  }

  public function setPaginationSummary(Request $request, Builder $builder)
  {
    return [];
  }

  public function setReactViewProperties(Request $request)
  {
    return [];
  }

  public function reactView(Request $request)
  {

    $session = null;
    if (Auth::check()) {
      $session = User::find(Auth::id());
      $session->getAllPermissions();
    }

    $properties = [
      'session' => $session,
      'global' => [
        'PUBLIC_RSA_KEY' => Controller::$PUBLIC_RSA_KEY,
        'APP_NAME' => env('APP_NAME', 'Trasciende'),
        'APP_URL' => env('APP_URL'),
        'APP_DOMAIN' => env('APP_DOMAIN'),
        'APP_ENV' => env('APP_ENV'),
        'APP_CORRELATIVE' => env('APP_CORRELATIVE'),
        'APP_PROTOCOL' => env('APP_PROTOCOL', 'https'),
        'GMAPS_API_KEY' => env('GMAPS_API_KEY')
      ],
    ];
    $reactViewProperties = $this->setReactViewProperties($request);
    if (\is_array($reactViewProperties)) {
      foreach ($this->setReactViewProperties($request) as $key => $value) {
        $properties[$key] = $value;
      }
    } else {
      return $reactViewProperties;
    }
    return Inertia::render($this->reactView, $properties)
      ->rootView($this->reactRootView)
      ->withViewData('data', $this->reactData ?? []);
  }

  public function paginate(Request $request): HttpResponse|ResponseFactory
  {
    $response = new dxResponse();
    try {

      //$instance = $this->setPaginationInstance($this->model);
      // Obtener los with desde el request (si no se envían, será un array vacío)
      $withRelations = $request->has('with') ? explode(',', $request->with) : [];

      // Aplicar with dinámicamente
      $instance = $this->setPaginationInstance($request, $this->model)->with($withRelations);

      if ($request->group != null) {
        [$grouping] = $request->group;
        $selector = $grouping['selector'];
        if ($this->prefix4filter && !str_contains($selector, '.')) {
          $selector = $this->prefix4filter . '.' . $selector;
        }
        $instance = $instance->select([
          DB::raw("{$selector} AS 'key'")
        ])
          ->groupBy($selector);
      }

      if (Auth::check()) {
        $table = $this->prefix4filter ? $this->prefix4filter : (new $this->model)->getTable();
        if (Schema::hasColumn($table, 'status')) {
          $instance->whereNotNull($this->prefix4filter ? $this->prefix4filter . '.status' : 'status');
        }
      }

      if ($request->filter) {
        $instance->where(function ($query) use ($request) {
          dxDataGrid::filter($query, $request->filter ?? [], false, $this->prefix4filter);
        });
      }


      if ($request->group == null) {
        if ($request->sort != null) {
          foreach ($request->sort as $sorting) {
            $selector = $sorting['selector'];
            $instance->orderBy(
              $selector,
              $sorting['desc'] ? 'DESC' : 'ASC'
            );
          }
        } else { //MEJORAR IMPLMENTAR ASC O DESC DESDE EL REST, PARA MEJORARLO LA INTERACTIVIDAD CON OTRAS TABLAS
          $instance->orderBy($this->prefix4filter ? $this->prefix4filter . '.id' : 'id', 'ASC');
        }
      }

      $totalCount = 0;
      if ($request->requireTotalCount) {
        $instance4count = clone $instance;
        $instance4count->getQuery()->groups = null;
        if ($request->group != null) {
          // When grouping, count distinct groups
          $totalCount = $instance4count->distinct()->count(DB::raw($selector));
        } else {
          // When not grouping, use the original count logic
          if ($this->prefix4filter) {
            $totalCount = $instance4count->distinct()->count($this->prefix4filter . '.id');
          } else {
            $totalCount = $instance4count->distinct()->count('id');
          }
        }
      }

      $jpas = $request->isLoadingAll
        ? $instance->get()
        : $instance
        ->skip($request->skip ?? 0)
        ->take($request->take ?? 10)
        ->get();

      $response->status = 200;
      $response->message = 'Operación correcta';
      $response->data = $jpas;
      $response->summary = $this->setPaginationSummary($request, $instance);
      $response->totalCount = $totalCount;
    } catch (\Throwable $th) {
      $response->status = 400;
      $response->message = $th->getMessage() . ' Ln.' . $th->getLine();
    } finally {
      return response(
        $response->toArray(),
        $response->status
      );
    }
  }

  public function beforeSave(Request $request)
  {
    return $request->all();
  }

  public function save(Request $request): HttpResponse|ResponseFactory
  {
    $response = new Response();
    try {

      $body = $this->beforeSave($request);


      $snake_case = Text::camelToSnakeCase(str_replace('App\\Models\\', '', $this->model));
      if ($snake_case === "item_image") {
        $snake_case = 'item';
      }

      foreach ($this->imageFields as $field) {

        if (!$request->hasFile($field)) continue;
        $full = $request->file($field);
        $uuid = Crypto::randomUUID();
        $ext = $full->getClientOriginalExtension();
        $path = "images/{$snake_case}/{$uuid}.{$ext}";
        Storage::put($path, file_get_contents($full));
        $body[$field] = "{$uuid}.{$ext}";
      }

      $jpa = $this->model::find(isset($body['id']) ? $body['id'] : null);

      if (!$jpa) {
        $body['slug'] = Crypto::randomUUID();
        $jpa = $this->model::create($body);
        $isNew = true;
      } else {
        $jpa->update($body);
        $isNew = false;
      }

      $table = (new $this->model)->getTable();
      if (Schema::hasColumn($table, 'slug')) {
        $slug = Str::slug($jpa->name);
        $slugExists = $this->model::where('slug', $slug)->where('id', '<>', $jpa->id)->exists();
        if ($slugExists) {
          $slug = $slug . '-' . Crypto::short();
        }
        $jpa->update(['slug' => $slug]);
      }

      $data = $this->afterSave($request, $jpa, $isNew);
      if ($data) {
        $response->data = $data;
      }

      $response->status = 200;
      $response->message = 'Operacion correcta';
    } catch (\Throwable $th) {
      $response->status = 400;
      $response->message = $th->getMessage();
    } finally {
      return response(
        $response->toArray(),
        $response->status
      );
    }
  }

  public function afterSave(Request $request, object $jpa, ?bool $isNew)
  {
    return null;
  }

  public function status(Request $request)
  {
    $response = new Response();
    try {
      $this->model::where('id', $request->id)
        ->update([
          'status' => $request->status ? 0 : 1
        ]);

      $response->status = 200;
      $response->message = 'Operacion correcta';
    } catch (\Throwable $th) {
      $response->status = 400;
      $response->message = $th->getMessage();
    } finally {
      return response(
        $response->toArray(),
        $response->status
      );
    }
  }

  public function boolean(Request $request)
  {
    $response = new Response();
    try {
      $data = [];
      $data[$request->field] = $request->value;

      $this->model::where('id', $request->id)
        ->update($data);

      $response->status = 200;
      $response->message = 'Operacion correcta';
    } catch (\Throwable $th) {
      $response->status = 400;
      $response->message = $th->getMessage();
    } finally {
      return response(
        $response->toArray(),
        $response->status
      );
    }
  }

  public function beforeDelete(Request $request)
  {
    return [];
  }

  public function afterDelete(Model $data)
  {
    return [];
  }

  public function delete(Request $request, string $id)
  {
    $response = new Response();
    try {
      $body = $this->beforeDelete($request);

      $dataBeforeDelete = $this->model::find($id);
      if (!$dataBeforeDelete) throw new Exception('El registro que intenta eliminar no existe');
      if ($this->softDeletion) {
        $deleted = $this->model::where('id', $id)
          ->update(\array_merge(['status' => null], $body));
      } else {
        $deleted = $this->model::where('id', $id)
          ->delete();
      }
      if ($deleted) {
        $snake_case = Text::camelToSnakeCase(str_replace('App\\Models\\', '', $this->model));
        foreach ($this->imageFields as $field) {
          $filename = $dataBeforeDelete->{$field};
          if (!Text::has($filename, '.')) {
            $filename = "{$filename}.enc";
          }
          $path = "images/{$snake_case}/{$filename}";
          Storage::delete($path);
        }
      }

      $this->afterDelete($dataBeforeDelete);

      if (!$deleted) throw new Exception('No se ha eliminado ningun registro');

      $response->status = 200;
      $response->message = 'Operacion correcta';
    } catch (\Throwable $th) {
      $response->status = 400;
      $response->message = $th->getMessage();
    } finally {
      return response(
        $response->toArray(),
        $response->status
      );
    }
  }
}
