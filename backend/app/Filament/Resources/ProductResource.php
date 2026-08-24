<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';

    protected static ?string $navigationGroup = 'Catalog';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Basic Information')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn (Forms\Set $set, ?string $state) => $set('slug', \Illuminate\Support\Str::slug($state))),
                        Forms\Components\TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),
                        Forms\Components\Select::make('category_id')
                            ->relationship('category', 'name')
                            ->required(),
                        Forms\Components\TextInput::make('sku')
                            ->required()
                            ->maxLength(50),
                        Forms\Components\Textarea::make('short_description')
                            ->rows(2)
                            ->maxLength(500),
                        Forms\Components\RichEditor::make('description'),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Pricing & Inventory')
                    ->schema([
                        Forms\Components\TextInput::make('price')
                            ->required()
                            ->numeric()
                            ->prefix('Rs.'),
                        Forms\Components\TextInput::make('compare_at_price')
                            ->numeric()
                            ->prefix('Rs.'),
                        Forms\Components\TextInput::make('cost_price')
                            ->numeric()
                            ->prefix('Rs.'),
                        Forms\Components\TextInput::make('stock_quantity')
                            ->required()
                            ->numeric(),
                        Forms\Components\TextInput::make('low_stock_threshold')
                            ->numeric(),
                        Forms\Components\TextInput::make('weight')
                            ->numeric()
                            ->suffix('g'),
                        Forms\Components\TextInput::make('unit')
                            ->default('g'),
                    ])
                    ->columns(3),

                Forms\Components\Section::make('Product Information')
                    ->schema([
                        Forms\Components\Repeater::make('ingredients')
                            ->default([])
                            ->simple(Forms\Components\TextInput::make('ingredient')->required()),
                        Forms\Components\Repeater::make('benefits')
                            ->default([])
                            ->simple(Forms\Components\TextInput::make('benefit')->required()),
                        Forms\Components\KeyValue::make('nutrition_facts')
                            ->default([]),
                        Forms\Components\Textarea::make('usage_instructions')->rows(2),
                        Forms\Components\Textarea::make('storage_instructions')->rows(2),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Media')
                    ->schema([
                        Forms\Components\FileUpload::make('featured_image')
                            ->image()
                            ->directory('products'),
                        Forms\Components\Repeater::make('gallery')
                            ->default([])
                            ->simple(Forms\Components\FileUpload::make('image')->image()->directory('products/gallery')),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Flags')
                    ->schema([
                        Forms\Components\Toggle::make('is_active')->default(true),
                        Forms\Components\Toggle::make('is_featured')->default(false),
                        Forms\Components\Toggle::make('is_best_seller')->default(false),
                        Forms\Components\Toggle::make('is_new')->default(false),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('SEO')
                    ->schema([
                        Forms\Components\TextInput::make('meta_title')->maxLength(70),
                        Forms\Components\Textarea::make('meta_description')->maxLength(160),
                    ])
                    ->collapsed(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('featured_image')->circular(),
                Tables\Columns\TextColumn::make('name')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('category.name')->sortable(),
                Tables\Columns\TextColumn::make('price')->money('NPR')->sortable(),
                Tables\Columns\TextColumn::make('stock_quantity')->sortable()->badge(),
                Tables\Columns\ToggleColumn::make('is_active'),
                Tables\Columns\ToggleColumn::make('is_featured'),
                Tables\Columns\ToggleColumn::make('is_best_seller'),
                Tables\Columns\TextColumn::make('sold_count')->sortable(),
                Tables\Columns\TextColumn::make('rating_avg')->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category')->relationship('category', 'name'),
                Tables\Filters\TernaryFilter::make('is_active'),
                Tables\Filters\TernaryFilter::make('is_featured'),
                Tables\Filters\TernaryFilter::make('is_best_seller'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}