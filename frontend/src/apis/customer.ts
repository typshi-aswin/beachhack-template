import { CustomerType } from "../types";
import { privateGateway } from "../../services/apiGateways";
import { manageCustomerUrls } from "../../services/urls";
import toast from "react-hot-toast";

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











