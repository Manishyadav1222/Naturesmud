<?php

namespace App\Filament\Resources\OrderResource\Pages;

use App\Filament\Resources\OrderResource;
use App\Mail\OrderStatusChanged;
use App\Services\WhatsAppNotifier;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Mail;

class EditOrder extends EditRecord
{
    protected static string $resource = OrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('notify_whatsapp')
                ->label('Notify via WhatsApp')
                ->icon('heroicon-o-chat-bubble-left-right')
                ->color('success')
                ->url(fn (): string => WhatsAppNotifier::notifyOrderStatus($this->record)),
            Actions\DeleteAction::make(),
        ];
    }

    protected function afterSave(): void
    {
        $order = $this->record;
        $data = $this->data;

        $statusChanged = $order->wasChanged('status');
        $paymentStatusChanged = $order->wasChanged('payment_status');

        if ($statusChanged || $paymentStatusChanged) {
            $order->recordStatusHistory(
                $order->status,
                $order->payment_status,
                $statusChanged ? 'Status updated in admin panel' : 'Payment status updated in admin panel',
                auth()->id()
            );

            if ($statusChanged && $order->shipping_email) {
                Mail::to($order->shipping_email)->send(new OrderStatusChanged($order));
            }
        }
    }
}