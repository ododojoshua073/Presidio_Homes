import React from "react";
import {
  TextInput,
  Box,
  Textarea,
  Group,
  Button,
  NumberInput,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { validateString } from "../../utils/common";

const BasicDetails = ({
  prevStep,
  nextStep,
  propertyDetails,
  setPropertyDetails,
}) => {
  const form = useForm({
    initialValues: {
      title: propertyDetails.title,
      description: propertyDetails.description,
      price: propertyDetails.price,
      forStatus: propertyDetails.listingType || "rent",
    },
    validate: {
      title: (value) => validateString(value),
      description: (value) => validateString(value),
      price: (value) =>
        value < 1000 ? "Must be greater than 999 dollars" : null,
      forStatus: (value) =>
        value === "rent" || value === "sale" ? null : "Invalid listing type",
    },
  });

  const { title, description, price, forStatus } = form.values;

  const handleSubmit = () => {
    const { hasErrors } = form.validate();
    if (!hasErrors) {
      setPropertyDetails((prev) => ({
        ...prev,
        title,
        description,
        price,
        forStatus,
      }));
      nextStep();
    }
  };

  return (
    <Box maw="50%" mx="auto" my="md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <TextInput
          withAsterisk
          label="Title"
          placeholder="Property Name"
          {...form.getInputProps("title")}
        />

        <Textarea
          placeholder="Description"
          label="Description"
          withAsterisk
          {...form.getInputProps("description")}
        />

        <NumberInput
          withAsterisk
          label="Price"
          placeholder="1000"
          min={0}
          {...form.getInputProps("price")}
        />

        <Select
          label="Listing Type"
          placeholder="Choose type"
          data={[
            { value: "rent", label: "For Rent" },
            { value: "sale", label: "For Sale" },
          ]}
          withAsterisk
          {...form.getInputProps("forStatus")}
        />

        <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
          <Button type="submit">Next step</Button>
        </Group>
      </form>
    </Box>
  );
};

export default BasicDetails;
