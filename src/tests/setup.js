import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

HTMLDialogElement.prototype.showModal = vi.fn(function () {
  this.setAttribute("open", "");
});

HTMLDialogElement.prototype.close = vi.fn(function () {
  this.removeAttribute("open");
});