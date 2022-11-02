import { map, Observable } from "rxjs";

import { Utils } from "../../misc/utils";
import { Organization } from "../../models/domain/organization";
import { I18nService } from "../i18n.service";

export function canAccessVaultTab(org: Organization): boolean {
  return org.isManager;
}

export function canAccessSettingsTab(org: Organization): boolean {
  return org.isOwner;
}

export function canAccessMembersTab(org: Organization): boolean {
  return org.canManageUsers || org.canManageUsersPassword;
}

export function canAccessGroupsTab(org: Organization): boolean {
  return org.canManageGroups;
}

export function canAccessReportingTab(org: Organization): boolean {
  return org.canAccessReports || org.canAccessEventLogs;
}

export function canAccessBillingTab(org: Organization): boolean {
  return org.canManageBilling;
}

export function canManageCollections(org: Organization): boolean {
  return (
    org.canCreateNewCollections ||
    org.canEditAnyCollection ||
    org.canDeleteAnyCollection ||
    org.canViewAssignedCollections
  );
}

export function canAccessManageTab(org: Organization): boolean {
  return canAccessMembersTab(org) || canAccessGroupsTab(org) || canManageCollections(org);
}

export function canAccessOrgAdmin(org: Organization): boolean {
  return (
    canAccessMembersTab(org) ||
    canAccessGroupsTab(org) ||
    canAccessReportingTab(org) ||
    canAccessBillingTab(org) ||
    canAccessSettingsTab(org) ||
    canAccessVaultTab(org)
  );
}

export function getOrganizationById(id: string) {
  return map<Organization[], Organization | undefined>((orgs) => orgs.find((o) => o.id === id));
}

export function canAccessAdmin(i18nService: I18nService) {
  return map<Organization[], Organization[]>((orgs) =>
    orgs.filter(canAccessOrgAdmin).sort(Utils.getSortFunction(i18nService, "name"))
  );
}

export abstract class OrganizationService {
  organizations$: Observable<Organization[]>;

  get: (id: string) => Organization;
  getByIdentifier: (identifier: string) => Organization;
  getAll: (userId?: string) => Promise<Organization[]>;
  canManageSponsorships: () => Promise<boolean>;
  hasOrganizations: () => boolean;
}
