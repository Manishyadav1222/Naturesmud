<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ReelResource\Pages;
use App\Models\Reel;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ReelResource extends Resource
{
    protected static ?string $model = Reel::class;

    protected static ?string $navigationIcon = 'heroicon-o-play-circle';

    protected static ?string $navigationGroup = 'Content';

    protected static ?int $navigationSort = 6;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Reel Details')
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->maxLength(255)
                            ->required(),
                        Forms\Components\Textarea::make('description')
                            ->rows(3),
                        Forms\Components\FileUpload::make('video_url')
                            ->label('Video File')
                            ->directory('reels')
                            ->acceptedFileTypes(['video/*'])
                            ->required(),
                        Forms\Components\FileUpload::make('cover_image')
                            ->label('Cover Image')
                            ->image()
                            ->directory('reels/covers')
                            ->required(),
                        Forms\Components\TextInput::make('product_name')
                            ->label('Product Name (optional)')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('product_url')
                            ->label('Product URL (optional)')
                            ->url()
                            ->placeholder('/products/moringa-powder'),
                        Forms\Components\Toggle::make('is_active')
                            ->default(true),
                        Forms\Components\TextInput::make('sort_order')
                            ->numeric()
                            ->default(0),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('cover_image')
                    ->label('Preview')
                    ->height(80)
                    ->square(),
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('description')
                    ->limit(50),
                Tables\Columns\TextColumn::make('product_name')
                    ->label('Product')
                    ->searchable()
                    ->placeholder('—'),
                Tables\Columns\ToggleColumn::make('is_active'),
                Tables\Columns\TextColumn::make('sort_order')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active'),
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
            ->defaultSort('sort_order');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListReels::route('/'),
            'create' => Pages\CreateReel::route('/create'),
            'edit' => Pages\EditReel::route('/{record}/edit'),
        ];
    }
}