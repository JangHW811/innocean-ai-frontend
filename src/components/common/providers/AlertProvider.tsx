"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "../../ui/alert-dialog";

interface AlertBaseConfig {
  title: string;
  description: string;
  onConfirm: () => void;
  confirmButtonText?: string;
}

type AlertConfig = AlertBaseConfig & {
  type?: "alert";
};

type ConfirmConfig = AlertBaseConfig & {
  type?: "confirm";
  onCancel?: () => void;
  cancelButtonText?: string;
};

type AlertStateConfig = AlertBaseConfig & {
  type: "alert" | "confirm";
  onCancel?: () => void;
  cancelButtonText?: string;
};

const AlertContext = createContext<
  | {
      alert: (config: AlertConfig) => void;
      confirm: (config: ConfirmConfig) => void;
      hideAlert: () => void;
    }
  | undefined
>(undefined);

const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alertConfig, setAlertConfig] = useState<AlertStateConfig | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const alert = (config: AlertConfig) => {
    setAlertConfig({
      ...config,
      type: "alert",
    });
    setIsOpen(true);
  };

  const confirm = (config: ConfirmConfig) => {
    setAlertConfig({
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      type: "confirm",
      ...config,
    });
    setIsOpen(true);
  };

  const hideAlert = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    setTimeout(() => {
      isOpen || setAlertConfig(null);
    }, 200);
  }, [isOpen]);
  return (
    <AlertContext.Provider value={{ alert, confirm, hideAlert }}>
      {children}
      <AlertDialog open={isOpen} onOpenChange={hideAlert}>
        <AlertDialogContent>
          <AlertDialogTitle>{alertConfig?.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {alertConfig?.description}
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={alertConfig?.onCancel}>
              {alertConfig?.cancelButtonText}
            </AlertDialogCancel>
            <AlertDialogAction onClick={alertConfig?.onConfirm}>
              {alertConfig?.confirmButtonText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertContext.Provider>
  );
};

const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

export { AlertProvider, useAlert };
