<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Sale;
use App\Models\SaleDetail;
use App\Models\SaleStatus;
use Illuminate\Http\Request;
use MercadoPago\MercadoPagoConfig;
use MercadoPago\Exceptions\MPApiException;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\Resources\Preference\Item as MPItem;
use MercadoPago\Client\Payment\PaymentClient;

class MercadoPagoController extends Controller
{
    public function createPreference(Request $request)
    {
        try {
            // Configurar SDK de MercadoPago
            MercadoPagoConfig::setAccessToken(config('services.mercadopago.access_token'));

            // Generar número de orden
            $orderNumber = $this->generateOrderNumber();

            // Crear registro de venta con estado "pendiente" ANTES de crear la preferencia
            $saleStatusPendiente = SaleStatus::getByName('Pendiente');

            $sale = Sale::create([
                'code' => $orderNumber,
                'user_id' => $request->user_id,
                'name' => $request->name,
                'lastname' => $request->lastname,
                'fullname' => $request->fullname,
                'email' => $request->email,
                'phone' => $request->phone,
                'country' => $request->country,
                'department' => $request->department,
                'province' => $request->province,
                'district' => $request->district,
                'ubigeo' => $request->ubigeo,
                'address' => $request->address,
                'number' => $request->number,
                'reference' => $request->reference,
                'comment' => $request->comment,
                'amount' => $request->amount,
                'delivery' => $request->delivery,
                'payment_status' => 'pendiente',
                'status_id' => $saleStatusPendiente ? $saleStatusPendiente->id : null,
                'invoiceType' => $request->invoiceType,
                'documentType' => $request->documentType,
                'document' => $request->document,
                'businessName' => $request->businessName,
            ]);

             // Registrar detalles de la venta (sin afectar stock aún)
            foreach ($request->cart as $item) {
                $itemId = is_array($item) ? $item['id'] ?? null : $item->id ?? null;
                $itemName = is_array($item) ? $item['name'] ?? null : $item->name ?? null;
                $itemPrice = is_array($item) ? $item['final_price'] ?? null : $item->final_price ?? null;
                $itemQuantity = is_array($item) ? $item['quantity'] ?? null : $item->quantity ?? null;

                SaleDetail::create([
                    'sale_id' => $sale->id,
                    'item_id' => $itemId,
                    'name' => $itemName,
                    'price' => $itemPrice,
                    'quantity' => $itemQuantity,
                ]);
            }

            // Configurar items para MercadoPago
            $items = [];

            foreach ($request->cart as $cartItem) {
                $items[] = [
                    'id' => is_array($cartItem) ? (string) $cartItem['id'] ?? null : (string) $cartItem->id ?? null,
                    'title' => is_array($cartItem) ? $cartItem['name'] ?? null : $cartItem->name ?? null,
                    'quantity' => is_array($cartItem) ? (int) $cartItem['quantity'] ?? null : (int) $cartItem->quantity ?? null,
                    'unit_price' => is_array($cartItem) ? (float) $cartItem['final_price'] ?? null : (float) $cartItem->final_price ?? null,
                    'currency_id' => 'PEN',
                ];
            }

            // Agregar envío si existe
            if ($request->delivery > 0) {
                $items[] = [
                    'id' => 'delivery',
                    'title' => 'Costo de envío',
                    'quantity' => 1,
                    'unit_price' => round(max((float) $request->delivery, 0.1), 2),
                    'currency_id' => 'PEN',
                ];
            }

            // Configurar preferencia
            $preferenceData = [
                'items' => $items,
                'payment_methods' => [
                    'excluded_payment_methods' => [
                    ],
                    'excluded_payment_types' => [
                        ['id' => 'ticket'], // Excluye pagos en efectivo (Ripley, Banco Azteca, etc.)
                        ['id' => 'atm'], // Excluye pagos en cajeros
                        ['id' => 'bank_transfer'], // Excluye transferencias bancarias
                        ['id' => 'digital_wallet'], // Excluye billeteras digitales
                        ['id' => 'digital_currency'], // Excluye criptomonedas
                        ['id' => 'prepaid_card'], // Excluye tarjetas prepago
                    ],
                    'installments' => 6,
                    'default_installments' => 1,
                ],
                'payer' => [
                    'name' => $request->name,
                    'surname' => $request->lastname,
                    'email' => $request->email,
                    'phone' => [
                        'area_code' => '',
                        'number' => $request->phone ?? '',
                    ],
                    'address' => [
                        'street_name' => $request->address,
                        'street_number' => $request->number ?? '',
                        'zip_code' => '',
                    ],
                ],
                'back_urls' => [
                    'success' => url('/api/mercadopago/success'),
                    'failure' => url('/api/mercadopago/failure'),
                    'pending' => url('/api/mercadopago/pending'),
                ],
                'auto_return' => 'approved',
                'external_reference' => $orderNumber,
            ];

            // Crear preferencia
            $client = new PreferenceClient();

            // Guardar la preferencia
            $preference = $client->create($preferenceData);

            if (!$preference || !isset($preference->id)) {
                throw new \Exception('No se pudo crear la preferencia de pago');
            }

            return response()->json([
                'status' => true,
                'preference_id' => $preference->id,
                'public_key' => config('services.mercadopago.public_key'),
                'redirect_url' => $preference->init_point,
                'orderNumber' => $orderNumber,
                'cart' => $request->cart,
                'sale_id' => $sale->id,
            ]);
        } catch (\Exception $e) {
            if (isset($sale)) {
                $sale->delete();
            }
            return response()->json(
                [
                    'message' => 'Error al crear la preferencia de pago',
                    'status' => false,
                    'error' => $e->getMessage(),
                ],
                400,
            );
        }
    }

