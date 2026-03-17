"use client";

import { useState, createContext, useContext, useCallback, useRef } from "react";
import { Button } from "./Button";

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType>({
  confirm: () => Promise.resolve(false),
});

export function useConfirm() {
  return useContext(ConfirmContext);
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolveRef = useRef<(value: boolean) => void>();

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts);
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const handleResponse = (value: boolean) => {
    resolveRef.current?.(value);
    setOptions(null);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {options && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="p-6">
              {options.title && (
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {options.title}
                </h3>
              )}
              <p className="text-gray-600 whitespace-pre-line">{options.message}</p>
            </div>
            <div className="flex gap-3 p-4 pt-0">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleResponse(false)}
              >
                {options.cancelText || "Annuler"}
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => handleResponse(true)}
              >
                {options.confirmText || "Confirmer"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
