const buildURL = (basePath: string) => (endpoint: string) => `${basePath}${endpoint}`;

const manageAuthURL = buildURL('/auth');

export const authUrls = {
    register: manageAuthURL(`/register/`),
    getAccessToken: manageAuthURL(`/get-access-token/`),
    login: manageAuthURL(`/login`)
}