    public function handleSuccess(Request $request)
    {
        try {

            // Verificar el pago con MercadoPago
            MercadoPagoConfig::setAccessToken(config('services.mercadopago.access_token'));

            $paymentClient = new PaymentClient();

            $paymentId = $request->input('payment_id') ?? $request->input('data.id') ?? $request->query('payment_id');

            if (!$paymentId) {
                return redirect('/cart?message=No se recibió ID de pago');
            }

            $payment = $paymentClient->get($paymentId);

            if ($payment->status !== 'approved') {
                return redirect('/cart?message=Pago no aprobado. Estado: ' . $payment->status);
            }

            // Obtener el ID de la venta desde external_reference
            $saleId = $payment->external_reference ?? $request->query('external_reference');

            if (!$saleId) {
                return redirect('/cart?message=No se pudo identificar la orden');
            }

            // Buscar la venta
            $sale = Sale::where('code', $saleId)->first();

            if (!$sale) {
                return redirect('/cart?message=Orden no encontrada');
            }

            // Registrar la venta
            $saleStatusPagado = SaleStatus::getByName('Pagado');

            $sale->update([
                'culqi_charge_id' => $payment->id,
                'payment_status' => 'pagado',
                'status_id' => $saleStatusPagado ? $saleStatusPagado->id : null,
            ]);

            
            $saleDetails = SaleDetail::where('sale_id', $sale->id)->get();
            
            // Actualizar stock (solo si el pago es aprobado)
            foreach ($saleDetails as $detail) {
                Item::where('id', $detail->item_id)->decrement('stock', $detail->quantity);
            }

            return redirect('/cart?code=' . $sale->code);

        } catch (\Exception $e) {
            return redirect('/cart?message=' . urlencode($e->getMessage()));
        }
    }

    public function handleFailure(Request $request)
    {
        return redirect('/catalogo');
        // return redirect('/cart?message=El pago ha sido rechazado');
    }

    public function handlePending(Request $request)
    {
        return redirect('/cart?message=Pago pendiente de confirmacion');
    }

    private function generateOrderNumber()
    {
        $numeroOrden = '';
        for ($i = 0; $i < 12; $i++) {
            $digitoAleatorio = mt_rand(0, 9);
            $numeroOrden .= $digitoAleatorio;
        }
        return $numeroOrden;
    }

    public function getOrder(Request $request)
    {
        
        try {

            $order = Sale::where('code', $request->code) ->first();
            
            if (!$order) {
                return response()->json(
                    [
                        'status' => false,
                        'message' => 'Orden no encontrada',
                    ],
                    404,
                );
            }

            // Obtener los detalles de la venta
            $saleDetails = SaleDetail::where('sale_id', $order->id)->get();


            // Obtener los items con sus imágenes
            $items = [];
            foreach ($saleDetails as $detail) {
                $item = Item::select('name', 'image', 'color')
                            ->where('id', $detail->item_id)
                            ->first();
                
                if ($item) {
                    $items[] = [
                        'id' => $detail->item_id,
                        'name' => $detail->name ?? $item->name,
                        'image' => $item->image,
                        'color' => $detail->colors ?? $item->color,
                        'quantity' => $detail->quantity,
                        'price' => $detail->price,
                    ];
                } else {
                    // Si el item fue eliminado, usar los datos del detalle
                    $items[] = [
                        'id' => $detail->item_id,
                        'name' => $detail->name,
                        'image' => null,
                        'color' => $detail->colors,
                        'quantity' => $detail->quantity,
                        'price' => $detail->price,
                    ];
                }
            }
            
        // Formatear la respuesta
        $response = [
                'status' => true,
                'order' => [
                    'code' => $order->code,
                    'created_at' => $order->created_at->format('d/m/Y H:i'),
                    'payment_status' => $order->payment_status,
                    'amount' => $order->amount,
                    'delivery' => $order->delivery,
                    'shipping_address' => [
                        'address' => $order->address,
                        'department' => $order->department,
                        'province' => $order->province,
                        'district' => $order->district,
                        'reference' => $order->reference,
                    ],
                    'customer' => [
                        'name' => $order->name,
                        'lastname' => $order->lastname,
                        'email' => $order->email,
                        'phone' => $order->phone,
                    ],
                    'items' => $items,
                    'invoice_info' => [
                        'invoiceType' => $order->invoiceType,
                        'documentType' => $order->documentType,
                        'document' => $order->document,
                        'businessName' => $order->businessName,
                    ],
                ],
            ];

            return response()->json($response);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error al obtener los detalles de la orden',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
