import {publicGateway} from '../../services/apiGateways';
import { authUrls } from '../../services/urls';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  name: string;
  email: string;
  id: string;
}


export const loginUser = async (payload: LoginPayload) => {
  const formData = new URLSearchParams();

  formData.append("email", payload.email);
  formData.append("password", payload.password);

  const response = await publicGateway.post(authUrls.login, formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const { access_token, refresh_token, name, email, id } =
    response.data.response as LoginResponse;

  // Persist auth data
  localStorage.setItem("accessToken", access_token);
  localStorage.setItem("refreshToken", refresh_token);
  localStorage.setItem("name", name);
  localStorage.setItem("email", email);
  localStorage.setItem("id", id);

  return response.data;
};