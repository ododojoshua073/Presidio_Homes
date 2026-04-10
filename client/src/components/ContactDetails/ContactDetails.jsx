import { Box, Button, Group, TextInput, Text, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useContext } from "react";
import { FaInstagram, FaWhatsapp, FaFacebook, FaEnvelope } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext.jsx";
import UserDetailContext from "../../context/UserDetailContext";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { createResidency } from "../../utils/api";
import useProperties from "../../hooks/useProperties.jsx";

const ContactDetails = ({
  prevStep,
  propertyDetails,
  setPropertyDetails,
  setOpened,
  setActiveStep,
}) => {
  const form = useForm({
    initialValues: {
      agentInstagram: propertyDetails.agentInstagram || "",
      agentWhatsapp: propertyDetails.agentWhatsapp || "",
      agentFacebook: propertyDetails.agentFacebook || "",
      agentEmail: propertyDetails.agentEmail || "",
    },
    validate: {
      agentEmail: (value) =>
        value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Invalid email format"
          : null,
    },
  });

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
          agentInstagram: form.values.agentInstagram,
          agentWhatsapp: form.values.agentWhatsapp,
          agentFacebook: form.values.agentFacebook,
          agentEmail: form.values.agentEmail,
        },
        token
      ),
    onError: ({ response }) =>
      toast.error(response?.data?.message || "Failed to create", {
        position: "bottom-right",
      }),
    onSuccess: () => {
      toast.success("Property added successfully!", {
        position: "bottom-right",
      });
      // Reset form
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
          parkings: 0,
          bathrooms: 0,
          squareFeet: 0,
        },
      });
      setOpened(false);
      setActiveStep(0);
      refetchProperties();
    },
  });

  const handleSubmit = () => {
    const { hasErrors } = form.validate();
    if (!hasErrors) {
      mutate();
    }
  };

  return (
    <Box maw="100%" mx="auto" my="sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Stack spacing="md">
          <Box>
            <h3 style={{ marginBottom: "0.5rem", color: "#1f3e72", fontSize: "1.2rem" }}>
              📞 Add Your Contact Details (Optional)
            </h3>
            <Text size="sm" color="dimmed" mb="lg">
              Choose at least one way for potential renters to reach you. This helps interested tenants contact you quickly.
            </Text>
          </Box>

          <Box p="md" style={{ backgroundColor: "#f0f4f8", borderRadius: "8px", borderLeft: "4px solid #ff6b35" }}>
            <Text size="sm" weight={500} color="#1f3e72" mb="xs">
              💡 Tips:
            </Text>
            <Text size="xs" color="dimmed">
              • WhatsApp is fastest for instant communication
              <br />
              • Email for formal inquiries
              <br />
              • Instagram for portfolio showcase
            </Text>
          </Box>

          <Stack spacing="md" style={{ backgroundColor: "white", padding: "1rem", borderRadius: "8px" }}>
            <TextInput
              label="📱 Instagram Handle"
              placeholder="@yourusername"
              description="Your Instagram profile for property showcase"
              icon={<FaInstagram size={16} color="#E4405F" />}
              {...form.getInputProps("agentInstagram")}
            />

            <TextInput
              label="💬 WhatsApp Number"
              placeholder="+1 (555) 000-0000"
              description="Enable direct messaging with potential tenants"
              icon={<FaWhatsapp size={16} color="#25D366" />}
              {...form.getInputProps("agentWhatsapp")}
            />

            <TextInput
              label="👥 Facebook Profile"
              placeholder="facebook.com/yourprofile"
              description="Facebook link or profile name"
              icon={<FaFacebook size={16} color="#1877F2" />}
              {...form.getInputProps("agentFacebook")}
            />

            <TextInput
              label="✉️ Email Address"
              placeholder="your.email@example.com"
              description="Professional email for inquiries"
              icon={<FaEnvelope size={16} color="#ff6b35" />}
              {...form.getInputProps("agentEmail")}
            />
          </Stack>
        </Stack>

        <Group position="center" mt="xl">
          <Button
            variant="default"
            onClick={prevStep}
            disabled={isLoading}
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            style={{
              background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
              color: "white",
            }}
          >
            {isLoading ? "Publishing Property..." : "Publish Property"}
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default ContactDetails;
