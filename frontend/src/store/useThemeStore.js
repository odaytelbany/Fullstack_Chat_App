import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create(
  persist((set) => ({
    theme: "dark",
    setTheme: (theme) => {
        set({theme: theme})
    }
  }),
  {name: "themeStore"}
)
);
