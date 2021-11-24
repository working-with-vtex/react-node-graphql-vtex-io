export const COLORS_ACRONYM = 'CM';
export const TEMPLATE_ACRONYM = 'CT';
export const TEMPLATE_INFORMATION_ACRONYM = 'TI';
export const SELLERS_ACRONYM = 'SC';
export const COLORS_APPROVAL_ACRONYM = 'CA';
export const COLOR_FIELDS = '?_fields=colorName,id,value,creationDate,type,variations,sellers,isLight';
export const COLOR_TEMPLATE_FIELDS =
  '?_fields=creationDate,nameTemplate,status,productsId,productsWithErrors,productsCreatedAutomatic,productsCreatedAutomaticId,sellerFieldName,sellerName,statusParam,to,from,total,user,id';
export const COLOR_TEMPLATE_INFORMATION_FIELDS =
  '?_fields=colorName,idTemplate,isLight,sellers,type,value,variations,id,creationDate';
export const SELLERS_FIELDS = '?_fields=sellerId,sellerName,specificationName,id';
export const COLOR_APPROVAL_FIELDS =
  '?_fields=sellerId,name,state,specificationValue,specificationName,id,creationDate';

export const KEY_SEARCH = '&_keyword=';
export const FILTER_BY_STATE_SEARCH = '&_where=state=';
export const FILTER_BY_TEMPLATE_ID_SEARCH = '&_where=idTemplate=';
export const SORT_COLOR_KEY_SEARCH = '&_sort=colorName ASC';
export const SORT_SELLER_KEY_SEARCH = '&_sort=sellerName ASC';
export const SORT_COLOR_APPROVAL_KEY_SEARCH = '&_sort=specificationName ASC';
export const SORT_COLOR_TEMPLATE_KEY_SEARCH = '&_sort=nameTemplate ASC';
export const SORT_COLOR_TEMPLATE_INFORMATION_KEY_SEARCH = '&_sort=value ASC';

export const config = {
  searchColorApi: `${COLORS_ACRONYM}/search${COLOR_FIELDS}`,
  getColorById: `${COLORS_ACRONYM}/documents/`,
  getColorTemplateById: `${TEMPLATE_ACRONYM}/documents/`,
  getSellerById: `${SELLERS_ACRONYM}/documents/`,
  searchSellerApi: `${SELLERS_ACRONYM}/search${SELLERS_FIELDS}`,
  searchColorApprovalApi: `${COLORS_APPROVAL_ACRONYM}/search${COLOR_APPROVAL_FIELDS}`,
  colorPath: '/admin/pco-admin/colors-admin/colors',
  colorDetailRoute: 'admin.app.manage-colors-admin-id',
  colorListRoute: 'admin.app.manage-colors-admin',
  colorCreationRoute: 'admin.app.manage-colors-admin-creation',
  colorTemplateCreationRoute: 'admin.app.manage-configuration-colors-admin-template-creation',
  colorAdminTabRoute: 'admin.app.manage-colors-admin-tab-id',
  colorConfiguration: 'admin.app.manage-configuration-colors-admin-tab-id',
  templateDetailRoute: 'admin.app.manage-configuration-colors-admin-template-id',
  sellerCreationRoute: 'admin.app.manage-seller-admin-creation',
  sellerDetailRoute: 'admin.app.manage-colors-admin-seller-id',
  searchTemplateApi: `${TEMPLATE_ACRONYM}/search${COLOR_TEMPLATE_FIELDS}`,
  searchTemplateInformationApi: `${TEMPLATE_INFORMATION_ACRONYM}/search${COLOR_TEMPLATE_INFORMATION_FIELDS}`
};
