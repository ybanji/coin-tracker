import { z } from "zod";

export const holdingFormSchema = z.object({
  coinId: z.string().min(1, "Choose a coin."),
  quantity: z.coerce.number({ invalid_type_error: "Enter a quantity." }).positive("Quantity must be greater than 0."),
  buyPrice: z.coerce
    .number({ invalid_type_error: "Enter a buy price." })
    .nonnegative("Buy price can't be negative."),
  purchaseDate: z
    .string()
    .min(1, "Choose a purchase date.")
    .refine((value) => new Date(value).getTime() <= Date.now(), "Purchase date can't be in the future."),
});

export type HoldingFormValues = z.infer<typeof holdingFormSchema>;
