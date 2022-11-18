import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { useAxios } from "../axios";
import {
  BeachesContext,
  IBeach,
  RegisterBeachProps,
  UpdateBeachProps,
} from "./context";

export interface IBeachesContextProviderProps {
  children: React.ReactNode;
}

const BeachesContextProvider: React.FC<IBeachesContextProviderProps> = ({
  children,
}) => {
  const [beaches, setBeaches] = useState<IBeach[]>([]);
  const queryClient = useQueryClient();

  const { authAxios } = useAxios();
  const { isLoading } = useQuery<IBeach[]>(
    ["user:beaches"],
    async () => {
      const { data } = await authAxios.get("/beaches");

      return data;
    },
    {
      onSuccess: (beaches) => {
        setBeaches(beaches);
      },
    }
  );

  const registerBeachMutation = useMutation(
    async (data: RegisterBeachProps) => {
      const { data: beach } = await authAxios.post("/beaches", data);

      return beach;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("user:beaches");
        queryClient.invalidateQueries("user:forecasts");
      },
    }
  );

  const registerBeach = async (data: RegisterBeachProps) => {
    await registerBeachMutation.mutateAsync(data);
  };

  const updateBeachMutation = useMutation(
    async ({ id, lat, lng, name, position }: UpdateBeachProps) => {
      const { data: beach } = await authAxios.put<IBeach>(`/beaches/${id}`, {
        lat,
        lng,
        name,
        position,
      });

      return beach;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("user:beaches");
        queryClient.invalidateQueries("user:forecasts");
      },
    }
  );

  const updateBeach = async (data: UpdateBeachProps) => {
    await updateBeachMutation.mutateAsync(data);
  };

  const deleteBeachMutation = useMutation(
    async (id: string) => {
      const { data } = await authAxios.delete(`/beaches/${id}`);

      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("user:beaches");
        queryClient.invalidateQueries("user:forecasts");
      },
    }
  );

  const deleteBeach = async (id: string) => {
    await deleteBeachMutation.mutateAsync(id);
  };

  return (
    <BeachesContext.Provider
      value={{ beaches, isLoading, registerBeach, updateBeach, deleteBeach }}
    >
      {children}
    </BeachesContext.Provider>
  );
};

export default BeachesContextProvider;
