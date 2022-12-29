import { ApiService } from "../../abstractions/api.service";
import { OrganizationUserService } from "../../abstractions/organization-user/organization-user.service";
import {
  OrganizationUserAcceptRequest,
  OrganizationUserBulkConfirmRequest,
  OrganizationUserConfirmRequest,
  OrganizationUserInviteRequest,
  OrganizationUserResetPasswordEnrollmentRequest,
  OrganizationUserResetPasswordRequest,
  OrganizationUserUpdateGroupsRequest,
  OrganizationUserUpdateRequest,
} from "../../abstractions/organization-user/requests";
import {
  OrganizationUserBulkPublicKeyResponse,
  OrganizationUserBulkResponse,
  OrganizationUserDetailsResponse,
  OrganizationUserResetPasswordDetailsReponse,
  OrganizationUserUserDetailsResponse,
} from "../../abstractions/organization-user/responses";
import { ListResponse } from "../../models/response/list.response";

import { OrganizationUserBulkRequest } from "./requests";

export class OrganizationUserServiceImplementation implements OrganizationUserService {
  constructor(private apiService: ApiService) {}

  async getOrganizationUser(
    organizationId: string,
    id: string
  ): Promise<OrganizationUserDetailsResponse> {
    const r = await this.apiService.send(
      "GET",
      "/organizations/" + organizationId + "/users/" + id,
      null,
      true,
      true
    );
    return new OrganizationUserDetailsResponse(r);
  }

  async getOrganizationUserGroups(organizationId: string, id: string): Promise<string[]> {
    const r = await this.apiService.send(
      "GET",
      "/organizations/" + organizationId + "/users/" + id + "/groups",
      null,
      true,
      true
    );
    return r;
  }

  async getAllUsers(
    organizationId: string
  ): Promise<ListResponse<OrganizationUserUserDetailsResponse>> {
    const r = await this.apiService.send(
      "GET",
      "/organizations/" + organizationId + "/users",
      null,
      true,
      true
    );
    return new ListResponse(r, OrganizationUserUserDetailsResponse);
  }

  async getOrganizationUserResetPasswordDetails(
    organizationId: string,
    id: string
  ): Promise<OrganizationUserResetPasswordDetailsReponse> {
    const r = await this.apiService.send(
      "GET",
      "/organizations/" + organizationId + "/users/" + id + "/reset-password-details",
      null,
      true,
      true
    );
    return new OrganizationUserResetPasswordDetailsReponse(r);
  }

  postOrganizationUserInvite(
    organizationId: string,
    request: OrganizationUserInviteRequest
  ): Promise<void> {
    return this.apiService.send(
      "POST",
      "/organizations/" + organizationId + "/users/invite",
      request,
      true,
      false
    );
  }

  postOrganizationUserReinvite(organizationId: string, id: string): Promise<any> {
    return this.apiService.send(
      "POST",
      "/organizations/" + organizationId + "/users/" + id + "/reinvite",
      null,
      true,
      false
    );
  }

  async postManyOrganizationUserReinvite(
    organizationId: string,
    ids: string[]
  ): Promise<ListResponse<OrganizationUserBulkResponse>> {
    const r = await this.apiService.send(
      "POST",
      "/organizations/" + organizationId + "/users/reinvite",
      new OrganizationUserBulkRequest(ids),
      true,
      true
    );
    return new ListResponse(r, OrganizationUserBulkResponse);
  }

  postOrganizationUserAccept(
    organizationId: string,
    id: string,
    request: OrganizationUserAcceptRequest
  ): Promise<void> {
    return this.apiService.send(
      "POST",
      "/organizations/" + organizationId + "/users/" + id + "/accept",
      request,
      true,
      false
    );
  }

  postOrganizationUserConfirm(
    organizationId: string,
    id: string,
    request: OrganizationUserConfirmRequest
  ): Promise<void> {
    return this.apiService.send(
      "POST",
      "/organizations/" + organizationId + "/users/" + id + "/confirm",
      request,
      true,
      false
    );
  }

