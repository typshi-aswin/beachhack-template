const buildURL = (basePath: string) => (endpoint: string) => `${basePath}${endpoint}`;

const manageAuthURL = buildURL('/auth');
const manageCustomerURL = buildURL(`/manage-customer`);
const manageOperation = buildURL(`/manage-operation`);

export const authUrls = {
    register: manageAuthURL(`/register/`),
    getAccessToken: manageAuthURL(`/get-access-token/`),
    login: manageAuthURL(`/login`)
}

export const manageCustomerUrls = {
    list: manageCustomerURL(`/list/`),
    info:(customer_id: string) => manageCustomerURL(`/${customer_id}/view`)
}

export const manageOperationUrls = {
    viewScore:(customer_id: string) => manageOperation(`/${customer_id}/view-score`),
    viewAllScore: manageOperation(`/all-customer-score/`),
}