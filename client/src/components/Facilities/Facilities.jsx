import { useAuth } from "../../context/AuthContext.jsx";
import { Box, Button, Group, NumberInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useContext } from "react";
import UserDetailContext from "../../context/UserDetailContext";
import useProperties from "../../hooks/useProperties.jsx";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { createResidency } from "../../utils/api";

const Facilities = ({
  prevStep,
  nextStep,
  propertyDetails,
  setPropertyDetails,
  setOpened,
  setActiveStep,
}) => {
  const form = useForm({
    initialValues: {
      bedrooms: propertyDetails.facilities.bedrooms,
      squareFeet: propertyDetails.facilities.squareFeet,
      bathrooms: propertyDetails.facilities.bathrooms,
    },
    validate: {
      bedrooms: (value) =>
        value < 1 ? "Must have at least one bedroom" : null,
      bathrooms: (value) =>
        value < 1 ? "Must have at least one bathroom" : null,
      squareFeet: (value) =>
        value < 1 ? "Square feet must be greater than zero" : null,
    },
  });

  const { bedrooms, squareFeet, bathrooms } = form.values;
  const { user } = useAuth();
  const {
    userDetails: { token },
  } = useContext(UserDetailContext);
  const { refetch: refetchProperties } = useProperties();

  const { mutate, isLoading } = useMutation({
    mutationFn: () =>
      createResidency(
        {
          ...propertyDetails,
          userEmail: user?.email,
          facilities: { bedrooms, squareFeet, bathrooms },
        },
        token
      ),
    onError: ({ response }) =>
      toast.error(response?.data?.message || "Failed to create", {
        position: "bottom-right",
      }),
    onSuccess: () => {
      toast.success("Added Successfully", {
        position: "bottom-right",
      });
      setPropertyDetails({
        title: "",
        description: "",
        price: 0,
        country: "",
        city: "",
        address: "",
        image: null,
        images: [],
        forStatus: "",
        facilities: {
          bedrooms: 0,
          squareFeet: 0,
          bathrooms: 0,
        },
        agentInstagram: "",
        agentWhatsapp: "",
        agentFacebook: "",
        agentEmail: "",
      });
      setOpened(false);
      setActiveStep(0);
      refetchProperties();
    },
  });

  const handleSubmit = () => {
    const { hasErrors } = form.validate();
    if (!hasErrors) {
      // Update propertyDetails with facilities info
      setPropertyDetails((prev) => ({
        ...prev,
        facilities: { bedrooms, squareFeet, bathrooms },
      }));
      // Move to next step to collect social media details
      if (nextStep) {
        nextStep();
      } else {
        // Fallback: submit directly if no next step
        mutate();
      }
    }
  };

  return (
    <Box maw="30%" mx="auto" my="sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <NumberInput
          withAsterisk
          label="No of Bedrooms"
          min={0}
          {...form.getInputProps("bedrooms")}
        />

        <NumberInput
          withAsterisk
          label="Size (in square feet)"
          min={0}
          {...form.getInputProps("squareFeet")}
        />

        <NumberInput
          withAsterisk
          label="No of Bathrooms"
          min={0}
          {...form.getInputProps("bathrooms")}
        />

        <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
          <Button type="submit" color="green" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Add Property"}
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default Facilities;
