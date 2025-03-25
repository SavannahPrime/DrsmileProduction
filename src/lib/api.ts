
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Client Management
export const fetchClients = async () => {
  try {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("last_name", { ascending: true });

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error fetching clients:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to load clients",
      variant: "destructive",
    });
    return [];
  }
};

export const addClient = async (clientData: any) => {
  try {
    // First generate a temporary password and create the auth user
    const res = await supabase.functions.invoke("generate-temp-password", {
      body: { email: clientData.email },
    });

    if (!res.data.success) throw new Error(res.data.error || "Failed to create user");

    // Now create the client profile in our clients table
    const { data, error } = await supabase.from("clients").insert({
      auth_id: res.data.userId,
      first_name: clientData.first_name,
      last_name: clientData.last_name,
      email: clientData.email,
      phone: clientData.phone,
      date_of_birth: clientData.date_of_birth,
    }).select();

    if (error) throw error;

    // Send welcome email with temporary password
    await supabase.functions.invoke("send-email", {
      body: {
        to: clientData.email,
        subject: "Welcome to Dr. Smile Dental Clinic",
        html: `
          <h1>Welcome to Dr. Smile Dental Clinic!</h1>
          <p>Hello ${clientData.first_name},</p>
          <p>Your account has been created. You can login using:</p>
          <p><strong>Email:</strong> ${clientData.email}</p>
          <p><strong>Temporary Password:</strong> ${res.data.tempPassword}</p>
          <p>Please login and change your password as soon as possible.</p>
          <p>Best regards,<br>Dr. Smile Dental Team</p>
        `,
      },
    });

    return data[0];
  } catch (error: any) {
    console.error("Error adding client:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to add client",
      variant: "destructive",
    });
    return null;
  }
};

export const updateClient = async (id: string, clientData: any) => {
  try {
    const { data, error } = await supabase
      .from("clients")
      .update(clientData)
      .eq("id", id)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error: any) {
    console.error("Error updating client:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to update client",
      variant: "destructive",
    });
    return null;
  }
};

export const deleteClient = async (id: string, authId: string) => {
  try {
    // Delete the client from the auth system
    const { error: authError } = await supabase.auth.admin.deleteUser(authId);
    if (authError) throw authError;
    
    // The client record should be deleted automatically due to the CASCADE delete

    return true;
  } catch (error: any) {
    console.error("Error deleting client:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to delete client",
      variant: "destructive",
    });
    return false;
  }
};

