// ================= MESSAGE ENGINE =================
function getStatusMessage(status, name) {
  const base = `Hi ${name},\n\n`;

  switch (status) {
    case "Pending":
      return {
        subject: "We received your transportation request 🚐",
        message:
          base +
          "Thanks for reaching out to ISLA-Transpo.\n\n" +
          "Your transportation request has been received and is currently being reviewed by our team.\n\n" +
          "We’ll keep you updated once there’s progress regarding your trip.\n\n" +
          "Thank you for your patience and trust.",
      };

    case "Approved":
      return {
        subject: "Your transportation request has been approved ✅",
        message:
          base +
          "Good news! Your transportation request has been approved.\n\n" +
          "Our team is now preparing the necessary arrangements for your scheduled trip.\n\n" +
          "We’ll make sure everything is coordinated properly for a smooth and comfortable ride.\n\n" +
          "Thank you for choosing ISLA-Transpo.",
      };

    case "On the way":
      return {
        subject: "Your assigned vehicle is on the way 🚐",
        message:
          base +
          "Your assigned vehicle is now on the way to your pickup location.\n\n" +
          "Please be ready at the designated pickup area to help avoid delays.\n\n" +
          "Thank you, and we’ll see you shortly.",
      };

    case "Completed":
      return {
        subject: "Trip completed — thank you for riding with us 💙",
        message:
          base +
          "Your trip has been marked as completed.\n\n" +
          "We sincerely appreciate the opportunity to assist you during your journey.\n\n" +
          "Thank you for riding with ISLA-Transpo, and we hope to serve you again soon.",
      };

    case "Disapproved":
      return {
        subject: "Update regarding your transportation request",
        message:
          base +
          "Thank you for submitting your transportation request.\n\n" +
          "Unfortunately, we’re unable to approve the request at this time due to scheduling or operational limitations.\n\n" +
          "We appreciate your understanding and hope we can assist you on a future trip.",
      };

    default:
      return {
        subject: "Transportation request update",
        message:
          base +
          "There has been an update regarding your transportation request.\n\n" +
          "Please check the details included in this email.",
      };
  }
}