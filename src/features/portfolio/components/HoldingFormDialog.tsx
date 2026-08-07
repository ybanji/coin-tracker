import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CoinCombobox } from "@/features/portfolio/components/CoinCombobox";
import { holdingFormSchema } from "@/features/portfolio/schema";
import { usePortfolioStore } from "@/store/portfolioStore";
import { toast } from "@/store/toastStore";
import type { CoinMarketData } from "@/types/coin";
import type { PortfolioHolding } from "@/types/portfolio";

export interface HoldingFormDialogProps {
  open: boolean;
  onClose: () => void;
  coins: CoinMarketData[];
  editingHolding?: PortfolioHolding | null;
}

interface RawFormValues {
  coinId: string;
  quantity: string;
  buyPrice: string;
  purchaseDate: string;
}

const todayIso = () => new Date().toISOString().slice(0, 10);

export function HoldingFormDialog({ open, onClose, coins, editingHolding }: HoldingFormDialogProps) {
  const addHolding = usePortfolioStore((state) => state.addHolding);
  const updateHolding = usePortfolioStore((state) => state.updateHolding);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RawFormValues>({
    defaultValues: { coinId: "", quantity: "", buyPrice: "", purchaseDate: todayIso() },
  });

  // Re-seed the form whenever the dialog opens (either blank for "add", or the existing holding for "edit").
  useEffect(() => {
    if (!open) return;
    reset(
      editingHolding
        ? {
            coinId: editingHolding.coinId,
            quantity: String(editingHolding.quantity),
            buyPrice: String(editingHolding.buyPrice),
            purchaseDate: editingHolding.purchaseDate.slice(0, 10),
          }
        : { coinId: "", quantity: "", buyPrice: "", purchaseDate: todayIso() },
    );
  }, [open, editingHolding, reset]);

  function onSubmit(raw: RawFormValues) {
    const result = holdingFormSchema.safeParse(raw);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof RawFormValues;
        setError(field, { message: issue.message });
      }
      return;
    }

    const coin = coins.find((c) => c.id === result.data.coinId);
    if (!coin) {
      setError("coinId", { message: "Choose a coin." });
      return;
    }

    const input = {
      coinId: coin.id,
      coinName: coin.name,
      coinSymbol: coin.symbol,
      coinImage: coin.image,
      quantity: result.data.quantity,
      buyPrice: result.data.buyPrice,
      purchaseDate: result.data.purchaseDate,
    };

    if (editingHolding) {
      updateHolding(editingHolding.id, input);
      toast.success("Holding updated", `${coin.name} was updated.`);
    } else {
      addHolding(input);
      toast.success("Holding added", `${coin.name} was added to your portfolio.`);
    }
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={editingHolding ? "Edit Holding" : "Add Holding"}
      description="Track a coin you own — quantity, buy price, and purchase date. Nothing here ever leaves your browser."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Controller
          name="coinId"
          control={control}
          render={({ field }) => (
            <CoinCombobox
              coins={coins}
              value={field.value}
              onChange={field.onChange}
              error={errors.coinId?.message}
              disabled={!!editingHolding}
            />
          )}
        />
        <Input
          label="Quantity"
          type="number"
          step="any"
          min={0}
          inputMode="decimal"
          error={errors.quantity?.message}
          {...register("quantity")}
        />
        <Input
          label="Buy Price (per coin)"
          type="number"
          step="any"
          min={0}
          inputMode="decimal"
          error={errors.buyPrice?.message}
          {...register("buyPrice")}
        />
        <Input
          label="Purchase Date"
          type="date"
          max={todayIso()}
          error={errors.purchaseDate?.message}
          {...register("purchaseDate")}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {editingHolding ? "Save Changes" : "Add Holding"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
