/** Every step receives a ref callback that moves focus to it after navigation. */
export type StepProps = {
  focusRef: (element: HTMLElement | null) => void;
};
