import { CustomerType } from "../types";
import { privateGateway } from "../../services/apiGateways";
import { manageCustomerUrls } from "../../services/urls";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const getAllCustomers = async(
    setData: React.Dispatch<React.SetStateAction<CustomerType[] | undefined>>,
) => {
        return privateGateway.get(manageCustomerUrls.list)
        .then((response) => {
            setData(response.data.response);
        })
        .catch((err) => {
            toast.error(err?.response?.data?.message?.general[0] || "Error fetching customers");
        })
}


export const getSingleCustomer = async (
  customerId: string,
  setData: React.Dispatch<React.SetStateAction<CustomerType | undefined>>
) => {
  try {
    const res = await privateGateway.get(
      manageCustomerUrls.info(customerId)
    );

    const customer = res.data.response?.[0];

    if (!customer) {
      setData(undefined);
      return;
    }

    setData({
      id: customerId,
      name: customer.name,
      primary_email: customer.primary_email,
      primary_phone: customer.primary_phone,
      last_interaction_at:
        customer.last_interaction_at === "None"
          ? null
          : new Date(customer.last_interaction_at),
      consent_flags: customer.consent_flags || {},
    });
  } catch (err) {
    const error = err as AxiosError<any>;

    toast.error(
      error.response?.data?.message?.general?.[0] ||
        "Error fetching customer info"
    );
  }
};











