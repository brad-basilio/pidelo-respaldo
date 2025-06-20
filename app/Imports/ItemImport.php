<?php

namespace App\Imports;

use App\Models\Item;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\Collection;
use App\Models\Brand;
use App\Models\Shop;
use App\Models\ItemSpecification;
use App\Models\ItemImage;
use Exception;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Validators\Failure;
use Illuminate\Support\Str;
use SoDe\Extend\Crypto;
use Throwable;

class ItemImport implements ToModel, WithHeadingRow, SkipsOnError, SkipsOnFailure
{
    use \Maatwebsite\Excel\Concerns\Importable;
    private $errors = [];
    public function __construct()
    {
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;'); // ⚠️ Desactiva las claves foráneas
        Item::truncate();
        ItemSpecification::truncate();
        ItemImage::truncate();
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;'); // ✅ Reactiva las claves foráneas
    }

    public function model(array $row)
    {
        try {
            if ($this->isRowEmpty($row)) {
                return null;
            }

            $this->validateRequiredFields($row);

            $category = Category::firstOrCreate(
                ['name' => $row['categoria']],
                ['slug' => str()->slug($row['categoria'])]
            );

            $subCategory = SubCategory::firstOrCreate(
                ['name' => $row['subcategoria'], 'category_id' => $category->id],
                ['slug' => str()->slug($row['subcategoria'])]
            );
            $brand = null;
            if (!empty($row['marca'])) {
                $brand = Brand::firstOrCreate(
                    ['name' => $row['marca']],
                    ['slug' => str()->slug($row['marca'])]
                );
            }

            $shop = null;
            if (!empty($row['tienda'])) {
                $shop = Shop::firstOrCreate(
                    ['name' => $row['tienda']],
                    ['slug' => str()->slug($row['tienda'])]
                );
            }

            // Variaciones
            $color = $row['color'] ?? null;
            $size = $row['talla'] ?? null;
            $groupCode = $row['grupo'] ?? Str::slug($row['nombre_de_producto']);

            $slug = Str::slug($row['nombre_de_producto']);
            if ($color) {
                $slug .= '__' . Str::slug($color);
            }
            if ($size) {
                $slug .= '-' . strtolower($size);
            }

            if (Item::where('slug', $slug)->exists()) {
                $slug .= '-' . \SoDe\Extend\Crypto::short();
            }

            $item = Item::create([
                'sku' => $row['sku'],
                'name' => $row['nombre_de_producto'],
                'description' => $row['descripcion'] ?? null,
                'price' => $row['precio'],
                'discount' => $row['descuento'] ?? null,
                'final_price' => isset($row['descuento']) && $row['descuento'] > 0 ? $row['descuento'] : $row['precio'],
                'discount_percent' => isset($row['descuento']) && $row['descuento'] > 0
                    ? round((100 - ($row['descuento'] / $row['precio']) * 100))
                    : null,
                'category_id' => $category->id,
                'subcategory_id' => $subCategory->id,
                'brand_id' => $brand->id ?? null,
                'image' => $this->getMainImage($row['sku']),
                'slug' => $slug,
                'stock' => isset($row['stock']) && $row['stock'] > 0 ? $row['stock'] : 10,
                'weight' => isset($row['peso']) ? (float) $row['peso'] : null,
                'shop_id' => $shop ? $shop->id : null,
                'color' => $color,
                'size' => $size,
                'group_code' => $groupCode,
            ]);

            if ($item) {
                if (!empty($row['especificaciones_principales_separadas_por_comas'])) {
                    $this->saveSpecifications($item, $row['especificaciones_principales_separadas_por_comas'], 'principal');
                }

                if (!empty($row['especificaciones_generales_separado_por_comas_y_dos_puntos'])) {
                    $this->saveSpecifications($item, $row['especificaciones_generales_separado_por_comas_y_dos_puntos'], 'general');
                }

                $this->saveGalleryImages($item, $row['sku']);
            } else {
                \Log::error("No se pudo crear el producto con SKU: " . $row['sku']);
            }
        } catch (\Throwable $e) {
            \Log::error("Error al procesar fila SKU: " . ($row['sku'] ?? 'N/A') . " - " . $e->getMessage());
            \Log::error($e->getTraceAsString());
            $this->addError($e->getMessage());
            return null;
        }
    }


    private function validateRequiredFields($row)
    {
        $required = ['sku', 'nombre_de_producto', 'categoria', 'subcategoria', 'marca', 'precio'];
        foreach ($required as $field) {
            if (empty($row[$field])) {
                throw new Exception("Required field '{$field}' is missing or empty");
            }
        }
    }

    private function getMainImage($sku)
    {
        $extensions = ['png', 'jpg', 'jpeg', 'webp'];
        foreach ($extensions as $ext) {
            $path = "images/item/{$sku}.{$ext}";
            if (Storage::exists($path)) {
                return "{$sku}.{$ext}";
            }
        }

        foreach ($extensions as $ext) {
            $path = "images/item/{$sku}_1.{$ext}";
            if (Storage::exists($path)) {
                return "{$sku}_1.{$ext}";
            }
        }
        return null;
    }

    private function saveSpecifications($item, $specs, $type)
    {
        if (empty($specs)) return;

        $specsArray = explode(',', $specs);
        foreach ($specsArray as $spec) {
            if ($type == 'principal') {
                ItemSpecification::create([
                    'item_id' => $item->id,
                    'type' => $type,
                    'title' => trim($spec),
                    'description' => trim($spec),
                ]);
            } else {
                $parts = explode(':', $spec, 2);
                if (count($parts) == 2) {
                    ItemSpecification::create([
                        'item_id' => $item->id,
                        'type' => $type,
                        'title' => trim($parts[0]),
                        'description' => trim($parts[1]),
                    ]);
                }
            }
        }
    }

    private function saveGalleryImages($item, $sku)
    {
        $extensions = ['png', 'jpg', 'jpeg', 'webp'];
        $index = 2;

        while (true) {
            $found = false;
            foreach ($extensions as $ext) {
                $filename = "{$sku}_" . ($index < 10 ? $index : str_pad($index, 2, '0', STR_PAD_LEFT)) . ".{$ext}";
                $path = "images/item/{$filename}";

                if (Storage::exists($path)) {
                    ItemImage::create([
                        'item_id' => $item->id,
                        'url' => $filename,
                    ]);
                    $found = true;
                    break;
                }
            }

            if (!$found) {
                break;
            }
            $index++;
        }
    }

    private function isRowEmpty(array $row): bool
    {
        if (empty($row['sku']) || is_null($row['sku'])) {
            return true;
        }

        foreach ($row as $value) {
            if (!is_null($value) && trim($value) !== '') {
                return false;
            }
        }

        return true;
    }

    public function onError(Throwable $e)
    {
        $this->addError("General error: " . $e->getMessage());
    }

    public function onFailure(Failure ...$failures)
    {
        foreach ($failures as $failure) {
            $this->addError(sprintf(
                "Row %d, Column '%s': %s",
                $failure->row(),
                $failure->attribute(),
                implode(', ', $failure->errors())
            ));
        }
    }

    public function getErrors()
    {
        return $this->errors;
    }

    private function addError($message)
    {
        $this->errors[] = $message;
    }
}
