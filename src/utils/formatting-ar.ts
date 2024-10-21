export function formatSiteResponse(site: any, lang: string) {
  if (!site) return null; // Handle null or undefined site

  const { name_ar, name, address, address_ar, ...rest } = site; // Omit name_ar from the object

  let arabicName = name_ar;
  if (!name_ar) arabicName = name;
  return {
    ...rest,
    address: lang === "AR" && address_ar ? address_ar : address,
    address_ar: address_ar,

    name_ar: name_ar,

    name: lang === "AR" ? arabicName : site.name, // Apply language logic
  };
}

export function formatMenuResponse(menu: any, lang: string) {
  if (!menu) return null; // Handle null or undefined menu

  const { name_ar, name, ...rest } = menu; // Omit name_ar from the object
  let arabicName = name_ar;
  if (!name_ar) arabicName = name;
  return {
    ...rest,
    name_ar: name_ar,

    name: lang === "AR" ? arabicName : menu.name, // Apply language logic
  };
}
