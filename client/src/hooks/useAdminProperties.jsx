import { useQuery, useMutation, useQueryClient } from "react-query";
import { getAllProperties, deleteProperty as deletePropertyAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const useAdminProperties = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { data: properties = [], isLoading, refetch } = useQuery({
    queryKey: "allAdminProperties",
    queryFn: () => getAllProperties(),
  });

  const deleteMutation = useMutation({
    mutationFn: async (propertyId) => {
      return await deletePropertyAPI(propertyId, token);
    },
    onMutate: (propertyId) => {
      // Optimistically remove from list
      queryClient.setQueryData("allAdminProperties", (old) =>
        old.filter((property) => property.id !== propertyId)
      );
    },
    onSuccess: () => {
      // Refetch to ensure data is consistent
      refetch();
    },
    onError: () => {
      // Refetch to restore data on error
      refetch();
    },
  });

  const deleteProperty = (propertyId, options = {}) => {
    deleteMutation.mutate(propertyId, {
      onSuccess: options.onSuccess,
      onError: options.onError,
    });
  };

  return {
    properties,
    isLoading,
    deleteProperty,
    isDeleting: deleteMutation.isLoading,
    refetch,
  };
};

export { useAdminProperties };
export default useAdminProperties;
