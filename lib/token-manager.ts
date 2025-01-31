export const TokenManager = {
  getTokens: async () => {
    try {
      const response = await fetch("/api/auth/tokens");
      return response.json();
    } catch {
      return null;
    }
  },

  setTokens: async (accessToken: string, refreshToken: string) => {
    try {
      await fetch("/api/auth/tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken, refreshToken }),
      });
      return true;
    } catch {
      return false;
    }
  },

  clearTokens: async () => {
    try {
      await fetch("/api/auth/tokens", {
        method: "DELETE",
      });
      return true;
    } catch {
      return false;
    }
  },
};
