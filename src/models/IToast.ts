export default interface Toast {
  id: symbol;
  type: "success" | "error" | "warning" | "info";
  message: string;
  title?: string;
  timeout?: number;
  element?: HTMLElement;
}
