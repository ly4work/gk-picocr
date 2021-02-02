export const obj2FormData = (info) => {
  const formData = new window.FormData();
  Object.keys(info).forEach((k, i) => {
    formData.append(k, info[k]);
  });
  return formData;
};
