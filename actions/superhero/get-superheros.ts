"use server";

import { Superhero } from "@/lib/types";
import { getAccessToken } from "@/lib/get-access-token";

export const getSuperheroes = async (): Promise<{ superheroes: Superhero[] }> => {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/superheroes`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const data = await response.json();

    return { superheroes: data };
  } catch (error) {
    // console.log("SUPERHEROES_FETCH", error);
    return { superheroes: [] };
  }
};
