export const optionCard =
  "flex cursor-pointer items-center justify-between gap-4 border border-line bg-card p-5 transition-colors hover:border-amber has-[:checked]:border-amber";

const chipFocus =
  "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-amber";

export const timeChip = `flex min-h-13 cursor-pointer items-center justify-center border border-line bg-card px-3 text-[0.9375rem] transition-colors hover:border-amber has-[:checked]:border-amber has-[:checked]:bg-amber has-[:checked]:text-espresso ${chipFocus}`;

export const dayChip = `flex min-h-18 cursor-pointer flex-col items-center justify-center gap-1 border border-line bg-card px-2 transition-colors hover:border-amber has-[:checked]:border-amber has-[:checked]:bg-amber has-[:checked]:text-espresso has-[:disabled]:cursor-not-allowed has-[:disabled]:text-muted has-[:disabled]:line-through has-[:disabled]:hover:border-line ${chipFocus}`;

export const textInput =
  "w-full border border-line bg-card px-4 py-3 text-[0.9375rem] placeholder:text-muted aria-invalid:border-error";

export const stepHeading = "font-display text-[2rem] leading-tight";

export const errorText = "text-sm text-error";