// Booking Management
export const fetchBookings = async () => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        clients (id, first_name, last_name, email, phone)
      `)
      .order("date", { ascending: true });

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to load bookings",
      variant: "destructive",
    });
    return [];
  }
};

export const addBooking = async (bookingData: any) => {
  try {
    // First check for conflicts
    const conflictCheck = await supabase.functions.invoke("booking-conflict-check", {
      body: { 
        date: bookingData.date, 
        time: bookingData.time, 
        dentist: bookingData.dentist,
        duration: bookingData.duration || 60
      },
    });

    if (conflictCheck.data.hasConflict) {
      throw new Error("There is already a booking with this dentist at the selected time");
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert(bookingData)
      .select();

    if (error) throw error;

    // Get client email
    const { data: clientData } = await supabase
      .from("clients")
      .select("email, first_name")
      .eq("id", bookingData.client_id)
      .single();

    if (clientData) {
      // Send confirmation email
      await supabase.functions.invoke("send-email", {
        body: {
          to: clientData.email,
          subject: "Your Appointment Confirmation",
          html: `
            <h1>Appointment Confirmation</h1>
            <p>Hello ${clientData.first_name},</p>
            <p>Your appointment has been scheduled for:</p>
            <p><strong>Date:</strong> ${new Date(bookingData.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${bookingData.time}</p>
            <p><strong>Service:</strong> ${bookingData.service}</p>
            <p><strong>Dentist:</strong> ${bookingData.dentist}</p>
            <p>Thank you for choosing Dr. Smile Dental Clinic!</p>
          `,
        },
      });
    }

    return data[0];
  } catch (error: any) {
    console.error("Error adding booking:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to add booking",
      variant: "destructive",
    });
    return null;
  }
};

export const updateBooking = async (id: string, bookingData: any) => {
  try {
    // First check for conflicts
    const conflictCheck = await supabase.functions.invoke("booking-conflict-check", {
      body: { 
        date: bookingData.date, 
        time: bookingData.time, 
        dentist: bookingData.dentist,
        bookingId: id,
        duration: bookingData.duration || 60
      },
    });

    if (conflictCheck.data.hasConflict) {
      throw new Error("There is already a booking with this dentist at the selected time");
    }

    const { data, error } = await supabase
      .from("bookings")
      .update(bookingData)
      .eq("id", id)
      .select();

    if (error) throw error;

    // Get client email
    const { data: clientData } = await supabase
      .from("clients")
      .select("email, first_name")
      .eq("id", bookingData.client_id)
      .single();

    if (clientData) {
      // Send update email
      await supabase.functions.invoke("send-email", {
        body: {
          to: clientData.email,
          subject: "Your Appointment Has Been Updated",
          html: `
            <h1>Appointment Update</h1>
            <p>Hello ${clientData.first_name},</p>
            <p>Your appointment has been updated to:</p>
            <p><strong>Date:</strong> ${new Date(bookingData.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${bookingData.time}</p>
            <p><strong>Service:</strong> ${bookingData.service}</p>
            <p><strong>Dentist:</strong> ${bookingData.dentist}</p>
            <p>If you have any questions, please contact us.</p>
            <p>Thank you for choosing Dr. Smile Dental Clinic!</p>
          `,
        },
      });
    }

    return data[0];
  } catch (error: any) {
    console.error("Error updating booking:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to update booking",
      variant: "destructive",
    });
    return null;
  }
};

export const deleteBooking = async (id: string, clientId: string) => {
  try {
    // Get booking details before deleting
    const { data: bookingData } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .single();

    // Get client email
    const { data: clientData } = await supabase
      .from("clients")
      .select("email, first_name")
      .eq("id", clientId)
      .single();

    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", id);

    if (error) throw error;

    if (clientData && bookingData) {
      // Send cancellation email
      await supabase.functions.invoke("send-email", {
        body: {
          to: clientData.email,
          subject: "Your Appointment Has Been Cancelled",
          html: `
            <h1>Appointment Cancellation</h1>
            <p>Hello ${clientData.first_name},</p>
            <p>Your appointment scheduled for ${new Date(bookingData.date).toLocaleDateString()} at ${bookingData.time} has been cancelled.</p>
            <p>If you would like to reschedule, please visit our website or contact us directly.</p>
            <p>Thank you for choosing Dr. Smile Dental Clinic!</p>
          `,
        },
      });
    }

    return true;
  } catch (error: any) {
    console.error("Error deleting booking:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to delete booking",
      variant: "destructive",
    });
    return false;
  }
};

// Services Management
export const fetchServices = async () => {
  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error fetching services:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to load services",
      variant: "destructive",
    });
    return [];
  }
};

// Dentists Management
export const fetchDentists = async () => {
  try {
    const { data, error } = await supabase
      .from("dentists")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error fetching dentists:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to load dentists",
      variant: "destructive",
    });
    return [];
  }
};

// Analytics API
export const fetchBookingAnalytics = async (timeframe = 'year') => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*");

    if (error) throw error;
    
    // Process the data for analytics (this would normally be done server-side)
    // This is a simple client-side implementation
    const serviceGroups = data.reduce((acc: any, booking: any) => {
      if (!acc[booking.service]) {
        acc[booking.service] = 0;
      }
      acc[booking.service]++;
      return acc;
    }, {});
    
    const serviceData = Object.entries(serviceGroups).map(([name, value]) => ({
      name,
      value,
    }));
    
    // Group by dentist
    const dentistGroups = data.reduce((acc: any, booking: any) => {
      if (!acc[booking.dentist]) {
        acc[booking.dentist] = {
          patients: 0,
          revenue: 0,
        };
      }
      acc[booking.dentist].patients++;
      return acc;
    }, {});
    
    const dentistData = Object.entries(dentistGroups).map(([name, values]: [string, any]) => ({
      name,
      patients: values.patients,
      revenue: values.revenue,
    }));
    
    // Group by month for appointments
    const today = new Date();
    const monthsData = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(today.getFullYear(), i, 1);
      return {
        name: month.toLocaleString('default', { month: 'short' }),
        count: 0,
      };
    });
    
    data.forEach((booking: any) => {
      const date = new Date(booking.date);
      const monthIndex = date.getMonth();
      monthsData[monthIndex].count++;
    });
    
    return {
      serviceData,
      dentistData,
      monthsData,
    };
  } catch (error: any) {
    console.error("Error fetching analytics:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to load analytics data",
      variant: "destructive",
    });
    return {
      serviceData: [],
      dentistData: [],
      monthsData: [],
    };
  }
};

// Messaging API
export const fetchMessages = async () => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to load messages",
      variant: "destructive",
    });
    return [];
  }
};

export const sendMessage = async (messageData: any) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .insert(messageData)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error: any) {
    console.error("Error sending message:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to send message",
      variant: "destructive",
    });
    return null;
  }
};
