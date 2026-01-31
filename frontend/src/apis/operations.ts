import { privateGateway } from "../../services/apiGateways";
import { manageOperationUrls } from "../../services/urls";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { CustomerOperationViewType } from "../types";

export const getCustomerOperationView = async (
  customerId: string,
  setData: React.Dispatch<
    React.SetStateAction<CustomerOperationViewType | undefined>
  >
) => {
  try {
    const response = await privateGateway.get(
      manageOperationUrls.viewScore(customerId)
    );

    // API returns array → take first item
    const view = response.data.response?.[0];

    if (!view) {
      setData(undefined);
      return;
    }

    setData(view);
  } catch (err) {
    const error = err as AxiosError<any>;
    toast.error(
      error.response?.data?.message?.general?.[0] ||
        "Error fetching customer context"
    );
  }
};


export const getAllOperationViews = async (
  setData: React.Dispatch<
    React.SetStateAction<CustomerOperationViewType[] | undefined>
  >
) => {
  try {
    const response = await privateGateway.get(
      manageOperationUrls.viewAllScore
    );

    setData(response.data.response);
  } catch (err) {
    const error = err as AxiosError<any>;
    toast.error(
      error.response?.data?.message?.general?.[0] ||
        "Error fetching search results"
    );
  }
};


export type ChatMessagePayload = {
  id: string;
  role: "system" | "user" | "assistant";
  text: string;
};

type CreateOperationPayload = {
  primary_email: string;
  channel: string;
  chat_data: ChatMessagePayload[];
};

export const createOperation = async (payload: CreateOperationPayload) => {
  try {
    const response = await privateGateway.post(
      manageOperationUrls.create,
      payload
    );

    toast.success("Conversation saved successfully");
    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    toast.error(
      error.response?.data?.message?.general?.[0] ||
        "Error creating conversation"
    );
    throw err;
  }
};
