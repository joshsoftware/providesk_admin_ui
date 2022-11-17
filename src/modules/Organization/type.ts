export type createOrganizationPayloadType = {
  organization: OrganizationType;
};

export type OrganizationType = {
  name: string;
  domain: string[];
};

export type CreateOrganizationErrorType = {
  message: string;
  errors: string;
};
