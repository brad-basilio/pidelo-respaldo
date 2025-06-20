<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('types_delivery', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('(UUID())'))->primary();
            $table->string('name')->nullable();
            $table->string('slug')->nullable();
            $table->longText('description')->nullable();
            $table->timestamps();
        });

        Schema::table('delivery_prices', function (Blueprint $table) {
            $table->boolean('is_free')->default(false);
            $table->decimal('express_price', 10, 2)->nullable();
            $table->foreignUuid('type_id')->nullable()->constrained('types_delivery')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('types_delivery');
        Schema::table('delivery_prices', function (Blueprint $table) {
            $table->dropColumn('is_free');
            $table->dropColumn('express_price');
        });
    }
};
