export const logout = () => {
  localStorage.clear();

  // hard redirect to fully reset app + axios state
  window.location.href = "/login";
};
