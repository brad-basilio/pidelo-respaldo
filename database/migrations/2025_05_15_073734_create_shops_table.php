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
        Schema::create('shops', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('(UUID())'))->primary();  
            $table->string('name');  // Nombre de la tienda
            $table->string('slug')->nullable();  // URL amigable
            $table->text('description')->nullable();  // Descripción de la tienda
            $table->string('logo')->nullable();  // URL del logo de la tienda
            $table->string('address')->nullable();  // Dirección física
            $table->string('website')->nullable();  // URL del sitio web
            $table->boolean('visible')->default(true);
            $table->boolean('status')->default(true)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shops');
    }
};
