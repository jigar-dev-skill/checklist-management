<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('checklist_responses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('checklist_id');
            $table->unsignedBigInteger('field_id');
            $table->longText('value')->nullable();
            $table->timestamps();

            $table->foreign('checklist_id')
                ->references('id')
                ->on('checklists')
                ->onDelete('cascade');

            $table->foreign('field_id')
                ->references('id')
                ->on('checklist_fields')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('checklist_responses');
    }
};