  async postOrganizationUsersPublicKey(
    organizationId: string,
    ids: string[]
  ): Promise<ListResponse<OrganizationUserBulkPublicKeyResponse>> {
    const r = await this.apiService.send(
      "POST",
      "/organizations/" + organizationId + "/users/public-keys",
      new OrganizationUserBulkRequest(ids),
      true,
      true
    );
    return new ListResponse(r, OrganizationUserBulkPublicKeyResponse);
  }

  async postOrganizationUserBulkConfirm(
    organizationId: string,
    request: OrganizationUserBulkConfirmRequest
  ): Promise<ListResponse<OrganizationUserBulkResponse>> {
    const r = await this.apiService.send(
      "POST",
      "/organizations/" + organizationId + "/users/confirm",
      request,
      true,
      true
    );
    return new ListResponse(r, OrganizationUserBulkResponse);
  }

  putOrganizationUser(
    organizationId: string,
    id: string,
    request: OrganizationUserUpdateRequest
  ): Promise<void> {
    return this.apiService.send(
      "PUT",
      "/organizations/" + organizationId + "/users/" + id,
      request,
      true,
      false
    );
  }

  putOrganizationUserGroups(
    organizationId: string,
    id: string,
    request: OrganizationUserUpdateGroupsRequest
  ): Promise<void> {
    return this.apiService.send(
      "PUT",
      "/organizations/" + organizationId + "/users/" + id + "/groups",
      request,
      true,
      false
    );
  }

  putOrganizationUserResetPasswordEnrollment(
    organizationId: string,
    userId: string,
    request: OrganizationUserResetPasswordEnrollmentRequest
  ): Promise<void> {
    return this.apiService.send(
      "PUT",
      "/organizations/" + organizationId + "/users/" + userId + "/reset-password-enrollment",
      request,
      true,
      false
    );
  }

  putOrganizationUserResetPassword(
    organizationId: string,
    id: string,
    request: OrganizationUserResetPasswordRequest
  ): Promise<void> {
    return this.apiService.send(
      "PUT",
      "/organizations/" + organizationId + "/users/" + id + "/reset-password",
      request,
      true,
      false
    );
  }

  deleteOrganizationUser(organizationId: string, id: string): Promise<any> {
    return this.apiService.send(
      "DELETE",
      "/organizations/" + organizationId + "/users/" + id,
      null,
      true,
      false
    );
  }

  async deleteManyOrganizationUsers(
    organizationId: string,
    ids: string[]
  ): Promise<ListResponse<OrganizationUserBulkResponse>> {
    const r = await this.apiService.send(
      "DELETE",
      "/organizations/" + organizationId + "/users",
      new OrganizationUserBulkRequest(ids),
      true,
      true
    );
    return new ListResponse(r, OrganizationUserBulkResponse);
  }

  revokeOrganizationUser(organizationId: string, id: string): Promise<void> {
    return this.apiService.send(
      "PUT",
      "/organizations/" + organizationId + "/users/" + id + "/revoke",
      null,
      true,
      false
    );
  }

  async revokeManyOrganizationUsers(
    organizationId: string,
    ids: string[]
  ): Promise<ListResponse<OrganizationUserBulkResponse>> {
    const r = await this.apiService.send(
      "PUT",
      "/organizations/" + organizationId + "/users/revoke",
      new OrganizationUserBulkRequest(ids),
      true,
      true
    );
    return new ListResponse(r, OrganizationUserBulkResponse);
  }

  restoreOrganizationUser(organizationId: string, id: string): Promise<void> {
    return this.apiService.send(
      "PUT",
      "/organizations/" + organizationId + "/users/" + id + "/restore",
      null,
      true,
      false
    );
  }

  async restoreManyOrganizationUsers(
    organizationId: string,
    ids: string[]
  ): Promise<ListResponse<OrganizationUserBulkResponse>> {
    const r = await this.apiService.send(
      "PUT",
      "/organizations/" + organizationId + "/users/restore",
      new OrganizationUserBulkRequest(ids),
      true,
      true
    );
    return new ListResponse(r, OrganizationUserBulkResponse);
  }
}
