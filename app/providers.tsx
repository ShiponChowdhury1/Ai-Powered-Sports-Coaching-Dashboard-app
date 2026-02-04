"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import GoogleAuthProvider from "@/features/auth/GoogleAuthProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <GoogleAuthProvider>{children}</GoogleAuthProvider>
    </Provider>
  );
}
